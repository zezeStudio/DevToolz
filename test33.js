const interfaces = {
    ProductDetails: "  brand: string;\n  sku: string;\n  dimensions: {\n    width: number;\n    height: number;\n  };",
    OrderItem: "  productId: string;\n  title: string;\n  price: number;\n  quantity: number;\n  details: ProductDetails;",
    CustomerProfile: "  id: string;\n  tier: \"GOLD\" | \"SILVER\" | \"BRONZE\";\n  isVerified: boolean;\n  tags: string[];",
    DashboardPayload: "  transactionId: string;\n  timestamp: string;\n  customer: CustomerProfile;\n  items: OrderItem[];\n  couponApplied?: string;"
};

const interfaceOrder = Object.keys(interfaces);
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
console.log("Rootname", rootName);

function resolveBody(body, depth = 0) {
      if (!body) return "";
      if (depth > 10) return '"{circular reference}"';
      let resolved = body.replace(/\?/g, "");

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
          () => `: [\n{${resolveBody(innerBody, depth + 1)}}\n]`
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
block = block.replace(/[;,]\\s*(?=\\})/g, "\n");
block = block.replace(/;/g, ",");
block = block.replace(/,\\s*\\}/g, "}");
block = `{\n${block}\n}`;

console.log(block);
