const fs = require('fs');
let code = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// Find the index of "// Literal Unions (e.g., "GOLD" | "SILVER")"
let start = code.indexOf('// Literal Unions (e.g., "GOLD" | "SILVER")');
let end = code.indexOf('// Primitives Arrays', start);

let newCode = 
'      // Literal Unions (e.g., "GOLD" | "SILVER")\\n' +
'      resolved = resolved.replace(/:\\\\s*(["\\'][^"\\']+["\\'])(?:\\\\s*\\\\|\\\\s*(?:["\\'][^"\\']+["\\']))+/g, \\': $1\\');\\n' +
'      \\n' +
'      // Literal Number Unions (e.g., 1 | 2 | 3)\\n' +
'      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, \\': $1\\');\\n\\n      ';

code = code.substring(0, start) + newCode + code.substring(end);
fs.writeFileSync('src/pages/JsonToTsConverter.tsx', code);
console.log('Fixed');
