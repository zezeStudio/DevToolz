const fs = require('fs');
let data = fs.readFileSync('src/lib/i18n.ts', 'utf8');

data = data.replace(/"home.pageTitle": "DevToolz - Essential Dev Tools"/g, '"home.pageTitle": "DevToolz - Essential Dev Tools & AI Prompt Utilities"');
data = data.replace(/"home.pageTitle": "DevToolz - 글로벌 개발자 필수 도구"/g, '"home.pageTitle": "DevToolz - 글로벌 개발자 필수 도구 & AI 프롬프트 최적화 툴"');
data = data.replace(/"home.pageTitle": "DevToolz - 必須の開発者ツール"/g, '"home.pageTitle": "DevToolz - 必須の開発者ツール＆AIプロンプトユーティリティ"');

data = data.replace(/"home.subtitle": "Boost your productivity with our suite of free, fast, and secure online utilities. No registration required."/g, '"home.subtitle": "Boost your productivity with our suite of free online utilities and AI prompt engineering tools. Format data, compress images, and optimize LLM context."');
data = data.replace(/"home.subtitle": "무료로 제공되는 빠르고 안전한 온라인 유틸리티로 생산성을 높이세요. 회원가입이 필요 없습니다."/g, '"home.subtitle": "무료로 제공되는 빠르고 안전한 온라인 유틸리티와 AI 프롬프트 엔지니어링 도구로 생산성을 높이세요. 데이터 포맷 변환부터 LLM 컨텍스트 최적화까지 완벽하게 지원합니다."');
data = data.replace(/"home.subtitle": "無料で高速、安全なオンラインユーティリティで生産性を向上させましょう。登録は不要です。"/g, '"home.subtitle": "無料で高速、安全なオンラインユーティリティとAIプロンプトエンジニアリングツールで生産性を向上させましょう。データフォーマットからLLMコンテキスト最適化まで完全にサポートします。"');

fs.writeFileSync('src/lib/i18n.ts', data);
console.log("SEO updated.");
