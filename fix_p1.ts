import fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

const brokenBlock1 = `    for (const [name, fields] of Object.entries(interfaces)) {
      output += \`export interface \${name} {
\${fields.join("
")}
}

\`;
    }`;

const fixedBlock1 = `    for (const [name, fields] of Object.entries(interfaces)) {
      output += \\\`export interface \\\${name} {\\n\\\${fields.join("\\n")}\\n}\\n\\n\\\`;
    }`;
    
content = content.replace(brokenBlock1, fixedBlock1.replace(/\\\\`/g, '`').replace(/\\\\\$/g, '$'));

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
