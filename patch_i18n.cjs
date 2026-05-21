const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

content = content.replace(
  /"json.placeholder": "\{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": \\\[\\"React\\", \\"TypeScript\\"\\\],\\n  \\"message\\": \\"Paste your JSON here\\"\\n\}",/,
  '"json.placeholder": "{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": [\\"React\\", \\"TypeScript\\"],\\n  \\"message\\": \\"Paste your JSON here\\"\\n}",\n      "json.outputPlaceholder": "The converted result will appear here",\n'
);

content = content.replace(
  /"json.placeholder": "\{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": \\\[\\"React\\", \\"TypeScript\\"\\\],\\n  \\"message\\": \\"여기에 JSON 데이터를 붙여넣으세요\\"\\n\}",/,
  '"json.placeholder": "{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": [\\"React\\", \\"TypeScript\\"],\\n  \\"message\\": \\"여기에 JSON 데이터를 붙여넣으세요\\"\\n}",\n      "json.outputPlaceholder": "변환된 결과가 여기에 표시됩니다",\n'
);

content = content.replace(
  /"json.placeholder": "\{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": \\\[\\"React\\", \\"TypeScript\\"\\\],\\n  \\"message\\": \\"ここにJSONを貼り付けてください\\"\\n\}",/,
  '"json.placeholder": "{\\n  \\"id\\": 1,\\n  \\"name\\": \\"Alice\\",\\n  \\"skills\\": [\\"React\\", \\"TypeScript\\"],\\n  \\"message\\": \\"ここにJSONを貼り付けてください\\"\\n}",\n      "json.outputPlaceholder": "変換された結果がここに表示されます",\n'
);

fs.writeFileSync('src/lib/i18n.ts', content);
console.log('patched i18n');
