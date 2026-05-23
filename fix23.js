const fs = require('fs');

let lines = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8').split('\n');

for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes('block = block.replace(/[;,]\\s*(?=\\})/g, "') && lines[i+1] === '");') {
       lines[i] = "    block = block.replace(/[;,]\\\\s*(?=\\\\\})/g, \"\\\\n\");";
       lines[i+1] = '';
   }
   if (lines[i].includes('      /(^|[\\{\\,') && lines[i+1] === ']\\s*)([a-zA-Z0-9_$]+)\\s*\\??\\s*:/g,' && lines[i+2].includes('\'$1"$2":\',')) {
       lines[i] = "    block = block.replace(/(^|[\\\\{\\\\,\\\\n]\\\\s*)([a-zA-Z0-9_$]+)\\\\s*\\\\??\\\\s*:/g, '$1\"$2\":');";
       lines[i+1] = '';
       lines[i+2] = '';
       lines[i+3] = '';
   }
   if (lines[i].includes('    block = `{') && lines[i+1] === '${block}' && lines[i+2] === '}`;') {
       lines[i] = "    block = `{\\n${block}\\n}`;";
       lines[i+1] = '';
       lines[i+2] = '';
   }
   if (lines[i].includes('                  ? \'{') && lines[i+1].includes('"id": 1,') && lines[i+4].includes('}\'')) {
       lines[i] = "                  ? '{\\n  \"id\": 1,\\n  \"name\": \"DevToolz\",\\n  \"features\": [\"conversion\", \"formatting\"]\\n}'";
       lines[i+1] = '';
       lines[i+2] = '';
       lines[i+3] = '';
       lines[i+4] = '';
   }
   if (lines[i].includes('                  : "interface User {') && lines[i+1].includes('id: string;') && lines[i+4].includes('}"')) {
       lines[i] = "                  : `interface User {\\n  id: string;\\n  name: string;\\n  isActive: boolean;\\n}`";
       lines[i+1] = '';
       lines[i+2] = '';
       lines[i+3] = '';
       lines[i+4] = '';
   }
}

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', lines.join('\n'));
