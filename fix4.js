const fs = require('fs');
let code = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

const regexToFind1 = "resolved = resolved.replace(/:\\\\s*({\\"'][^\\"']+{\\"'})(?:\\\\s*\\\\|\\\\s*(?:{\\"'][^\\"']+{\\"'}))+/g, ': $1');";
const regexToFindUnions = "resolved = resolved.replace(/:\\\\s*({\\"'][^\\"']+{\\"'})(?:\\\\s*\\\\|\\\\s*(?:{\\"'][^\\"']+{\\"'}))+/g, ': $1');"

// let's just split Code based on "      // Literal Unions"
let parts = code.split('      // Literal Unions (e.g., "GOLD" | "SILVER")');
let before = parts[0];

let parts2 = parts[1].split('      // Primitives Arrays');
let after = '      // Primitives Arrays' + parts2[1];

let newMiddle = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\s*(["'][a-zA-Z0-9_\\-\\s]+["'])(?:\\s*\\|\\s*(?:["'][a-zA-Z0-9_\\-\\s]+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\s*([0-9]+)(?:\\s*\\|\\s*[0-9]+)+/g, ': $1');

\`;

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', before + newMiddle + after);
console.log('Fixed');
