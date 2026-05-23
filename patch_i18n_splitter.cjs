const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const enSource = `"promptInjector.copyToast": "Prompt copied to clipboard!",`;
const enAppend = `"promptSplitter.pageTitle": "AI Prompt Token Splitter | DevToolz",
      "promptSplitter.title": "Prompt Token Splitter",
      "promptSplitter.subtitle": "Split long texts into smaller LLM-friendly chunks.",
      "promptSplitter.tokenLimit": "Max Tokens per Chunk",
      "promptSplitter.addPrompts": "Add continuation instructions",
      "promptSplitter.splitBtn": "Split Text",
      "promptSplitter.copyBtn": "Copy Part {{part}}",
      "promptSplitter.copiedToast": "Part {{part}} copied!",
      "nav.promptSplitter": "Prompt Token Splitter",`;

code = code.replace(enSource, enSource + '\n      ' + enAppend);

const koSource = `"promptInjector.copyToast": "프롬프트가 클립보드에 복사되었습니다!",`;
const koAppend = `"promptSplitter.pageTitle": "AI 프롬프트 토큰 분할기 | DevToolz",
      "promptSplitter.title": "AI Prompt Token Splitter",
      "promptSplitter.subtitle": "긴 프롬프트를 모델 한계에 맞춰 여러 조각으로 나눕니다.",
      "promptSplitter.tokenLimit": "조각 당 최대 토큰수",
      "promptSplitter.addPrompts": "연달아 읽기 가이드라인 추가",
      "promptSplitter.splitBtn": "분할하기",
      "promptSplitter.copyBtn": "[{{part}}] 파트 복사",
      "promptSplitter.copiedToast": "파트 {{part}}번째 조각 복사 완료!",
      "nav.promptSplitter": "프롬프트 토큰 분할기",`;

code = code.replace(koSource, koSource + '\n      ' + koAppend);

const jaSource = `"promptInjector.copyToast": "プロンプトがクリップボードにコピーされました！",`;
const jaAppend = `"promptSplitter.pageTitle": "プロンプトトークン分割器 | DevToolz",
      "promptSplitter.title": "Prompt Token Splitter",
      "promptSplitter.subtitle": "長いテキストをモデル制限に合わせて分割します。",
      "promptSplitter.tokenLimit": "チャンクあたりの最大トークン",
      "promptSplitter.addPrompts": "継続ガイドラインを追加",
      "promptSplitter.splitBtn": "テキストを分割",
      "promptSplitter.copyBtn": "パート {{part}} をコピー",
      "promptSplitter.copiedToast": "パート {{part}} をコピーしました！",
      "nav.promptSplitter": "プロンプトトークン分割器",`;

code = code.replace(jaSource, jaSource + '\n      ' + jaAppend);

fs.writeFileSync('src/lib/i18n.ts', code);
console.log('patched i18n.ts');
