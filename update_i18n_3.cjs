const fs = require('fs');

const data = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const keysToAdd = {
  en: {
    "home.partners.title": "Our Network",
    "home.partners.zezelab": "Zeze Lab",
    "home.partners.zezelab.desc": "Innovative tech laboratory for cutting-edge solutions.",
    "home.partners.zezeworklab": "Zeze Work Lab",
    "home.partners.zezeworklab.desc": "Productivity and workspace optimization solutions.",
    "home.partners.inselfcolor": "In Self Color",
    "home.partners.inselfcolor.desc": "Personal color analysis and styling guide."
  },
  ko: {
    "home.partners.title": "파트너 사이트",
    "home.partners.zezelab": "제제랩 (Zeze Lab)",
    "home.partners.zezelab.desc": "최첨단 솔루션을 위한 혁신적인 기술 연구소입니다.",
    "home.partners.zezeworklab": "제제 워크랩 (Zeze Work Lab)",
    "home.partners.zezeworklab.desc": "생산성 및 업무 공간 최적화 솔루션을 제공합니다.",
    "home.partners.inselfcolor": "인셀프컬러 (In Self Color)",
    "home.partners.inselfcolor.desc": "퍼스널 컬러 진단 및 스타일링 가이드."
  },
  ja: {
    "home.partners.title": "パートナーサイト",
    "home.partners.zezelab": "Zeze Lab",
    "home.partners.zezelab.desc": "最先端のソリューションを提供する革新的な技術ラボです。",
    "home.partners.zezeworklab": "Zeze Work Lab",
    "home.partners.zezeworklab.desc": "生産性とワークスペース最適化のソリューション。",
    "home.partners.inselfcolor": "In Self Color",
    "home.partners.inselfcolor.desc": "パーソナルカラー分析とスタイリングガイド。"
  }
};

let updatedData = data;

Object.keys(keysToAdd).forEach(lang => {
  const marker = `${lang}: {\n    translation: {`;
  let replacement = `${marker}\n`;
  for (const [key, value] of Object.entries(keysToAdd[lang])) {
    replacement += `      "${key}": "${value}",\n`;
  }
  updatedData = updatedData.replace(marker, replacement);
});

fs.writeFileSync('src/lib/i18n.ts', updatedData);
console.log("Updated i18n.ts");
