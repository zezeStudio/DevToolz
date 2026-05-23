import fs from 'fs';
let code = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

code = code.replace(/:\s\*\$\{name\}\(\?\!\[a-zA-Z0-9_\$\]\)/g, ":\\\\s*${name}(?![a-zA-Z0-9_$])");
code = code.replace(/:\s\*\$\{name\}\s\*\\\[\\\]/g, ":\\\\s*${name}\\\\s*\\\\[\\\\]");

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', code);
