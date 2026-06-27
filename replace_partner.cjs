const fs = require('fs');

let data = fs.readFileSync('src/lib/i18n.ts', 'utf8');

data = data.replace(/"home\.partners\.zezelab": "Zeze Lab"/g, '"home.partners.everydaycalcs": "Everyday Calcs"');
data = data.replace(/"home\.partners\.zezelab\.desc": "Innovative tech laboratory for cutting-edge solutions\."/g, '"home.partners.everydaycalcs.desc": "Simple and practical everyday calculators."');

data = data.replace(/"home\.partners\.zezelab": "제제랩 \(Zeze Lab\)"/g, '"home.partners.everydaycalcs": "에브리데이 계산기 (Everyday Calcs)"');
data = data.replace(/"home\.partners\.zezelab\.desc": "최첨단 솔루션을 위한 혁신적인 기술 연구소입니다\."/g, '"home.partners.everydaycalcs.desc": "일상생활에 필요한 다양하고 편리한 계산기 모음입니다."');

data = data.replace(/"home\.partners\.zezelab\.desc": "最先端のソリューションを提供する革新的な技術ラボです\."/g, '"home.partners.everydaycalcs.desc": "日常生活に役立つ便利な計算機ツールです。"');

fs.writeFileSync('src/lib/i18n.ts', data);
console.log("Updated i18n.ts");
