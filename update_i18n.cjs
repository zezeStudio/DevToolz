const fs = require('fs');

const path = 'src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const enKeys = `
      "functionBuilder.functions": "Functions",
      "functionBuilder.functionN": "Function {{n}}",
      "functionBuilder.functionName": "Function Name",
      "functionBuilder.exName": "e.g., get_weather",
      "functionBuilder.descLabel": "Description",
      "functionBuilder.descPlaceholder": "What does this function do?",
      "functionBuilder.params": "Parameters",
      "functionBuilder.addParam": "Add Parameter",
      "functionBuilder.noParams": "No parameters added.",
      "functionBuilder.paramName": "Name",
      "functionBuilder.exParamName": "e.g., location",
      "functionBuilder.paramType": "Type",
      "functionBuilder.required": "Required",
      "functionBuilder.explainParam": "Explain parameter...",
      "functionBuilder.enumValues": "Enum Values (comma separated, optional)",
      "functionBuilder.exEnum": "e.g., celsius, fahrenheit",
      "functionBuilder.noFunctions": "No Functions Defined",
      "functionBuilder.addFirst": "Add your first function to start building the tools payload.",
      "functionBuilder.generatedPayload": "Generated Payload",
      "functionBuilder.format": "Format",
      "functionBuilder.payloadPlaceholder": "Your tools JSON payload will appear here...",
      "functionBuilder.help.openai": "Uses the tools array format wrapping a type: \\"function\\" and the parameters object in standard JSON Schema.",
      "functionBuilder.help.anthropic": "Uses the tools array but with an input_schema instead of parameters.",
      "functionBuilder.help.gemini": "Uses functionDeclarations nested inside the tools array.",
      "jsonSchema.inputJson": "Input (JSON)",
      "jsonSchema.outputPlaceholder": "Schema will appear here...",
`;

const koKeys = `
      "functionBuilder.functions": "함수 목록",
      "functionBuilder.functionN": "함수 {{n}}",
      "functionBuilder.functionName": "함수명",
      "functionBuilder.exName": "예: get_weather",
      "functionBuilder.descLabel": "설명",
      "functionBuilder.descPlaceholder": "이 함수는 어떤 역할을 하나요?",
      "functionBuilder.params": "매개변수 (Parameters)",
      "functionBuilder.addParam": "매개변수 추가",
      "functionBuilder.noParams": "추가된 매개변수가 없습니다.",
      "functionBuilder.paramName": "이름",
      "functionBuilder.exParamName": "예: location",
      "functionBuilder.paramType": "타입",
      "functionBuilder.required": "필수",
      "functionBuilder.explainParam": "매개변수 설명...",
      "functionBuilder.enumValues": "Enum 값 (쉼표로 구분, 선택사항)",
      "functionBuilder.exEnum": "예: celsius, fahrenheit",
      "functionBuilder.noFunctions": "정의된 함수 없음",
      "functionBuilder.addFirst": "첫 번째 함수를 추가하여 tool 페이로드 구성을 시작하세요.",
      "functionBuilder.generatedPayload": "생성된 페이로드 (Payload)",
      "functionBuilder.format": "포맷",
      "functionBuilder.payloadPlaceholder": "여기에 tools JSON 페이로드가 표시됩니다...",
      "functionBuilder.help.openai": "type: \\"function\\" 및 표준 JSON Schema의 parameters 객체를 감싸는 tools 배열 형식을 사용합니다.",
      "functionBuilder.help.anthropic": "tools 배열을 사용하지만 parameters 대신 input_schema를 사용합니다.",
      "functionBuilder.help.gemini": "tools 배열 내에 중첩된 functionDeclarations를 사용합니다.",
      "jsonSchema.inputJson": "입력 (JSON)",
      "jsonSchema.outputPlaceholder": "이곳에 스키마가 표시됩니다...",
`;

const jaKeys = `
      "functionBuilder.functions": "関数リスト",
      "functionBuilder.functionN": "関数 {{n}}",
      "functionBuilder.functionName": "関数名",
      "functionBuilder.exName": "例: get_weather",
      "functionBuilder.descLabel": "説明",
      "functionBuilder.descPlaceholder": "この関数はどのような役割をしますか？",
      "functionBuilder.params": "パラメータ (Parameters)",
      "functionBuilder.addParam": "パラメータを追加",
      "functionBuilder.noParams": "パラメータが追加されていません。",
      "functionBuilder.paramName": "名前",
      "functionBuilder.exParamName": "例: location",
      "functionBuilder.paramType": "タイプ",
      "functionBuilder.required": "必須",
      "functionBuilder.explainParam": "パラメータの説明...",
      "functionBuilder.enumValues": "Enum値 (カンマ区切り、任意)",
      "functionBuilder.exEnum": "例: celsius, fahrenheit",
      "functionBuilder.noFunctions": "定義された関数はありません",
      "functionBuilder.addFirst": "最初の関数を追加して、ツールのペイロードの構築を開始します。",
      "functionBuilder.generatedPayload": "生成されたペイロード",
      "functionBuilder.format": "フォーマット",
      "functionBuilder.payloadPlaceholder": "ここにツールのJSONペイロードが表示されます...",
      "functionBuilder.help.openai": "type: \\"function\\"と標準のJSON Schemaのparametersオブジェクトをラップするtools配列形式を使用します。",
      "functionBuilder.help.anthropic": "tools配列を使用しますが、parametersの代わりにinput_schemaを使用します。",
      "functionBuilder.help.gemini": "tools配列内にネストされたfunctionDeclarationsを使用します。",
      "jsonSchema.inputJson": "入力 (JSON)",
      "jsonSchema.outputPlaceholder": "ここにスキーマが表示されます...",
`;

// Replace for English
content = content.replace(
  /"functionBuilder\.help\.title": "Supported Providers",/,
  '"functionBuilder.help.title": "Supported Providers",\n' + enKeys
);

// Replace for Korean
content = content.replace(
  /"functionBuilder\.help\.title": "지원되는 제공업체 형식",/,
  '"functionBuilder.help.title": "지원되는 제공업체 형식",\n' + koKeys
);

// Replace for Japanese
content = content.replace(
  /"functionBuilder\.help\.title": "サポートされているプロバイダー形式",/,
  '"functionBuilder.help.title": "サポートされているプロバイダー形式",\n' + jaKeys
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated i18n.ts successfully!");
