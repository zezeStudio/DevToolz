const fs = require('fs');

const code = `
interface Profile {
  avatarUrl: string;
  lastLogin: Date;
}
interface User {
  id: string;
  profile: Profile;
}
interface ApiResponse {
  data: User;
  tier: "GOLD" | "SILVER" | "BRONZE";
}
`;

const interfaces = {
    Profile: '  avatarUrl: string;\n  lastLogin: Date;',
    User: '  id: string;\n  profile: Profile;',
    ApiResponse: '  data: User;\n  tier: "GOLD" | "SILVER" | "BRONZE";'
};

function resolveBody(body, depth = 0) {
    if (!body) return "";
    if (depth > 10) return '"{circular reference}"';
    let resolved = body;

    // Literal Unions (e.g., "GOLD" | "SILVER")
    resolved = resolved.replace(/:\s*(["'][a-zA-Z0-9_\-\s]+["'])(?:\s*\|\s*(?:["'][a-zA-Z0-9_\-\s]+["']))+/g, ": $1");
    
    // Literal Number Unions (e.g., 1 | 2 | 3)
    resolved = resolved.replace(/:\s*([0-9]+)(?:\s*\|\s*[0-9]+)+/g, ": $1");

    // Primitives Arrays
    resolved = resolved
    .replace(/:\s*string\s*\[\]/g, ': ["sample string"]')
    .replace(/:\s*number\s*\[\]/g, ": [123]")
    .replace(/:\s*boolean\s*\[\]/g, ": [true]")
    .replace(/:\s*any\s*\[\]/g, ": [null]");

    // Primitives
    resolved = resolved
    .replace(/:\s*string/g, ': "sample string"')
    .replace(/:\s*number/g, ": 123")
    .replace(/:\s*boolean/g, ": true")
    .replace(/:\s*Date/g, ': "2026-05-22T00:00:00Z"')
    .replace(/:\s*any/g, ": null");

    // Custom Types
    for (const [name, innerBody] of Object.entries(interfaces)) {
    // match array structure
    const arrayRegex = new RegExp(\`:\\\\s*\${name}\\\\s*\\\\[\\\\]\`, "g");
    resolved = resolved.replace(
        arrayRegex,
        () => \`: [
{\${resolveBody(innerBody, depth + 1)}}
]\`,
    );

    // match object
    const typeRegex = new RegExp(\`:\\\\s*\${name}(?![a-zA-Z0-9_$])\`, "g");
    resolved = resolved.replace(
        typeRegex,
        () => \`: {
\${resolveBody(innerBody, depth + 1)}
}\`,
    );
    }

    // Fallback for unhandled custom types (like external or missing types)
    resolved = resolved.replace(/:\s*[A-Z][a-zA-Z0-9_$]*\s*\[\]/g, ": [{}]");
    resolved = resolved.replace(/:\s*[A-Z][a-zA-Z0-9_$]*/g, ": {}");

    return resolved;
}

let block = resolveBody(interfaces['ApiResponse']);

block = block.replace(/[;,]\s*(?=\})/g, "\n");
block = block.replace(/;/g, ",");
block = block.replace(/(^|[\{\,\n]\s*)([a-zA-Z0-9_$]+)\s*\??\s*:/g, '$1"$2":');
block = block.replace(/,\s*\}/g, "}");

// Make sure we form a valid JSON object
block = \`{\n\${block}\n}\`;

console.log(block);
