const fs = require('fs');

const path = 'src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const enKeys = `
      "functionBuilder.sample.desc": "Get the current weather in a given location",
      "functionBuilder.sample.param1Desc": "The city and state, e.g. San Francisco, CA",
      "functionBuilder.sample.param2Desc": "The temperature unit to use. Infer this from the users location.",
`;

const koKeys = `
      "functionBuilder.sample.desc": "주어진 지역의 현재 날씨를 가져옵니다.",
      "functionBuilder.sample.param1Desc": "도시와 주, 예: 서울특별시, 경기도 등",
      "functionBuilder.sample.param2Desc": "사용할 온도 단위입니다. 사용자의 위치에서 추론합니다.",
`;

const jaKeys = `
      "functionBuilder.sample.desc": "指定された地域の現在の天気を取得します。",
      "functionBuilder.sample.param1Desc": "都市と州、例: 東京都、大阪府など",
      "functionBuilder.sample.param2Desc": "使用する温度単位です。ユーザーの場所から推論します。",
`;

// Replace for English
content = content.replace(
  /"functionBuilder\.format": "Format",/,
  '"functionBuilder.format": "Format",\n' + enKeys
);

// Replace for Korean
content = content.replace(
  /"functionBuilder\.format": "포맷",/,
  '"functionBuilder.format": "포맷",\n' + koKeys
);

// Replace for Japanese
content = content.replace(
  /"functionBuilder\.format": "フォーマット",/,
  '"functionBuilder.format": "フォーマット",\n' + jaKeys
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated i18n.ts successfully!");
