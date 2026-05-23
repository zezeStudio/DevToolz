import * as fs from 'fs';

const path = './src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const enBlock = `"tokenCounter.longDesc.title": "About Token Counter & Price Estimator",
      "tokenCounter.longDesc.p1": "The Token Counter & Price Estimator is a specialized local tool designed to help developers and AI enthusiasts estimate the exact token count and cost of their API requests before sending them.",
      "tokenCounter.longDesc.p2": "Our implementation uses standard parsing algorithms (Byte Pair Encoding) locally in your browser. This means your private prompts, proprietary algorithms, and codebase snippets are never transmitted to a server for token counting—ensuring absolute data privacy and rapid feedback.",
      "tokenCounter.help.title": "How to use this tool",
      "tokenCounter.help.1": "Paste your prompt, system instructions, or context string into the editor.",
      "tokenCounter.help.2": "The tool will automatically calculate the characters, words, and exact token count in real-time.",
      "tokenCounter.help.3": "The Cost Estimation table automatically updates, showing how much it would cost to run this context size 1,000 times against popular LLMs like GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro.",
      "tokenCounter.help.4": "Click \\"Sample Data\\" to see a typical prompt example and verify the estimation features in action.",
      "tokenCounter.longDesc.p3": "We aim to keep our model rates up to date, but prices serve merely as an approximate estimation based on the input payload schemas provided by OpenAI, Anthropic, and Google. We calculate the baseline estimation as: (Input Tokens / 1,000,000) × Provider Input Rate (Per 1M tokens) × 1,000 Requests.",`;

const koBlock = `"tokenCounter.longDesc.title": "토큰 카운터 및 예상 비용 계산기에 관하여",
      "tokenCounter.longDesc.p1": "토큰 카운터 및 예상 비용 계산기는 개발자와 AI 사용자가 API 요청을 보내기 전에 정확한 토큰 수와 비용을 미리 계산해 볼 수 있도록 설계된 로컬 도구입니다.",
      "tokenCounter.longDesc.p2": "당사의 구현은 사용자의 브라우저 로컬에서 표준 파싱 알고리즘(Byte Pair Encoding)을 사용합니다. 즉, 개인 프롬프트, 알고리즘 및 코드베이스 스니펫은 토큰 계산을 위해 절대 서버로 전송되지 않으므로 절대적인 데이터 프라이버시가 보장되며 즉각적인 피드백을 제공합니다.",
      "tokenCounter.help.title": "사용 방법",
      "tokenCounter.help.1": "에디터 창에 프롬프트, 시스템 프롬프트 또는 컨텍스트 문자열을 붙여넣으세요.",
      "tokenCounter.help.2": "실시간으로 글자 수, 단어 수, 그리고 정확한 토큰 수를 자동 계산하여 표시합니다.",
      "tokenCounter.help.3": "비용 추정 테이블이 자동으로 업데이트되어 해당 컨텍스트 텍스트를 GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro와 같은 주요 LLM에 1,000회 호출할 때의 예상 비용을 보여줍니다.",
      "tokenCounter.help.4": " \\"샘플 데이터\\" 버튼을 클릭하여 일반적인 프롬프트 예시를 불러오고 비용 추정 기능을 테스트해보세요.",
      "tokenCounter.longDesc.p3": "당사는 최대한 최신 모델 요금을 유지하려고 노력하고 있으나, 표시되는 비용은 OpenAI, Anthropic, Google에서 제공하는 입력 페이로드 가격 정책에 근거한 예상치입니다. 기본 추정 공식은 다음과 같습니다: (입력 토큰 수 / 1,000,000) × 제공자 입력 단가(100만 토큰당) × 1,000회 요청.",`;

const jaBlock = `"tokenCounter.longDesc.title": "トークンカウンター＆コスト計算ツールについて",
      "tokenCounter.longDesc.p1": "トークンカウンター＆コスト計算ツールは、開発者やAI利用者がAPIリクエストを送信する前に、正確なトークン数とコストを見積もるためのローカル専用ツールです。",
      "tokenCounter.longDesc.p2": "当サイトの実装は、ブラウザ内でローカルに標準の解析アルゴリズム（Byte Pair Encoding）を使用します。つまり、個人のプロンプトやアルゴリズム、コードはトークン計算のためにサーバーに送信されることはなく、プライバシーが完全に保護されます。",
      "tokenCounter.help.title": "使用方法",
      "tokenCounter.help.1": "エディタにプロンプト、システム指示、またはコンテキスト文字列を貼り付けます。",
      "tokenCounter.help.2": "リアルタイムで文字数、単語数、および正確なトークン数が自動的に計算されます。",
      "tokenCounter.help.3": "コスト計算テーブルが自動的に更新され、GPT-4o、Claude 3.5 Sonnet、Gemini 1.5 Proなどの主要なLLMに対してこのテキストを1,000回リクエストした場合のコスト推計が表示されます。",
      "tokenCounter.help.4": "「サンプルデータ」ボタンをクリックすると、典型的なプロンプト例が読み込まれ、機能をテストできます。",
      "tokenCounter.longDesc.p3": "最新のモデル料金を保つよう努めていますが、表示される価格はOpenAI、Anthropic、Googleが提供する料金設定に基づいた概算値です。基本推計式は以下の通りです：（入力トークン / 1,000,000）× プロバイダー入力単価（100万トークンあたり）× 1,000リクエスト。",`;

content = content.replace(/"tokenCounter.placeholder": "Paste your prompt or text here...",/, `"tokenCounter.placeholder": "Paste your prompt or text here...",\n      ${enBlock}`);

content = content.replace(/"tokenCounter.placeholder": "기본 프롬프트 또는 텍스트를 이곳에 붙여넣으세요...",/, `"tokenCounter.placeholder": "기본 프롬프트 또는 텍스트를 이곳에 붙여넣으세요...",\n      ${koBlock}`);

content = content.replace(/"tokenCounter.placeholder": "プロンプトまたはテキストをここに貼り付けてください...",/, `"tokenCounter.placeholder": "プロンプトまたはテキストをここに貼り付けてください...",\n      ${jaBlock}`);

fs.writeFileSync(path, content);
console.log('Fixed i18n for token counter descriptions');
