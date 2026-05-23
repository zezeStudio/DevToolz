const fs = require('fs');

let lines = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('output += \\`export interface \\${name} {\\n\\${fields.join("\\n")}\\n}\\n\\n\\`;')) {
      lines[i] = '      output += `export interface ${name} {\\n${fields.join("\\n")}\\n}\\n\\n\\n`;';
  }
}
fs.writeFileSync('src/pages/JsonToTsConverter.tsx', lines.join('\n'));
