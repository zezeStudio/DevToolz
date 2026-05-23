const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const enSource = `"nav.promptSplitter": "Prompt Token Splitter",`;
const enAppend = `"nav.llmPlayground": "LLM Parameter Playground",
      "llmPlayground.pageTitle": "LLM Parameter Playground | DevToolz",
      "llmPlayground.title": "LLM Parameter Playground",
      "llmPlayground.subtitle": "Interactive guide to understand AI parameters like Temperature, Top-P, and Penalties.",
      "nav.xmlGuardrail": "XML Guardrail Generator",
      "xmlGuardrail.pageTitle": "XML Guardrail Generator | DevToolz",
      "xmlGuardrail.title": "XML Guardrail Generator",
      "xmlGuardrail.subtitle": "Instantly generate Claude/GPT-optimized XML system prompts.",
      "nav.fewShotBuilder": "Few-Shot Example Builder",
      "fewShotBuilder.pageTitle": "Few-Shot Example Builder | DevToolz",
      "fewShotBuilder.title": "Few-Shot Example Builder",
      "fewShotBuilder.subtitle": "Construct optimized few-shot examples in Markdown, XML, or JSON formats.",`;

code = code.replace(enSource, enSource + '\n      ' + enAppend);

const koSource = `"nav.promptSplitter": "프롬프트 토큰 분할기",`;
const koAppend = `"nav.llmPlayground": "LLM 파라미터 플레이그라운드",
      "llmPlayground.pageTitle": "LLM 파라미터 가이드 | DevToolz",
      "llmPlayground.title": "LLM Parameter Playground",
      "llmPlayground.subtitle": "Temperature, Top-P 등 AI의 답변 성향을 결정하는 파라미터를 시각적으로 이해해보세요.",
      "nav.xmlGuardrail": "XML 가드레일 제너레이터",
      "xmlGuardrail.pageTitle": "XML 가드레일 자동 생성기 | DevToolz",
      "xmlGuardrail.title": "XML Guardrail Generator",
      "xmlGuardrail.subtitle": "출력 형식과 제한 사항만 입력하면 Claude/GPT에 최적화된 XML 구조의 프롬프트 뼈대를 생성합니다.",
      "nav.fewShotBuilder": "퓨샷 예시 빌더",
      "fewShotBuilder.pageTitle": "퓨샷(Few-Shot) 예시 빌더 | DevToolz",
      "fewShotBuilder.title": "Few-Shot Example Builder",
      "fewShotBuilder.subtitle": "AI에게 더 나은 문맥을 제공하기 위한 퓨샷 예시를 구성하고 변환하세요.",`;

code = code.replace(koSource, koSource + '\n      ' + koAppend);

const jaSource = `"nav.promptSplitter": "プロンプトトークン分割器",`;
const jaAppend = `"nav.llmPlayground": "LLMパラメータープレイグラウンド",
      "llmPlayground.pageTitle": "LLMパラメーターガイド | DevToolz",
      "llmPlayground.title": "LLM Parameter Playground",
      "llmPlayground.subtitle": "TemperatureやTop-Pなど、AIの回答傾向を決定するパラメーターを視覚的に理解します。",
      "nav.xmlGuardrail": "XMLガードレールジェネレーター",
      "xmlGuardrail.pageTitle": "XMLガードレール自動生成 | DevToolz",
      "xmlGuardrail.title": "XML Guardrail Generator",
      "xmlGuardrail.subtitle": "出力形式と制限事項を入力するだけで、Claude/GPTに最適化されたXML構造のプロンプトを生成します。",
      "nav.fewShotBuilder": "Few-Shot ビルダー",
      "fewShotBuilder.pageTitle": "Few-Shot サンプルビルダー | DevToolz",
      "fewShotBuilder.title": "Few-Shot Example Builder",
      "fewShotBuilder.subtitle": "AIに優れたコンテキストを提供するためのFew-Shotの例を構成します。",`;

code = code.replace(jaSource, jaSource + '\n      ' + jaAppend);

fs.writeFileSync('src/lib/i18n.ts', code);
console.log('patched i18n.ts');
