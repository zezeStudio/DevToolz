const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

// EN
code = code.replace(
  /"nav\.systemPrompt": "System Prompt Generator",/g,
  '"nav.systemPrompt": "System Prompt Generator",\n      "nav.promptInjector": "Prompt Variable Injector",\n      "promptInjector.pageTitle": "Prompt Variable Injector | DevToolz",\n      "promptInjector.title": "Prompt Variable Injector",\n      "promptInjector.subtitle": "Dynamically inject variables into your AI prompt templates.",'
);

// KO
code = code.replace(
  /"nav\.systemPrompt": "시스템 프롬프트 생성기",/g,
  '"nav.systemPrompt": "시스템 프롬프트 생성기",\n      "nav.promptInjector": "프롬프트 변수 주입 템플릿 빌더",\n      "promptInjector.pageTitle": "프롬프트 변수 주입 템플릿 빌더 | DevToolz",\n      "promptInjector.title": "Prompt Variable Injector",\n      "promptInjector.subtitle": "반복적으로 사용하는 프롬프트 템플릿 문자열 사이에 변수를 지정해 값을 쉽게 치환하세요.",'
);

// JA
code = code.replace(
  /"nav\.systemPrompt": "システムプロンプト生成器",/g,
  '"nav.systemPrompt": "システムプロンプト生成器",\n      "nav.promptInjector": "プロンプト変数ジェネレーター",\n      "promptInjector.pageTitle": "プロンプト変数ジェネレーター | DevToolz",\n      "promptInjector.title": "Prompt Variable Injector",\n      "promptInjector.subtitle": "プロンプトテンプレートに動的に変数を注入します。",'
);

fs.writeFileSync('src/lib/i18n.ts', code);
console.log('patched i18n.ts');
