import fs from 'fs';
let code = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

code = code.replace(/const reg = new RegExp\(\`:\\s\*\$\{name\}\(\?\!\[a-zA-Z0-9_\$\]\)\`\);/g, "const reg = new RegExp(`:\\\\s*${name}(?![a-zA-Z0-9_$])`);");
code = code.replace(/const regArray = new RegExp\(\`:\\s\*\$\{name\}\\s\*\\\[\\\]\`\);/g, "const regArray = new RegExp(`:\\\\s*${name}\\\\s*\\\\[\\\\]`);");
code = code.replace(/const arrayRegex = new RegExp\(\`:\\s\*\$\{name\}\\s\*\\\[\\\]\`,\s*"g"\);/g, "const arrayRegex = new RegExp(`:\\\\s*${name}\\\\s*\\\\[\\\\]`, \"g\");");
code = code.replace(/const typeRegex = new RegExp\(\`:\\s\*\$\{name\}\(\?\!\[a-zA-Z0-9_\$\]\)\`,\s*"g"\);/g, "const typeRegex = new RegExp(`:\\\\s*${name}(?![a-zA-Z0-9_$])`, \"g\");");

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', code);
