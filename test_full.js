import fs from 'fs';

function tsToJson(tsCode) {
    if (!tsCode.trim()) return "";

    const interfaces = {};
    const interfaceOrder = [];

    // Remove comments completely
    const cleanCode = tsCode.replace(/\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\//g, "");

    // Basic regex: match \`export interface NAME { ... }\`
    const regex = /\\s*export\\s+interface\\s+([a-zA-Z0-9_$]+)\\s*\\{/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(cleanCode)) !== null) {
      const startOfBlock = regex.lastIndex;
      let depthCounter = 1;
      let endOfBlock = startOfBlock;
      let foundEnd = false;

      for (let i = startOfBlock; i < cleanCode.length; i++) {
        if (cleanCode[i] === "{") depthCounter++;
        else if (cleanCode[i] === "}") depthCounter--;

        if (depthCounter === 0) {
          endOfBlock = i;
          foundEnd = true;
          break;
        }
      }

      if (foundEnd) {
        const interfaceName = match[1];
        const bodyContent = cleanCode.substring(startOfBlock, endOfBlock);
        interfaces[interfaceName] = bodyContent;
        interfaceOrder.push(interfaceName);
        // Move scanner
        regex.lastIndex = endOfBlock + 1;
      }
    }

    if (interfaceOrder.length === 0) {
      // Fallback: see if there's type alias `export type NAME = { ... }`
      const typeMatch = /export\\s+type\\s+([a-zA-Z0-9_$]+)\\s*=\\s*\\{/g;
      const tMatch = typeMatch.exec(cleanCode);
      if (tMatch) {
         // rough implementation for alias
         const startOfBlock = typeMatch.lastIndex;
         let endOfBlock = startOfBlock;
         let depthCounter = 1;
         let foundEnd = false;
         for (let i = startOfBlock; i < cleanCode.length; i++) {
           if (cleanCode[i] === "{") depthCounter++;
           else if (cleanCode[i] === "}") depthCounter--;
           if (depthCounter === 0) {
             endOfBlock = i;
             foundEnd = true;
             break;
           }
         }
         if (foundEnd) {
           interfaces["Root"] = cleanCode.substring(startOfBlock, endOfBlock);
           interfaceOrder.push("Root");
         }
      }
    }

    if (interfaceOrder.length === 0) {
      // Assume the whole thing is the body
      let body = cleanCode.trim();
      if (body.startsWith("{") && body.endsWith("}")) {
        body = body.slice(1, -1);
      }
      interfaces["Root"] = body;
      interfaceOrder.push("Root");
    }

    // Find root (heuristic: interface not used natively as a type in other interfaces)
    let rootName = interfaceOrder[interfaceOrder.length - 1]; // user suggested last interface
    for (const name of interfaceOrder) {
      let isReferenced = false;
      for (const otherName of interfaceOrder) {
        if (name === otherName) continue;
        const body = interfaces[otherName];
        const reg = new RegExp(`:\\\\s*\${name}(?![a-zA-Z0-9_$])`);
        const regArray = new RegExp(`:\\\\s*\${name}\\\\s*\\\\[\\\\]`);
        if (reg.test(body) || regArray.test(body)) {
          isReferenced = true;
          break;
        }
      }
      if (!isReferenced) {
        rootName = name;
        break;
      }
    }

    function resolveBody(body, depth = 0) {
      if (!body) return "";
      if (depth > 10) return '"{circular reference}"';
      let resolved = body.replace(/\\?/g, "");

      // Generic Union Type Processor
      resolved = resolved.replace(/:\\s*([^;,\\n]+)/g, (match, typeValue) => {
        if (typeof typeValue === 'string' && typeValue.includes('|')) {
          const firstValue = typeValue.split('|')[0].trim().replace(/["']/g, '');
          if (["string", "number", "boolean", "any", "Date"].includes(firstValue) || firstValue.endsWith('[]')) {
            return ": " + firstValue;
          }
          if (interfaces[firstValue]) {
            return ": " + firstValue;
          }
          return `: "${firstValue}"`;
        }
        return match;
      });

      // Primitives Arrays
      resolved = resolved
        .replace(/:\\s*string\\s*\\[\\]/g, ': ["sample string"]')
        .replace(/:\\s*number\\s*\\[\\]/g, ": [123]")
        .replace(/:\\s*boolean\\s*\\[\\]/g, ": [true]")
        .replace(/:\\s*any\\s*\\[\\]/g, ": [null]");

      // Primitives
      resolved = resolved
        .replace(/:\\s*string/g, ': "sample string"')
        .replace(/:\\s*number/g, ": 123")
        .replace(/:\\s*boolean/g, ": true")
        .replace(/:\\s*Date/g, ': "2026-05-22T00:00:00Z"')
        .replace(/:\\s*any/g, ": null");

      // Custom Types
      for (const [name, innerBody] of Object.entries(interfaces)) {
        // match array structure
        const arrayRegex = new RegExp(`:\\\\s*\${name}\\\\s*\\\\[\\\\]`, "g");
        resolved = resolved.replace(
          arrayRegex,
          () => `: [\n{\n${resolveBody(innerBody, depth + 1)}\n}\n]`
        );

        // match object
        const typeRegex = new RegExp(`:\\\\s*\${name}(?![a-zA-Z0-9_$])`, "g");
        resolved = resolved.replace(
          typeRegex,
          () => `: {\n${resolveBody(innerBody, depth + 1)}\n}`
        );
      }

      // Fallback for unhandled custom types (like external or missing types)
      resolved = resolved.replace(/:\\s*[A-Z][a-zA-Z0-9_$]*\\s*\\[\\]/g, ": [{}]");
      resolved = resolved.replace(/:\\s*[A-Z][a-zA-Z0-9_$]*/g, ": {}");

      // Wrap local keys for this depth level
      resolved = resolved.replace(/(^|[\\{\\,\\n\\[])\\s*([a-zA-Z0-9_$]+)\\s*:/g, '$1"$2":');

      return resolved;
    }

    let block = resolveBody(interfaces[rootName]);

    // Format fixing
    block = block.replace(/[;,]\\s*(?=\\})/g, "\n");
    block = block.replace(/;/g, ",");
    block = block.replace(/,\\s*\\}/g, "}");

    block = `{\n${block}\n}`;

    try {
      const parsed = eval("(" + block + ")");
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // Add trailing commas fix and parsing retry
      block = block.replace(/,\\s*\\]/g, "]");
      block = block.replace(/,\\s*\\}/g, "}");
      try {
        const parsed = eval("(" + block + ")");
        return JSON.stringify(parsed, null, 2);
      } catch (err) {
        return "{\n  // Error parsing generated structure.\n  // This can happen if custom types aren't fully mockable.\n}\n" + block;
      }
    }
}

const inputCode = \`
export interface ProductDetails {
  brand: string;
  sku: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  details: ProductDetails;
}

export interface CustomerProfile {
  id: string;
  tier: "GOLD" | "SILVER" | "BRONZE";
  isVerified: boolean;
  tags: string[];
}

export interface DashboardPayload {
  transactionId: string;
  timestamp: string;
  customer: CustomerProfile;
  items: OrderItem[];
  couponApplied?: string;
}
\`;

console.log(tsToJson(inputCode));
