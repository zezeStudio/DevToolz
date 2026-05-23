import * as fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

let newBlock = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\\\s*(["'][^"']+["'])(?:\\\\s*\\\\|\\\\s*(?:["'][^"']+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ': $1');\`;

// We just replace the code using simple match.
content = content.replace(/\\/\\/ Literal Unions.*\\/\\/ Literal Number Unions[^\n]+\\n[^\n]+\\n/ms, newBlock + "\\n");

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
console.log("Done");
