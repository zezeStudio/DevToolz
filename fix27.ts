import * as fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

content = content.replace("    block = block.replace(\n    block = block.replace", "    block = block.replace");

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
