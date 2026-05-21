const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const tEv = `"json.help.title": "How to use JSON Formatter",`;
const tEr = `"json.help.title": "How to use JSON Formatter",\n      "json.ProcessingData": "Processing large JSON data...",`;
content = content.replace(tEv, tEr);

const tKv = `"json.help.title": "JSON 포매터 사용 방법",`;
const tKr = `"json.help.title": "JSON 포매터 사용 방법",\n      "json.ProcessingData": "대용량 데이터를 처리 중...",`;
content = content.replace(tKv, tKr);

const tJv = `"json.help.title": "JSONフォーマッタの使い方",`;
const tJr = `"json.help.title": "JSONフォーマッタの使い方",\n      "json.ProcessingData": "大量のデータを処理しています...",`;
content = content.replace(tJv, tJr);

fs.writeFileSync('src/lib/i18n.ts', content);
