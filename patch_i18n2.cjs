const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const t2 = `"json.placeholder": "{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": [\\"React\\", \\"TypeScript\\"],\\n  \\"message\\": \\"Paste your JSON here\\"\\n}",`;
const r2 = t2 + '\n      "json.outputPlaceholder": "The converted result will appear here",';
content = content.replace(t2, r2);

const t3 = `"json.placeholder": "{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": [\\"React\\", \\"TypeScript\\"],\\n  \\"message\\": \\"여기에 JSON 데이터를 붙여넣으세요\\"\\n}",`;
const r3 = t3 + '\n      "json.outputPlaceholder": "변환된 결과가 여기에 표시됩니다",';
content = content.replace(t3, r3);

const t4 = `"json.placeholder": "{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": [\\"React\\", \\"TypeScript\\"],\\n  \\"message\\": \\"ここにJSONを貼り付けてください\\"\\n}",`;
const r4 = t4 + '\n      "json.outputPlaceholder": "変換された結果がここに表示されます",';
content = content.replace(t4, r4);

fs.writeFileSync('src/lib/i18n.ts', content);
console.log('patched i18n safely');
