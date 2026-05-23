import * as fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');
content = content.replace(/return '\\{/g, 'return \\`{');
content = content.replace(/\\}';/g, '}\\`;');

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
