import fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

const targetStr = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\\\s*(["'][^"']+["'])(?:\\\\s*\\\\|\\\\s*(?:["'][^"']+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ': $1');\`;

const newStr = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\s*(["'][a-zA-Z0-9_\\-\\s]+["'])(?:\\s*\\|\\s*(?:["'][a-zA-Z0-9_\\-\\s]+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\s*([0-9]+)(?:\\s*\\|\\s*[0-9]+)+/g, ': $1');\`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
console.log('Done!');
