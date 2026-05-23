const fs = require('fs');

let lines = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8').split('\\n');

let newLines = [
    '      // Literal Unions (e.g., "GOLD" | "SILVER")',
    '      resolved = resolved.replace(/:\\\\s*(["\\'][a-zA-Z0-9_\\\\-\\\\s]+["\\'])(?:\\\\s*\\\\|\\\\s*(?:["\\'][a-zA-Z0-9_\\\\-\\\\s]+["\\']))+/g, \\': $1\\');',
    '      ',
    '      // Literal Number Unions (e.g., 1 | 2 | 3)',
    '      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, \\': $1\\');'
];

lines.splice(160, 5, ...newLines);

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', lines.join('\\n'), 'utf-8');
console.log("Success");
