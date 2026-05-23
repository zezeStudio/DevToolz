import fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// The line is literally:
let theLine = '      // Literal Unions (e.g., "GOLD" | "SILVER")\\\\n      resolved = resolved.replace(/:\\\\s*(["\\'][a-zA-Z0-9_\\\\-\\\\s]+["\\'])(?:\\\\s*\\\\|\\\\s*(?:["\\'][a-zA-Z0-9_\\\\-\\\\s]+["\\']))+/g, ": $1");\\\\n      \\\\n      // Literal Number Unions (e.g., 1 | 2 | 3)\\\\n      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ": $1");\\\\n\\\\n      // Primitives Arrays';

let newLines = '      // Literal Unions (e.g., "GOLD" | "SILVER")\\n' +
'      resolved = resolved.replace(/:\\\\s*(["\\'][a-zA-Z0-9_\\\\-\\\\s]+["\\'])(?:\\\\s*\\\\|\\\\s*(?:["\\'][a-zA-Z0-9_\\\\-\\\\s]+["\\']))+/g, ": $1");\\n' +
'      \\n' +
'      // Literal Number Unions (e.g., 1 | 2 | 3)\\n' +
'      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ": $1");\\n' +
'\\n' +
'      // Primitives Arrays';

content = content.replace(theLine, newLines);

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
console.log("Success");
