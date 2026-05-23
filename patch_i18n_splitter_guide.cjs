const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf-8');

const enTarget = `"promptSplitter.copiedToast": "Part {{part}} copied!",`;
const enReplacement = `"promptSplitter.copiedToast": "Part {{part}} copied!",
      "promptSplitter.guide.title": "How to Use & Tips",
      "promptSplitter.guide.desc": "This tool chunks extremely long source code or text that exceeds the context limits of LLMs (like Claude, GPT) into smaller, more easily digestible sizes.",
      "promptSplitter.guide.1.title": "Token-based Intelligent Splitting",
      "promptSplitter.guide.1.desc": "Text is accurately cut based on GPT token encoding rather than raw character counts, intelligently preserving paragraph breaks to maintain your context.",
      "promptSplitter.guide.2.title": "Automatic Guideline Injection",
      "promptSplitter.guide.2.desc": "Simply splitting text may cause the AI to reply prematurely. We automatically wrap your chunks with context instructions like \\"Please wait until the final part before responding.\\"",
      "promptSplitter.guide.3.title": "Smart UX and Copying",
      "promptSplitter.guide.3.desc": "If short text is entered, it smartly bypasses splitting and marks it as a \\"Single Part\\" for your clarity. If properly chunked, you can use the \\"Copy All\\" facility to copy everything instantly.",
      "promptSplitter.toast.copyAllReady": "All parts copied to clipboard!",
      "promptSplitter.toast.singlePart": "💡 The input text ({{current}} tokens) is smaller than the limit ({{limit}} tokens). Outputted as a single part.",
      "promptSplitter.singlePartTitle": "Ready as a Single Part (No split needed)",
      "promptSplitter.fullText": "Full Text",
      "promptSplitter.copyAll": "Copy All Parts",`;

const koTarget = `"promptSplitter.copiedToast": "파트 {{part}} 복사됨!",`;
const koReplacement = `"promptSplitter.copiedToast": "파트 {{part}} 복사됨!",
      "promptSplitter.guide.title": "사용 가이드 및 팁",
      "promptSplitter.guide.desc": "이 도구는 Claude, GPT 등 LLM(대규모 언어 모델)의 컨텍스트 제한을 넘는 엄청나게 긴 소스 코드나 텍스트를, 모델이 소화하기 좋은 크기로 쪼개주는(Chunking) 기능입니다.",
      "promptSplitter.guide.1.title": "토큰(Token) 기반의 지능적 분할",
      "promptSplitter.guide.1.desc": "단순 글자 수(Character)가 아닌 실제 AI가 인식하는 토큰(GPT Encoding) 기준으로 정확성을 높이고, 문단의 흐름이 끊기지 않도록 문맥('Enter 두 번')을 최대한 유지하면서 자릅니다.",
      "promptSplitter.guide.2.title": "대기 명령어(가이드라인) 자동 주입",
      "promptSplitter.guide.2.desc": "단순히 텍스트만 나누어 보내면 AI가 중간에 성급하게 답변할 수 있습니다. 이를 막기 위해 각 청크 앞뒤에 \\"아직 답변하지 말고, 전체 텍스트가 끝날 때까지 대기해 줘\\"라는 시스템 메시지를 자동으로 붙여줍니다.",
      "promptSplitter.guide.3.title": "스마트 상태 표시 및 전체 복사",
      "promptSplitter.guide.3.desc": "설정한 Max Token 범위를 넘지 않는다면, 무의미한 분할 대신 \\"단일 파트\\"로 표기하여 상태를 직관적으로 알려줍니다. 2개 이상으로 쪼개졌다면 클릭 한 번에 모두 클립보드에 담을 수 있는 \\"전체 파트 복사\\" 버튼이 활성화됩니다.",
      "promptSplitter.toast.copyAllReady": "모든 파트가 텍스트 형태로 복사되었습니다!",
      "promptSplitter.toast.singlePart": "💡 입력된 텍스트({{current}}개 토큰)가 설정된 제한({{limit}}개)보다 작아 분할하지 않고 한 번에 출력했습니다!",
      "promptSplitter.singlePartTitle": "단일 파트로 산출 완료 (분할 필요 없음)",
      "promptSplitter.fullText": "Full Text",
      "promptSplitter.copyAll": "전체 파트 복사 (Copy All)",`;

const jaTarget = `"promptSplitter.copiedToast": "パート {{part}} がコピーされました！",`;
const jaReplacement = `"promptSplitter.copiedToast": "パート {{part}} がコピーされました！",
      "promptSplitter.guide.title": "使い方ガイドとヒント",
      "promptSplitter.guide.desc": "このツールは、ClaudeやGPTなどのLLMのコンテキスト制限を超える非常に長いコードやテキストを、モデルが処理しやすいサイズに分割(Chunking)する機能です。",
      "promptSplitter.guide.1.title": "トークン(Token)ベースのインテリジェントな分割",
      "promptSplitter.guide.1.desc": "単純な文字数ではなく、AIが認識するトークンを基準に正確に分割し、文脈が途切れないよう改行を可能な限り維持します。",
      "promptSplitter.guide.2.title": "待機コマンド(ガイドライン)の自動注入",
      "promptSplitter.guide.2.desc": "ただテキストを分けるだけでは、AIが途中で回答してしまう可能性があります。これを防ぐため、各パートには「すべてのテキストが送信されるまで待機して」というシステムメッセージが自動で挿入されます。",
      "promptSplitter.guide.3.title": "スマートステータス表示と一括コピー",
      "promptSplitter.guide.3.desc": "Max Tokenの範囲を超えない場合は、無意味な分割を行わず「単一パート」として状態を直感的に表示します。2つ以上に分割された場合は「すべてコピー」ボタンが有効になります。",
      "promptSplitter.toast.copyAllReady": "すべてのパートがコピーされました！",
      "promptSplitter.toast.singlePart": "💡 入力されたテキスト（{{current}} トークン）は設定された制限（{{limit}} トークン）より小さいため、分割せずに一度に出力しました！",
      "promptSplitter.singlePartTitle": "単一パートで準備完了（分割不要）",
      "promptSplitter.fullText": "Full Text",
      "promptSplitter.copyAll": "すべてコピー (Copy All)",`;

code = code.replace(enTarget, enReplacement);
code = code.replace(koTarget, koReplacement);
code = code.replace(jaTarget, jaReplacement);

fs.writeFileSync('src/lib/i18n.ts', code);
console.log('i18n patched');
