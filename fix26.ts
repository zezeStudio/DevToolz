import * as fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// Fix line 64
content = content.replace(/output \+\= \\`export interface \\\$\{name\} \{\\n\\\$\{fields\.join\("\\n"\)\}\\n\}\\n\\n\\`;/, 'output += `export interface ${name} {\\n${fields.join("\\n")}\\n}\\n\\n`;');

// Fix line 215 duplication
content = content.replace(/block = block\.replace\(\n\s*block = block\.replace\(\/\(\^\|\[\\\\\{\\\\,\\\\n\]\\\\s\*\)\(\[a\-zA\-Z0\-9_\$\]\+\)\\\\s\*\(\\\\\?\)\?\\\\s\*:.*?\);/, "    block = block.replace(/(^|[\\\\{\\\\,\\\\n]\\\\s*)([a-zA-Z0-9_$]+)\\\\s*\\\\??\\\\s*:/g, '$1\"$2\":');");
fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
