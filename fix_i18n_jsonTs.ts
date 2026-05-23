import * as fs from 'fs';

const path = './src/lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

const enBlock = `"jsonTs.longDesc.title": "About JSON to TypeScript Converter",
      "jsonTs.longDesc.p1": "The JSON to TypeScript Converter is a specialized local tool designed to help frontend developers and AI engineers instantly generate strictly typed interfaces from JSON objects or AI API responses.",
      "jsonTs.longDesc.p2": "Our implementation uses a Pure JS algorithm locally in your browser. This means your private JSON payloads, proprietary schema structures, and actual API response data are never transmitted to an external server—ensuring 100% absolute data privacy and immediate live transformation.",
      "jsonTs.help.title": "How to use this tool",
      "jsonTs.help.1": "Paste your JSON data into the left editor.",
      "jsonTs.help.2": "You can define the custom name for your Root Interface in the input field above the JSON editor.",
      "jsonTs.help.3": "The tool will instantly parse the JSON structure and map it into perfect TypeScript interfaces on the right.",
      "jsonTs.help.4": "Click \\"Sample Data\\" to see a complex JSON response and quickly verify how nested objects are automatically extracted into separate child interfaces.",`;

const koBlock = `"jsonTs.longDesc.title": "JSON → TS 변환기 (JSON to TypeScript Converter)에 관하여",
      "jsonTs.longDesc.p1": "JSON → TS 변환기는 프론트엔드 개발자와 AI 엔지니어가 JSON 객체 파일이나 AI API 응답 데이터로부터 엄격한 타입의 TypeScript 인터페이스 코드를 즉각적으로 생성할 수 있도록 설계된 전문 로컬 도구입니다.",
      "jsonTs.longDesc.p2": "당사의 변환 엔진은 유저의 브라우저 안에서만 실행되는 100% 순수 클라이언트 로직(Pure JS)입니다. 이는 여러분의 민감한 JSON 구조, 독점적 스키마 포맷, 그리고 실제 API 서버 응답 데이터가 단 1바이트도 외부 서버로 전송되지 않음을 의미하며, 최고의 속도와 절대적인 데이터 프라이버시를 보장합니다.",
      "jsonTs.help.title": "사용 방법",
      "jsonTs.help.1": "좌측 에디터에 JSON 데이터를 붙여넣으세요.",
      "jsonTs.help.2": "에디터 상단의 입력란에 최상위(Root) 객체의 인터페이스 이름(예: UserResponse)을 커스터마이징할 수 있습니다.",
      "jsonTs.help.3": "도구가 JSON 구조를 분석하여 올바른 타입이 선언된 완벽한 TypeScript 인터페이스 코드를 우측창에 즉시 생성합니다.",
      "jsonTs.help.4": "\\"샘플 데이터\\" 버튼을 클릭하여 복잡하게 중첩된 JSON 구조가 어떻게 개별 인터페이스로 예쁘게 쪼개져 추출되는지 직접 기능 테스트를 해보세요.",`;

const jaBlock = `"jsonTs.longDesc.title": "JSON → TS変換ツールについて",
      "jsonTs.longDesc.p1": "JSON → TS変換ツールは、フロントエンド開発者やAIエンジニア向けに特別に設計されており、JSONオブジェクトやAI APIの応答データから厳密に型付けされたTypeScriptインターフェースを瞬時に生成します。",
      "jsonTs.longDesc.p2": "当サイトの変換エンジンはブラウザ内のみで100%ローカルに設計されています（Pure JS）。これにより、ユーザーの機密性の高いJSONペイロードや独自仕様のスキーマ構造が外部サーバーに送信されることは決してなく、絶対的なデータプライバシーと最速の変換処理を提供します。",
      "jsonTs.help.title": "使用方法",
      "jsonTs.help.1": "左側のエディタにJSONデータを貼り付けます。",
      "jsonTs.help.2": "エディタ上部の入力フィールドにルート(Root)オブジェクトのインターフェース名を自由に指定できます。",
      "jsonTs.help.3": "ツールがJSON構造を解析し、右側に正しい型宣言を持つ完全なTypeScriptインターフェースコードを瞬時に出力します。",
      "jsonTs.help.4": "「サンプルデータ」ボタンをクリックして、ネストされた複雑なJSONオブジェクトがどのように個別のインターフェースに抽出されるか、ぜひテストしてください。",`;

content = content.replace(/"jsonTs.convertBtn": "Convert to TypeScript",/, `"jsonTs.convertBtn": "Convert to TypeScript",\n      ${enBlock}`);

content = content.replace(/"jsonTs.convertBtn": "타입스크립트로 변환",/, `"jsonTs.convertBtn": "타입스크립트로 변환",\n      ${koBlock}`);

content = content.replace(/"jsonTs.convertBtn": "TypeScriptに変換",/, `"jsonTs.convertBtn": "TypeScriptに変換",\n      ${jaBlock}`);

fs.writeFileSync(path, content);
console.log('Fixed i18n for jsonTs descriptions');
