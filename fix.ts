import * as fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');
content = content.replace("resolved = resolved.replace(/:\\\\s*({\\"'][^\\"']+{\\"'})(?:\\\\s*\\\\|\\\\s*(?:{\\"'][^\\"']+{\\"'}))+/g, ': $1');",
"resolved = resolved.replace(/:\\\\s*({\\"'][^\\"']+{\\"'})(?:\\\\s*\\\\|\\\\s*(?:{\\"'][^\\"']+{\\"'}))+/g, ': $1');");

// Let's just fix it properly by replacing the block.
let oldBlock = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\\\s*(["'][^"']+["'])(?:\\\\s*\\\\|\\\\s*(?:["'][^"']+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ': $1');\`;

let newBlock = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\s*(["'][^"']+["'])(?:\\s*\\|\\s*(?:["'][^"']+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\s*([0-9]+)(?:\\s*\\|\\s*[0-9]+)+/g, ': $1');\`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
console.log("Done");
