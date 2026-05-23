const fs = require('fs');

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

const targetLines = [
'      // Literal Unions (e.g., "GOLD" | "SILVER")',
'      resolved = resolved.replace(/:\\\\s*(["\'][^"\']+["\'])(?:\\\\s*\\\\|\\\\s*(?:["\'][^"\']+["\']))+/g, ": $1");',
'      ',
'      // Literal Number Unions (e.g., 1 | 2 | 3)',
'      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ": $1");'
].join('\\n');

const newLines = [
'      // Literal Unions (e.g., "GOLD" | "SILVER")',
'      resolved = resolved.replace(/:\\\\s*(["\'][a-zA-Z0-9_\\\\-\\\\s]+["\'])(?:\\\\s*\\\\|\\\\s*(?:["\'][a-zA-Z0-9_\\\\-\\\\s]+["\']))+/g, ": $1");',
'      ',
'      // Literal Number Unions (e.g., 1 | 2 | 3)',
'      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ": $1");'
].join('\\n');

content = content.replace(targetLines, newLines);

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
console.log('Done!');
