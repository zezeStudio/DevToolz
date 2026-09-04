import { ToolContentData } from './types';

export const dataTools: ToolContentData[] = [
  {
    id: 'json-formatter',
    meta: {
      title: {
        en: 'JSON Formatter & Validator - Format and Validate JSON Online',
        ko: 'JSON 포매터 & 정렬 검사기 - 무료 온라인 JSON 정렬',
        ja: 'JSON整形・検証ツール - 無料オンラインJSONフォーマッター'
      },
      description: {
        en: 'Free online JSON Formatter and Validator. Beautify minified JSON, fix syntax errors with exact line pointers, and inspect API responses securely in your browser.',
        ko: '한 줄로 압축된 복잡한 JSON 데이터를 읽기 쉽게 자동 정렬하고 문법 오류 위치를 즉시 찾아주는 무료 웹 도구입니다. 100% 브라우저 처리로 데이터 유출 걱정 없이 안전합니다.',
        ja: '圧縮されたJSONデータを瞬時に見やすくインデント整形・構文チェックできる無料Webツール。完全ブラウザ完結でデータ送信なし。'
      }
    },
    overview: {
      en: 'Ideal when API responses are compressed into a single unreadable line, when inspecting complex JSON structures from backend logs, or when verifying syntax errors in configuration files (config.json) before deployment. It is also widely used for quick debugging of raw responses captured from Postman or curl.',
      ko: 'API 응답으로 받은 JSON이 한 줄로 붙어 있어 읽기 힘들 때, 백엔드 로그에서 복사한 JSON 구조를 눈으로 빠르게 파악해야 할 때, 또는 설정 파일(config.json)을 수정하기 전에 문법 오류가 없는지 확인하고 싶을 때 유용합니다. Postman이나 curl로 받은 응답을 그대로 디버깅할 때도 자주 쓰입니다.',
      ja: 'APIレスポンスが1行に圧縮されていて読みにくいとき、バックエンドのログからコピーしたJSON構造をすばやく視覚的に把握したいとき、または設定ファイル（config.json）の構文エラーを事前にチェックしたいときに役立ちます。Postmanやcurlで取得したレスポンスのデバッグにも日常的に活用されています。'
    },
    whenToUse: {
      en: [
        { title: 'API Response Readability', desc: 'Indents minified one-line responses for instant visual comprehension of payloads.' },
        { title: 'Server Log Parsing', desc: 'Quickly parse and inspect raw JSON event records copied directly from loggers like CloudWatch or Datadog.' },
        { title: 'config.json Validation', desc: 'Detect missing commas, unclosed brackets, or syntax typos before deploying configs.' },
        { title: 'Postman & curl Debugging', desc: 'Test and verify payload bodies, error responses, and nested attributes seamlessly.' }
      ],
      ko: [
        { title: 'API 응답 가독성 확보', desc: '압축된 한 줄 응답을 깔끔하게 들여쓰기하여 계층 구조를 직관적으로 파악합니다.' },
        { title: '백엔드 서버 로그 분석', desc: 'CloudWatch, Datadog 등 로그 시스템에서 추출한 JSON 문자열을 즉시 파싱합니다.' },
        { title: '설정 파일(config) 검증', desc: '배포 전 config.json 파일의 쉼표, 괄호 등 문법 오타를 사전에 검출합니다.' },
        { title: 'Postman / curl 디버깅', desc: 'REST API 테스트 도구에서 반환된 페이로드를 붙여넣어 에러 코드나 필드를 확인합니다.' }
      ],
      ja: [
        { title: 'APIレスポンスの可読性', desc: '圧縮された1行のレスポンスを適切にインデントし、階層構造を視覚化します。' },
        { title: 'バックエンドログの分析', desc: 'ログシステムから取得したJSON文字列を瞬時に展開・解析します。' },
        { title: '設定ファイル(config)の検証', desc: 'デプロイ前にconfig.jsonのカンマや括弧などの構文エラーを事前検出します。' },
        { title: 'Postman / curl のデバッグ', desc: 'REST APIテストで返されたペイロードを貼り付け、エラーやフィールドを確認します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Input JSON', desc: 'Paste your unformatted JSON text into the left input editor.' },
        { step: 2, title: 'Apply Formatting', desc: 'Click the "Format" button to automatically apply indentation and line breaks.' },
        { step: 3, title: 'Syntax Validation', desc: 'If there are syntax errors, the exact line and position of the issue are displayed.' },
        { step: 4, title: 'Copy & Export', desc: 'Copy the beautified result to your clipboard or download it as a .json file.' }
      ],
      ko: [
        { step: 1, title: 'JSON 입력', desc: '정렬되지 않은 JSON 텍스트를 왼쪽 입력창에 붙여넣습니다.' },
        { step: 2, title: '포맷팅 실행', desc: '"포맷 / 예쁘게" 버튼을 클릭하여 들여쓰기와 줄바꿈을 자동 적용합니다.' },
        { step: 3, title: '문법 오류 확인', desc: '오류가 있을 경우 에러가 발생한 라인 번호와 원인을 즉시 표시합니다.' },
        { step: 4, title: '결과 복사 및 다운로드', desc: '정리된 결과를 클립보드에 복사하거나 .json 파일로 저장합니다.' }
      ],
      ja: [
        { step: 1, title: 'JSONを入力', desc: '整形したいJSONテキストを左側の入力欄に貼り付けます。' },
        { step: 2, title: 'フォーマット実行', desc: '「フォーマット」ボタンを押すと、適切なインデントと改行が自動適用されます。' },
        { step: 3, title: '構文エラーの確認', desc: '文法エラーがある場合は該当する行番号と原因を瞬時に表示します。' },
        { step: 4, title: 'コピー・保存', desc: '整形された結果をクリップボードにコピーするか、.jsonファイルとしてダウンロードします。' }
      ]
    },
    example: {
      input: '{"user":{"id":1,"name":"Kim","roles":["admin","editor"],"active":true}}',
      output: '{\n  "user": {\n    "id": 1,\n    "name": "Kim",\n    "roles": [\n      "admin",\n      "editor"\n    ],\n    "active": true\n  }\n}'
    },
    faq: {
      en: [
        { q: 'Can it handle deeply nested JSON?', a: 'Yes. Even if arrays and objects are nested across multiple hierarchy levels, appropriate indentation is applied at each depth.' },
        { q: 'What happens if there are syntax errors?', a: 'Common syntax mistakes such as missing commas or unquoted keys will be pointed out with exact error line indicators. Since formatting requires valid syntax, you will need to fix these issues first.' },
        { q: 'Can it process large files?', a: 'Because processing is executed directly in your browser memory, multi-megabyte JSON files are handled smoothly. Very large files exceeding tens of megabytes may vary in speed depending on your device performance.' }
      ],
      ko: [
        { q: '배열이나 객체가 여러 겹 중첩되어 있어도 정렬되나요?', a: '네, 다단계로 복잡하게 중첩된 JSON 구조라도 깊이(depth)에 맞춰 정확한 공백 들여쓰기가 적용됩니다.' },
        { q: '문법 오류(Syntax Error)가 있으면 어떻게 되나요?', a: '따옴표 누락, 마지막 쉼표(Trailing Comma) 등 오류가 발생한 정확한 위치(라인)를 찾아 에러 메시지로 안내합니다. 문법 오류를 수정한 후 다시 포맷 버튼을 누르시면 됩니다.' },
        { q: '대용량 파일도 처리할 수 있나요?', a: '수 메가바이트(MB) 수준의 JSON은 무리 없이 처리됩니다. 다만 브라우저 탭 메모리를 사용하므로 수십 MB 이상의 초대형 파일은 기기 사양에 따라 일시적인 지연이 발생할 수 있습니다.' }
      ],
      ja: [
        { q: '深くネストされたJSONでも正しくインデントされますか？', a: 'はい。階層が深く重なった配列やオブジェクトでも、それぞれの階層深度に応じた適切なインデントを自動で付与します。' },
        { q: '構文エラーがある場合はどうなりますか？', a: 'クォーテーションの欠落や末尾の不要なカンマなど、構文エラーが発生している正確な行番号とエラー内容を案内します。' },
        { q: '大容量のJSONファイルでも処理できますか？', a: '数MB規模のJSONファイルであればスムーズに処理可能です。数十MBを超える極端に巨大なファイルは、お使いの端末スペックによって処理時間が変動する場合があります。' }
      ]
    },
    notes: {
      en: [
        'This tool operates 100% client-side in your browser; your input data is never sent to any remote server.',
        'Non-standard JSON extensions like JSON5 or JSONC (JSON with comments) are not supported; it strictly parses standard RFC 8259 JSON.'
      ],
      ko: [
        '본 도구는 모든 처리가 사용자의 웹 브라우저 내에서만 실행되며, 입력한 데이터가 외부 서버로 절대 전송되지 않습니다.',
        '표준 RFC 8259 규격을 따르므로, 주석이 포함된 JSON(JSONC)이나 따옴표가 생략된 비표준 형식(JSON5)은 파싱 오류가 발생할 수 있습니다.'
      ],
      ja: [
        '本ツールはブラウザのクライアントサイドでのみ動作し、入力データが外部サーバーへ送信されることは一切ありません。',
        '標準的なRFC 8259仕様に準拠しているため、コメント付きJSON（JSONC）や非標準構文（JSON5）はパースエラーとなる場合があります。'
      ]
    },
    relatedTools: [
      { id: 'json-schema-generator', name: 'JSON Schema Generator', desc: { en: 'Generate standard JSON Schema draft specifications from raw JSON payloads.', ko: 'JSON 데이터로부터 표준 JSON Schema 명세를 자동 생성합니다.', ja: 'JSONデータから標準JSONスキーマ仕様を自動生成します。' }, icon: 'FileCode' },
      { id: 'json-to-ts', name: 'JSON to TypeScript', desc: { en: 'Convert raw JSON structures into type-safe TypeScript interfaces and types.', ko: 'JSON 구조를 분석하여 타입 안전한 TypeScript 인터페이스 및 타입으로 변환합니다.', ja: 'JSON構造を解析し、型安全なTypeScriptインターフェースに即座に変換します。' }, icon: 'Code' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Securely inspect Header and Payload JSON claims inside JSON Web Tokens.', ko: 'JSON 기반 웹 토큰(JWT)의 Header와 Payload 클레임을 안전하게 디코딩합니다.', ja: 'JSONベースのWebトークン（JWT）のヘッダーとペイロードを安全にデコードして確認します。' }, icon: 'Shield' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare two JSON files or text snippets side-by-side to highlight exact differences.', ko: '두 개의 JSON이나 텍스트를 비교하여 변경된 라인과 키 값을 시각적으로 대조합니다.', ja: '2つのJSONやテキストを比較し、変更された行や差分を視覚的にハイライトします。' }, icon: 'Braces' }
    ]
  },
  {
    id: 'base64-converter',
    meta: {
      title: {
        en: 'Base64 Encoder / Decoder - Free Online Base64 Tool',
        ko: 'Base64 인코더 / 디코더 - 텍스트 및 이미지 Base64 변환기',
        ja: 'Base64エンコーダー / デコーダー - 無料オンライン変換ツール'
      },
      description: {
        en: 'Convert text, images, and binary data to Base64 format or decode Base64 strings back to original text. Supports URL-safe Base64 and UTF-8 encoding.',
        ko: '텍스트나 이미지를 Base64 문자열로 인코딩하고, Base64 데이터를 원래 텍스트로 안전하게 디코딩합니다. 한글 UTF-8 및 URL-Safe 옵션을 완벽 지원합니다.',
        ja: 'テキストや画像をBase64形式にエンコード、またはBase64文字列を元のデータにデコード。UTF-8およびURLセーフなBase64を完全サポート。'
      }
    },
    overview: {
      en: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is essential when embedding small image assets directly into HTML/CSS via Data URIs, constructing HTTP Basic Authentication headers, or inspecting encoded email MIME attachments.',
      ko: 'Base64는 바이너리 데이터를 64개의 ASCII 문자로 표현하는 인코딩 방식입니다. 웹 개발에서 작은 아이콘이나 이미지를 별도 요청 없이 CSS/HTML에 Data URI로 직접 삽입할 때, HTTP Basic 인증 헤더를 구성할 때, 또는 이메일 첨부 파일 전송 규격(MIME)을 분석할 때 필수적으로 사용됩니다.',
      ja: 'Base64はバイナリデータを64種類のASCII文字で表現するエンコード方式です。小さな画像アセットをData URIとしてHTML/CSSに直接埋め込む際や、HTTP Basic認証ヘッダーの生成、メール添付ファイルのMIMEデータ解析などで幅広く活用されます。'
    },
    whenToUse: {
      en: [
        { title: 'Data URI Embedding', desc: 'Embed small PNG/SVG images directly into CSS or HTML to eliminate extra HTTP requests.' },
        { title: 'HTTP Basic Auth Header', desc: 'Encode "username:password" credentials into the "Authorization: Basic ..." header format.' },
        { title: 'Email MIME Inspection', desc: 'Decode base64 encoded chunks found in raw email source files (.eml) or attachment headers.' },
        { title: 'URL-Safe Token Generation', desc: 'Replace + and / with - and _ to safely transmit payload strings through URL query parameters.' }
      ],
      ko: [
        { title: 'Data URI 이미지 삽입', desc: '작은 아이콘이나 로고 이미지를 Data URI(data:image/png;base64,...)로 변환하여 HTTP 네트워크 요청을 줄입니다.' },
        { title: 'HTTP Basic 인증 헤더 생성', desc: '"아이디:비밀번호" 형식의 인증 문자열을 Authorization 헤더 규격에 맞게 변환합니다.' },
        { title: '이메일 MIME 첨부파일 분석', desc: '이메일 원본 파일(.eml)에 포함된 Base64 인코딩 본문이나 첨부파일 데이터를 텍스트로 복원합니다.' },
        { title: 'URL-Safe 토큰 규격 준수', desc: 'URL 쿼리스트링에서 충돌을 일으키는 +, / 문자를 -, _로 치환하여 안전하게 파라미터로 전달합니다.' }
      ],
      ja: [
        { title: 'Data URIの画像埋め込み', desc: '小さな画像をCSSやHTMLに直接埋め込むためのData URI形式を生成し、HTTPリクエスト数を削減します。' },
        { title: 'HTTP Basic認証ヘッダー', desc: '「ユーザー名:パスワード」をAuthorizationヘッダー用のBase64文字列に変換します。' },
        { title: 'メールMIMEデータの解析', desc: 'メール本文や添付ファイルに含まれるBase64エンコード文字列をプレーンテキストに復元します。' },
        { title: 'URLセーフなトークン作成', desc: 'URLパラメータで使用できない+や/記号を-や_に置き換えた安全な文字列を生成します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Choose Mode', desc: 'Select whether you want to "Encode" plaintext to Base64 or "Decode" Base64 back to text.' },
        { step: 2, title: 'Input Data', desc: 'Paste your string into the input area or upload a local file.' },
        { step: 3, title: 'Configure Options', desc: 'Toggle the "URL-Safe" option if you need query-parameter friendly output (replaces + and /).' },
        { step: 4, title: 'Copy Result', desc: 'Instantly copy the converted string to your clipboard or download it as a text file.' }
      ],
      ko: [
        { step: 1, title: '작업 모드 선택', desc: '일반 텍스트를 Base64로 바꿀지(인코딩), Base64 문자열을 원문으로 풀지(디코딩)를 결정합니다.' },
        { step: 2, title: '데이터 입력', desc: '텍스트를 직접 입력하거나 컴퓨터에 있는 파일(.txt, .png 등)을 업로드합니다.' },
        { step: 3, title: '옵션 설정', desc: 'URL 파라미터로 사용하려면 "URL-Safe" 토글을 켜서 안전한 문자셋으로 변환합니다.' },
        { step: 4, title: '결과 복사 및 활용', desc: '변환된 결과값을 원클릭으로 클립보드에 복사하여 코드나 헤더에 바로 적용합니다.' }
      ],
      ja: [
        { step: 1, title: 'モード選択', desc: '平文をBase64化する「エンコード」か、元に戻す「デコード」かを選択します。' },
        { step: 2, title: 'データを入力', desc: 'テキストを入力欄に貼り付けるか、ローカルファイルをアップロードします。' },
        { step: 3, title: 'オプション設定', desc: 'URLパラメータで使用する場合は「URLセーフ」オプションを有効にします。' },
        { step: 4, title: '結果をコピー', desc: '変換された文字列をワンクリックでクリップボードにコピーして利用します。' }
      ]
    },
    example: {
      input: 'Hello, DevToolz! 반갑습니다 🚀',
      output: 'SGVsbG8sIERldlRvb2x6ISDrsJjqsJHsirXri4jrq6Qg8J+agA=='
    },
    faq: {
      en: [
        { q: 'Is Base64 an encryption method?', a: 'No. Base64 is purely an encoding format for data representation, not encryption. Anyone can decode it back instantly. Never use Base64 alone to protect sensitive passwords or secret keys.' },
        { q: 'Why does Base64 data size increase by ~33%?', a: 'Base64 represents 3 bytes (24 bits) of raw data using 4 ASCII characters (32 bits). Because 6 bits are mapped to 8 bits, the encoded size naturally expands by approximately 33%.' },
        { q: 'What do the equal signs (=) at the end mean?', a: 'The equal sign (=) is padding. When the total number of input bytes is not divisible by 3, one or two padding characters are appended to ensure the output length is a multiple of 4.' }
      ],
      ko: [
        { q: 'Base64는 암호화(Encryption) 방식인가요?', a: '아닙니다. Base64는 데이터의 전송과 표현을 위한 인코딩(Encoding) 기술일 뿐 암호화가 아닙니다. 누구나 원래 내용으로 즉시 복원할 수 있으므로 민감한 비밀번호나 키를 숨기는 용도로 사용해서는 안 됩니다.' },
        { q: 'Base64로 변환하면 왜 용량이 약 33% 커지나요?', a: '바이너리 3바이트(24비트)를 6비트씩 쪼개어 4개의 아스키 문자(32비트)로 표현하기 때문입니다. 이로 인해 원본 크기 대비 데이터 용량이 수학적으로 약 33% 증가합니다.' },
        { q: '문자열 끝에 붙는 등호(=) 기호는 무엇인가요?', a: '패딩(Padding) 문자입니다. 원본 데이터의 바이트 수가 3의 배수로 떨어지지 않을 경우, 4자리 블록을 채우기 위해 부족한 만큼 끝에 1개 또는 2개의 = 기호를 덧붙입니다.' }
      ],
      ja: [
        { q: 'Base64は暗号化（Encryption）ですか？', a: 'いいえ、暗号化ではありません。データを安全に伝送するためのエンコード（可逆変換）に過ぎず、誰でも元の文字列に戻せます。機密情報の保護には利用しないでください。' },
        { q: 'Base64に変換すると容量が約33%増えるのはなぜですか？', a: '3バイト（24ビット）のデータを6ビットずつ4つの文字（32ビット）に変換するため、データ容量が物理的に約1.33倍（33%増）になります。' },
        { q: '末尾のイコール（=）記号は何ですか？', a: 'パディング（余白補填）です。元のデータ長が3の倍数にならない場合、4文字単位に揃えるために末尾に=を補填します。' }
      ]
    },
    notes: {
      en: [
        'Pure client-side processing: your files and text never leave your browser sandbox.',
        'Properly handles full UTF-8 multi-byte characters including Korean, Japanese, Chinese, and emojis.'
      ],
      ko: [
        '100% 브라우저 메모리 내에서 실행되므로 이미지나 비밀 토큰을 인코딩해도 외부 서버로 전송되지 않습니다.',
        '한글, 일본어, 중국어 및 이모지 등 다국어 멀티바이트 UTF-8 유니코드를 깨짐 없이 완벽하게 변환합니다.'
      ],
      ja: [
        '100%ブラウザ内部で処理されるため、機密トークンや画像ファイルを扱っても外部サーバーに漏洩しません。',
        '日本語や韓国語、絵文字などのマルチバイトUTF-8文字も文字化けすることなく正確に処理されます。'
      ]
    },
    relatedTools: [
      { id: 'url-encoder', name: 'URL Encoder', desc: { en: 'Encode special characters into percent-encoded strings for URL queries.', ko: 'URL 쿼리스트링의 한글 및 특수문자를 % 규격으로 인코딩합니다.', ja: 'URLクエリ文字列内の特殊文字をパーセントエンコードします。' }, icon: 'Link' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Decode Base64URL-encoded JSON Web Tokens and inspect token claims.', ko: 'Base64URL로 인코딩된 JWT 토큰의 Header와 Payload를 복원합니다.', ja: 'Base64URLエンコードされたJWTのヘッダーとペイロードを展開します。' }, icon: 'Shield' },
      { id: 'hash-generator', name: 'Hash Generator', desc: { en: 'Generate MD5, SHA-1, and SHA-256 cryptographic hashes from text.', ko: '텍스트 데이터로부터 단방향 암호화 해시(SHA-256 등)를 생성합니다.', ja: 'テキストからSHA-256などの暗号学的ハッシュ値を生成します。' }, icon: 'Hash' },
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Format and beautify decoded JSON payloads with syntax error detection.', ko: '디코딩된 JSON 결과물을 읽기 쉽게 정렬하고 문법을 검사합니다.', ja: 'デコードされたJSON文字列を見やすくインデント整形します。' }, icon: 'FileJson' }
    ]
  },
  {
    id: 'url-encoder',
    meta: {
      title: {
        en: 'URL Encoder / Decoder - Free Online Percent-Encoding Tool',
        ko: 'URL 인코더 / 디코더 - 퍼센트 인코딩 및 URL 디코딩 도구',
        ja: 'URLエンコーダー / デコーダー - パーセントエンコード無料ツール'
      },
      description: {
        en: 'Safely encode special characters into percent-encoded (%XX) format or decode encoded URLs back to human-readable strings. Supports RFC 3986 standards.',
        ko: 'URL에 포함된 한글, 공백, 특수문자를 RFC 3986 규격의 퍼센트 인코딩(%XX)으로 변환하거나, 인코딩된 복잡한 주소를 읽기 쉬운 원문으로 디코딩합니다.',
        ja: 'URLクエリパラメータの特殊文字や日本語をRFC 3986標準のパーセントエンコード（%XX）に変換、またはデコードして可読化します。'
      }
    },
    overview: {
      en: 'Uniform Resource Identifiers (URIs) only support a restricted set of ASCII characters. Any non-ASCII text (such as Korean or Japanese characters) or reserved symbols (&, ?, =, #) inside query parameters must be percent-encoded (e.g., %20, %EA%B0%80) to prevent broken links and server-side parsing failures.',
      ko: '인터넷 URL 주소는 표준적으로 영문자와 일부 기호 등 제한된 ASCII 문자만 허용합니다. 따라서 검색어나 주소창에 한글, 공백, &, ?, = 등 특수문자가 들어갈 경우, 서버가 잘못 파싱하거나 요청이 깨지는 것을 방지하기 위해 퍼센트 인코딩(예: %20, %EA%B0%80)으로 변환해야 합니다.',
      ja: 'URL（URI）の規格では使用できる文字が制限されています。日本語や空白、&や?などの予約文字をクエリパラメータに含める場合、リンクの破損やサーバー側の解析エラーを防ぐためにパーセントエンコード（%XX形式）への変換が必須となります。'
    },
    whenToUse: {
      en: [
        { title: 'OAuth Redirect URI Setup', desc: 'Safely encode callback URLs containing multiple query parameters for OAuth2 authorization flows.' },
        { title: 'Non-ASCII Search Queries', desc: 'Convert multi-byte strings (Korean, Japanese, emojis) into valid HTTP request query strings.' },
        { title: 'Query Parameter Debugging', desc: 'Paste unreadable URLs like "%EC%95%88%EB%85%95" to inspect the human-readable parameter names and values.' },
        { title: 'Preventing Reserved Character Collisions', desc: 'Ensure that ampersands (&) and equals signs (=) inside parameter values are not misinterpreted as delimiters.' }
      ],
      ko: [
        { title: 'OAuth 리다이렉트 URI 전달', desc: '소셜 로그인 인증 시 콜백 주소(redirect_uri) 파라미터가 잘리거나 오작동하지 않도록 안전하게 감쌉니다.' },
        { title: '한글 검색 쿼리 전송', desc: '검색어나 카테고리 명에 포함된 한글 문자를 웹 표준 퍼센트 코드로 변환하여 API 요청에 사용합니다.' },
        { title: '복잡한 인코딩 URL 분석', desc: '로그나 네트워크 탭에 찍힌 "%EC%8B%9C%EC%8A%A4%ED%85%9C" 같은 외계어 문자열을 읽기 쉬운 원문으로 복원합니다.' },
        { title: '파라미터 구분자 충돌 방지', desc: '파라미터 값 내부에 포함된 &나 = 기호가 새로운 변수로 잘못 쪼개지는 파싱 버그를 원천 차단합니다.' }
      ],
      ja: [
        { title: 'OAuthリダイレクトURLの設定', desc: 'ソーシャルログインなどの認証フローで、コールバックURLを安全にパラメータ化します。' },
        { title: '日本語検索クエリの送信', desc: 'URLに含める日本語文字列をWeb標準のパーセントエンコード形式に変換します。' },
        { title: 'エンコードされたURLの解析', desc: 'ブラウザのアドレスバーやログに残された「%E3%81%82」などの文字列を日本語に復元します。' },
        { title: '予約文字の衝突防止', desc: 'パラメータ値に含まれる「&」や「=」が区切り文字として誤解されるのを防ぎます。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Select Action', desc: 'Choose "Encode" to convert special characters to %XX, or "Decode" to restore original text.' },
        { step: 2, title: 'Input Text or URL', desc: 'Paste the target URL or query parameter text into the input field.' },
        { step: 3, title: 'Choose Mode', desc: 'Select encodeURIComponent (for query values) or encodeURI (for full URL addresses).' },
        { step: 4, title: 'Copy Result', desc: 'Copy the transformed, clean URL string directly to your clipboard.' }
      ],
      ko: [
        { step: 1, title: '변환 방향 선택', desc: '텍스트를 퍼센트 코드로 바꿀지(인코드), 퍼센트 코드를 한글/원문으로 풀지(디코드)를 선택합니다.' },
        { step: 2, title: 'URL 또는 문자열 입력', desc: '변환할 대상 주소 전체나 파라미터 텍스트를 입력창에 붙여넣습니다.' },
        { step: 3, title: '인코딩 방식 선택', desc: '파라미터 값 변환에는 encodeURIComponent(권장)를, 전체 URL 보존에는 encodeURI 모드를 지정합니다.' },
        { step: 4, title: '결과 복사', desc: '생성된 웹 호환 URL 문자열을 복사하여 웹사이트 링크나 API 요청 코드에 적용합니다.' }
      ],
      ja: [
        { step: 1, title: '動作を選択', desc: '特殊文字を%XXに変換する「エンコード」か、元に戻す「デコード」かを選びます。' },
        { step: 2, title: 'URLや文字列を入力', desc: '対象となるURLアドレスまたはパラメータ文字列を入力欄に貼り付けます。' },
        { step: 3, title: 'エンコード方式の指定', desc: 'パラメータ値の変換には「encodeURIComponent」、URL全体の維持には「encodeURI」を選びます。' },
        { step: 4, title: '結果をコピー', desc: '生成された安全なURLをコピーして利用します。' }
      ]
    },
    example: {
      input: 'https://example.com/search?keyword=개발자 도구&category=API+디버깅',
      output: 'https%3A%2F%2Fexample.com%2Fsearch%3Fkeyword%3D%EA%B0%9C%EB%B0%9C%EC%9E%90%20%EB%8F%84%EA%B5%AC%26category%3DAPI%2B%EB%94%94%EB%B2%84%EA%B9%85'
    },
    faq: {
      en: [
        { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURI preserves valid URL structure characters like : / ? # & =. In contrast, encodeURIComponent encodes almost all special characters including /, ?, and &, making it strictly necessary for parameter values.' },
        { q: 'Why is space sometimes encoded as "+" and sometimes as "%20"?', a: 'In standard URI percent-encoding (RFC 3986), a space is always %20. However, in HTML form submissions (application/x-www-form-urlencoded), historical conventions allowed spaces to be replaced by a plus sign (+).' },
        { q: 'Can URL encoding prevent SQL injection or XSS?', a: 'URL encoding ensures parameters are delivered without protocol corruption, but it is NOT an application-level security defense against SQL injection or XSS. Always sanitize and use parameterized queries on your backend.' }
      ],
      ko: [
        { q: 'encodeURI와 encodeURIComponent의 차이점은 무엇인가요?', a: 'encodeURI는 전체 URL 주소 체계를 유지하기 위해 콜론(:), 슬래시(/), 물음표(?), 앰퍼샌드(&) 등 주요 프로토콜 기호를 인코딩하지 않고 보존합니다. 반면 encodeURIComponent는 파라미터 값 내부에 들어가는 모든 특수문자를 철저하게 %코드로 치환합니다.' },
        { q: '공백(띄어쓰기)이 어떤 때는 %20이고 어떤 때는 +로 표시되나요?', a: 'RFC 3986 웹 표준 퍼센트 인코딩에서는 공백이 항상 %20입니다. 반면 과거 HTML 폼 전송 규격(application/x-www-form-urlencoded)에서는 편의상 공백을 더하기(+) 기호로 치환해 전송하기도 했습니다.' },
        { q: 'URL 인코딩을 하면 보안 취약점(XSS/SQL Injection)이 방어되나요?', a: '아닙니다. URL 인코딩은 통신 규격상 데이터가 깨지지 않게 전달하는 형식 변환일 뿐이므로, 백엔드 애플리케이션의 검증 및 파라미터화된 쿼리(Prepared Statement)를 반드시 별도로 적용해야 합니다.' }
      ],
      ja: [
        { q: 'encodeURIとencodeURIComponentの違いは何ですか？', a: 'encodeURIはURL構造（: / ? &など）を維持したままエンコードします。encodeURIComponentはパラメータ値向けに、それらの区切り記号も含めてすべて厳格に%XXへ変換します。' },
        { q: '空白が「%20」になる場合と「+」になる場合があるのはなぜですか？', a: '標準的なRFC 3986規格では「%20」が正規の表現です。一方、HTMLフォーム送信の古い仕様（application/x-www-form-urlencoded）では「+」への置換が許容されているためです。' },
        { q: 'URLエンコードを行えばSQLインジェクションなどの攻撃を防げますか？', a: 'いいえ。URLエンコードはデータ伝送のためのフォーマット変換であり、セキュリティ対策ではありません。サーバー側での適切なサニタイズ処理が不可欠です。' }
      ]
    },
    notes: {
      en: [
        'Processes strings locally in your browser with zero network latency and complete privacy.',
        'Supports standard RFC 3986 percent-encoding rules for modern REST APIs and web platforms.'
      ],
      ko: [
        '모든 연산이 브라우저에서 로컬로 실행되므로 개인 토큰이나 민감한 파라미터가 외부로 노출되지 않습니다.',
        '최신 웹 브라우저 및 REST API와 100% 호환되는 RFC 3986 퍼센트 인코딩 규칙을 준수합니다.'
      ],
      ja: [
        'すべての変換がブラウザ内で安全に行われ、機密パラメータが外部に送信される心配はありません。',
        '現代のWeb標準およびREST APIに完全準拠したRFC 3986パーセントエンコード仕様を採用しています。'
      ]
    },
    relatedTools: [
      { id: 'base64-converter', name: 'Base64 Converter', desc: { en: 'Encode and decode Base64 and URL-safe Base64 strings.', ko: '텍스트와 바이너리 데이터를 Base64 형식으로 상호 변환합니다.', ja: 'Base64およびURLセーフなBase64の相互変換を行います。' }, icon: 'Binary' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Inspect claims inside JSON Web Tokens passed in URL queries.', ko: 'URL 파라미터로 전달된 JWT 인증 토큰의 내부를 확인합니다.', ja: 'URLクエリで渡されたJWTトークンのペイロードを展開します。' }, icon: 'Shield' },
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Format and beautify complex JSON query parameters.', ko: 'URL로 전달받은 복잡한 JSON 데이터를 읽기 쉽게 포맷팅합니다.', ja: 'URLで渡された複雑なJSONパラメータを視覚的に整形します。' }, icon: 'FileJson' },
      { id: 'regex-tester', name: 'Regex Tester', desc: { en: 'Test URL parsing patterns and extract query string parameters.', ko: 'URL 파싱용 정규식 패턴을 테스트하고 파라미터를 추출합니다.', ja: 'URLからパラメータを抽出する正規表現を検証します。' }, icon: 'Code' }
    ]
  },
  {
    id: 'json-to-ts',
    meta: {
      title: {
        en: 'JSON to TypeScript Converter - Generate TS Interfaces Instantly',
        ko: 'JSON to TypeScript 변환기 - TS 인터페이스 및 타입 자동 생성',
        ja: 'JSON to TypeScript 変換ツール - 型定義を自動生成'
      },
      description: {
        en: 'Instantly convert raw JSON payloads into clean, type-safe TypeScript interfaces and types. Supports nested objects, optional fields, and array item typing.',
        ko: '복잡한 JSON 데이터를 정밀 분석하여 타입 안전한 TypeScript 인터페이스 및 타입 정의 코드로 즉시 변환합니다. 중첩 객체 분리 및 배열 타입 자동 추론 지원.',
        ja: 'JSONデータを解析し、型安全なTypeScriptインターフェース・型定義コードを自動生成。ネストされたオブジェクトや配列の型推論に対応。'
      }
    },
    overview: {
      en: 'Front-end applications communicating with REST or GraphQL APIs frequently require TypeScript interface definitions matching backend payloads. Manually writing dozens of nested interfaces is repetitive and error-prone. This utility parses your raw JSON structure and recursively generates clean, well-named TypeScript interfaces adhering to modern TS best practices.',
      ko: 'REST API나 백엔드 서비스와 연동할 때, 서버에서 내려주는 수많은 JSON 응답을 일일이 TypeScript 인터페이스로 손수 타이핑하는 것은 시간 소모가 크고 휴먼 에러가 자주 발생합니다. 이 도구는 JSON 데이터의 키와 값의 타입을 자동 추론하여, 깔끔하게 모듈화된 TypeScript 인터페이스 코드를 즉각 완성해 줍니다.',
      ja: 'REST APIなどのバックエンドと連携する際、レスポンスJSONに対応するTypeScriptのインターフェースを手作業で作成するのは手間がかかり、ミスも起きやすくなります。本ツールはJSON構造を自動解析し、美しく分割された型安全なTypeScriptコードを瞬時に出力します。'
    },
    whenToUse: {
      en: [
        { title: 'API Client DTO Modeling', desc: 'Create accurate response Data Transfer Object (DTO) types directly from Swagger or Postman responses.' },
        { title: 'Refactoring JavaScript to TypeScript', desc: 'Rapidly generate interface definitions for legacy mock data or configuration files.' },
        { title: 'Deeply Nested Data Structures', desc: 'Automatically extract nested sub-objects into standalone, modular child interfaces.' },
        { title: 'State Management Typing', desc: 'Model Redux, Zustand, or TanStack Query store state types straight from initial JSON data.' }
      ],
      ko: [
        { title: 'API 응답 DTO 모델링', desc: 'Swagger나 Postman에서 반환된 API 응답 JSON을 복사해 프론트엔드용 DTO 인터페이스로 즉시 생성합니다.' },
        { title: 'JS 프로젝트의 TS 마이그레이션', desc: '기존 자바스크립트 프로젝트의 목(mock) 데이터나 환경설정을 타입스크립트 타입으로 신속히 이전합니다.' },
        { title: '다단계 중첩 구조 분리', desc: '객체 안에 객체가 포함된 복잡한 구조를 읽기 쉽게 별도의 서브 인터페이스로 자동 분리합니다.' },
        { title: '상태 관리 스토어 타이핑', desc: 'Redux, Zustand 등 전역 상태나 서버 캐시 상태에 필요한 초기 상태 타입을 완벽하게 구성합니다.' }
      ],
      ja: [
        { title: 'APIクライアントのDTO作成', desc: 'SwaggerやPostmanのレスポンスJSONから、フロントエンド用の型安全なDTOインターフェースを生成します。' },
        { title: 'TS移行時の型定義', desc: '既存のJavaScriptプロジェクトで利用しているモックデータや設定ファイルから型定義を素早く作成します。' },
        { title: 'ネスト構造の自動分割', desc: '多層構造のオブジェクトを独立した分かりやすいサブインターフェースとして自動分離します。' },
        { title: '状態管理ストアの型付け', desc: 'ReduxやZustandなどのステート管理で使用する型定義を初期JSONデータから素早く構築します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Paste JSON', desc: 'Paste your sample JSON object or array into the input editor.' },
        { step: 2, title: 'Specify Root Name', desc: 'Name your root interface (defaults to RootObject or ApiResponse).' },
        { step: 3, title: 'Review Generated TS', desc: 'Inspect the generated TypeScript interfaces with inferred primitive and complex types.' },
        { step: 4, title: 'Copy to Project', desc: 'Copy the clean TS code and paste it directly into your .ts or .types.ts project files.' }
      ],
      ko: [
        { step: 1, title: 'JSON 데이터 입력', desc: '변환하고자 하는 샘플 JSON 객체 또는 배열 데이터를 입력창에 붙여넣습니다.' },
        { step: 2, title: '루트 인터페이스명 지정', desc: '최상위 인터페이스의 이름(예: UserProfile, OrderResponse 등)을 설정합니다.' },
        { step: 3, title: '타입 추론 결과 확인', desc: '문자열, 숫자, 불리언 및 중첩 인터페이스로 깔끔하게 정리된 TS 코드를 확인합니다.' },
        { step: 4, title: '프로젝트에 복사', desc: '완성된 코드를 복사하여 프로젝트 내 types.ts 파일에 그대로 적용합니다.' }
      ],
      ja: [
        { step: 1, title: 'JSONを貼り付け', desc: '変換対象となるJSONオブジェクトまたは配列を入力欄に貼り付けます。' },
        { step: 2, title: 'ルート型名の指定', desc: '最上位のインターフェース名（例: UserResponseなど）を設定します。' },
        { step: 3, title: '生成された型定義の確認', desc: '推論されたプリミティブ型や分割されたサブインターフェースを確認します。' },
        { step: 4, title: 'コードをコピー', desc: '生成されたTypeScriptコードをコピーしてプロジェクトファイルに貼り付けます。' }
      ]
    },
    example: {
      input: '{\n  "id": 101,\n  "title": "Launch DevToolz",\n  "completed": true,\n  "author": {\n    "name": "Alex",\n    "email": "alex@example.com"\n  }\n}',
      output: 'export interface Author {\n  name: string;\n  email: string;\n}\n\nexport interface RootObject {\n  id: number;\n  title: string;\n  completed: boolean;\n  author: Author;\n}'
    },
    faq: {
      en: [
        { q: 'How does it handle null or undefined values?', a: 'When a field contains null in the JSON sample, it is typed as any | null. For enterprise codebases, we recommend supplementing with non-null samples to guarantee exact primitive types.' },
        { q: 'How does it type arrays with mixed object shapes?', a: 'If array items have identical structures, it extracts a single clean item interface. If items vary, union types or general object types are generated to maintain strict TypeScript compilation safety.' },
        { q: 'Can it generate "type" aliases instead of "interface"?', a: 'The default output uses standard TypeScript interfaces for optimal IDE extension performance and contract declaration, which can easily be adapted to type aliases as desired.' }
      ],
      ko: [
        { q: 'null 값은 어떤 타입으로 변환되나요?', a: '샘플 JSON에 null로 표기된 필드는 본래 데이터 타입을 단정할 수 없으므로 any | null 형태로 정의됩니다. 더 정확한 타입을 얻으려면 실제 데이터가 채워진 샘플을 넣는 것을 권장합니다.' },
        { q: '배열 내부에 객체들이 들어있는 경우 어떻게 처리되나요?', a: '배열 요소들의 구조를 분석하여 Item 인터페이스를 자동으로 생성한 뒤 Item[] 형태로 깔끔하게 묶어줍니다.' },
        { q: 'interface 대신 type 키워드로 생성할 수도 있나요?', a: '대다수 타입스크립트 프로젝트 표준인 interface 선언문으로 기본 생성되며, 필요에 따라 손쉽게 type 형태로 교체하여 사용하실 수 있습니다.' }
      ],
      ja: [
        { q: 'null値が含まれている場合はどのように型付けされますか？', a: 'サンプルデータで値がnullのフィールドは「any | null」として出力されます。より厳格な型推論を行うには、実際の値が入ったJSONでの実行を推奨します。' },
        { q: '配列の中にオブジェクトが含まれる場合はどうなりますか？', a: '配列内の要素構造から自動的に子インターフェースを生成し、「Item[]」形式で綺麗に定義します。' },
        { q: 'interfaceではなくtypeエイリアスとして出力できますか？', a: '拡張性に優れるinterface形式で標準出力されますが、必要に応じてtypeエイリアスとして柔軟に書き換えて利用可能です。' }
      ]
    },
    notes: {
      en: [
        'Pure client-side AST-like recursive parsing with complete confidentiality.',
        'Supports standard TypeScript 4.x and 5.x syntax without requiring external dependencies.'
      ],
      ko: [
        '민감한 엔터프라이즈 API 스키마를 입력해도 서버 전송 없이 브라우저 내에서만 안전하게 변환됩니다.',
        '최신 TypeScript 5.x 문법과 완벽 호환되며, 복사 후 즉시 컴파일 가능한 무결점 코드를 출력합니다.'
      ],
      ja: [
        '機密性の高い社内APIレスポンスを入力しても、ブラウザ内部で安全に解析・変換されます。',
        '最新のTypeScript 5.x仕様に対応したクリーンで型安全なコードを出力します。'
      ]
    },
    relatedTools: [
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Beautify and validate the JSON payload before converting to TypeScript.', ko: '타입스크립트 변환 전 JSON 문법 오류를 잡고 깔끔하게 정렬합니다.', ja: 'TypeScriptへの変換前にJSON構文を検証・インデント整形します。' }, icon: 'FileJson' },
      { id: 'json-schema-generator', name: 'JSON Schema Generator', desc: { en: 'Generate standard JSON Schema validation drafts from raw JSON.', ko: '동일한 JSON 데이터로부터 런타임 검증용 JSON Schema를 생성합니다.', ja: 'JSONデータから実行時バリデーション用のJSONスキーマを生成します。' }, icon: 'FileCode' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare API responses across different endpoints or environments.', ko: '개발계와 운영계 API 응답의 구조적 차이점을 비교합니다.', ja: '環境ごとのAPIレスポンスの差分を素早く比較します。' }, icon: 'Braces' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Inspect and extract payload types from JSON Web Tokens.', ko: 'JWT 페이로드 JSON을 확인하고 해당 클레임의 타입을 도출합니다.', ja: 'JWTトークンのペイロード構造を確認して型定義に活用します。' }, icon: 'Shield' }
    ]
  },
  {
    id: 'json-schema-generator',
    meta: {
      title: {
        en: 'JSON Schema Generator - Online JSON to Schema Converter',
        ko: 'JSON 스키마 생성기 - JSON to JSON Schema 자동 생성',
        ja: 'JSONスキーマジェネレーター - JSONからスキーマ仕様を自動生成'
      },
      description: {
        en: 'Generate standard JSON Schema specifications (Draft-07 / Draft-2020-12) from sample JSON payloads. Perfect for API validation and OpenAPI/Swagger documentation.',
        ko: '샘플 JSON 데이터로부터 Draft-07 표준 규격의 JSON Schema를 자동 생성합니다. REST API 요청 유효성 검증(Ajv) 및 Swagger/OpenAPI 문서 작성에 필수적입니다.',
        ja: 'サンプルJSONから標準JSONスキーマ（Draft-07等）を自動生成。Ajv等のバリデーションやOpenAPI/Swaggerドキュメント作成に最適。'
      }
    },
    overview: {
      en: 'JSON Schema is an established IETF standard used to annotate and validate JSON documents. When building microservices or exposing public APIs, defining a JSON Schema guarantees that incoming client request bodies conform to expected properties, required fields, and primitive types. This tool inspects your JSON instance and generates a compliant JSON Schema specification instantly.',
      ko: 'JSON Schema는 JSON 데이터의 형태, 필수 필드, 데이터 타입 및 유효성 검증 규칙을 명시하는 IETF 표준 명세입니다. 백엔드 마이크로서비스나 오픈 API를 구축할 때 클라이언트가 보낸 요청 바디(Body)가 규격에 맞는지 검증 라이브러리(Ajv 등)를 통해 검사하거나, Swagger/OpenAPI 명세서를 작성할 때 스키마를 수작업으로 작성하지 않고 한 번에 생성할 수 있습니다.',
      ja: 'JSONスキーマは、JSONデータの構造や必須フィールド、データ型を定義・検証するための標準仕様です。バックエンドでクライアントからのリクエストデータを検証する際（Ajvなど）や、Swagger/OpenAPIの仕様書を作成する際に、手動でのスキーマ記述を大幅に効率化します。'
    },
    whenToUse: {
      en: [
        { title: 'API Request Validation', desc: 'Generate validation schemas for frameworks using Ajv, Zod, or Express validator.' },
        { title: 'OpenAPI & Swagger Specs', desc: 'Create component schema models to document REST endpoints in OpenAPI 3.0 YAML/JSON.' },
        { title: 'Data Contract Enforcement', desc: 'Define rigid schemas between microservice message queues (Kafka, RabbitMQ) to avoid serialization bugs.' },
        { title: 'Automated Testing Payloads', desc: 'Verify that backend API test suites receive payloads strictly conforming to the contract.' }
      ],
      ko: [
        { title: 'API 요청 본문 유효성 검증', desc: 'Ajv, Express 등의 미들웨어에서 사용할 JSON Schema 검증 규칙을 즉시 만듭니다.' },
        { title: 'OpenAPI 및 Swagger 문서화', desc: 'REST API 엔드포인트의 요청/응답 모델을 OpenAPI 3.0 스펙에 맞춰 손쉽게 작성합니다.' },
        { title: '마이크로서비스 데이터 계약', desc: 'Kafka, RabbitMQ 등 메시지 큐 통신 시 서비스 간 페이로드 규격을 엄격히 통제합니다.' },
        { title: '자동화 테스트 검증', desc: 'E2E 및 통합 테스트에서 실제 API 응답이 기대하는 스키마 구조와 일치하는지 자동 검사합니다.' }
      ],
      ja: [
        { title: 'APIリクエストの自動検証', desc: 'AjvやExpressなどで受信データをバリデーションするためのスキーマを瞬時に作成します。' },
        { title: 'Swagger / OpenAPIの仕様作成', desc: 'OpenAPI 3.0形式のコンポーネントスキーマ定義をサンプルJSONから逆算して作成します。' },
        { title: 'マイクロサービス間の契約保証', desc: 'メッセージキュー送受信時のペイロード構造を厳密に定義し、シリアライズエラーを防止します。' },
        { title: 'APIテストのスキーマ検証', desc: '自動化テストスイートで、サーバーレスポンスが期待通りのスキーマに合致しているか検証します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Input Sample JSON', desc: 'Paste a representative JSON payload containing the fields you want in the schema.' },
        { step: 2, title: 'Generate Schema', desc: 'Click generate to analyze property types, required keys, and array structures.' },
        { step: 3, title: 'Inspect Specifications', desc: 'Review the generated JSON Schema with "$schema", "type", "properties", and "required".' },
        { step: 4, title: 'Export & Implement', desc: 'Copy the schema into your backend validation files or download it as schema.json.' }
      ],
      ko: [
        { step: 1, title: '샘플 JSON 붙여넣기', desc: '스키마를 도출하고자 하는 온전한 샘플 JSON 데이터를 입력창에 넣습니다.' },
        { step: 2, title: '스키마 자동 생성', desc: '"스키마 생성"을 실행하여 필드별 타입, 필수 프로퍼티, 배열 구조를 파싱합니다.' },
        { step: 3, title: '규격 검토', desc: '$schema(Draft-07), type: object, properties, required 배열이 올바르게 생성되었는지 확인합니다.' },
        { step: 4, title: '프로젝트에 적용', desc: '생성된 스키마를 복사하여 백엔드 Ajv 검증기나 OpenAPI 문서에 등록합니다.' }
      ],
      ja: [
        { step: 1, title: 'サンプルJSONを入力', desc: 'スキーマの雛形としたい代表的なJSONデータを入力します。' },
        { step: 2, title: 'スキーマ生成実行', desc: 'フィールドの型情報や必須プロパティ、配列の定義を自動推論します。' },
        { step: 3, title: '生成仕様の確認', desc: 'Draft-07規格に準拠したスキーマ定義（properties, requiredなど）を確認します。' },
        { step: 4, title: 'プロジェクトへ適用', desc: '生成されたJSONスキーマをコピーし、バックエンドのバリデーションに導入します。' }
      ]
    },
    example: {
      input: '{\n  "productId": 456,\n  "productName": "DevToolz Pro",\n  "inStock": true\n}',
      output: '{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": {\n    "productId": {\n      "type": "integer"\n    },\n    "productName": {\n      "type": "string"\n    },\n    "inStock": {\n      "type": "boolean"\n    }\n  },\n  "required": [\n    "productId",\n    "productName",\n    "inStock"\n  ]\n}'
    },
    faq: {
      en: [
        { q: 'Which JSON Schema draft standard is generated?', a: 'It outputs standard Draft-07 by default, which is the most widely supported draft across modern backend validation engines like Ajv and OpenAPI 3.0.' },
        { q: 'Does it automatically mark all properties as "required"?', a: 'By default, present keys are categorized under the "required" array to encourage strict data validation. You can easily remove optional fields from the required list in your code.' },
        { q: 'Can it detect specific string formats like date-time or email?', a: 'Common patterns (ISO dates, emails) can be enriched with "format": "date-time" or "format": "email" according to your API validation requirements.' }
      ],
      ko: [
        { q: '어떤 버전의 JSON Schema 표준으로 생성되나요?', a: '현재 업계와 OpenAPI 3.0, Ajv 등 주요 라이브러리에서 가장 안정적이고 널리 호환되는 Draft-07 표준 규격으로 출력됩니다.' },
        { q: '모든 속성이 "required"(필수)로 지정되나요?', a: '엄격한 유효성 검증을 위해 입력된 샘플의 모든 키가 required 목록에 기본 포함됩니다. 선택적(Optional) 필드는 필요에 따라 required 배열에서 제외하시면 됩니다.' },
        { q: '이메일이나 날짜 같은 특수 포맷도 지정 가능한가요?', a: '생성된 기본 스키마의 해당 속성에 "format": "email" 또는 "format": "date-time"을 손쉽게 덧붙여 더 정교한 검증 규칙을 구축할 수 있습니다.' }
      ],
      ja: [
        { q: 'どのバージョンのJSONスキーマ標準が出力されますか？', a: 'OpenAPI 3.0や主要なバリデーションライブラリ（Ajvなど）で最も広く普及しているDraft-07規格で生成されます。' },
        { q: 'すべてのフィールドが「required（必須）」になりますか？', a: '厳格な検証を初期値とするため、入力されたキーはrequired配列に含まれます。任意項目とする場合は該当キーを配列から削除してください。' },
        { q: '日付やメールアドレスなどのフォーマット指定は可能ですか？', a: '生成された各プロパティに「"format": "email"」や「"format": "date-time"」を追加することで、さらに詳細なバリデーションが可能です。' }
      ]
    },
    notes: {
      en: [
        'Pure client-side execution ensures your API schemas and business payloads remain 100% confidential.',
        'Outputs clean, validated JSON Schema compatible with modern backend microservices.'
      ],
      ko: [
        '독점적인 엔터프라이즈 API 페이로드를 입력하더라도 외부 서버 전송 없이 안전하게 브라우저 로컬에서 연산됩니다.',
        '생성된 스키마는 Node.js, Python, Java, Go 등 다양한 언어의 표준 JSON Schema 엔진에서 즉시 구동됩니다.'
      ],
      ja: [
        '社内APIの機密データを投入しても、サーバーへの送信は一切行われずブラウザ内で完結します。',
        'Node.js、Python、Go、Javaなど多様な言語の標準スキーマバリデータでそのまま利用可能です。'
      ]
    },
    relatedTools: [
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Validate and format raw JSON before drafting schema definitions.', ko: '스키마 생성 전 입력 데이터의 JSON 문법 오류를 검증합니다.', ja: 'スキーマ作成前にJSONデータの構文を検証・整形します。' }, icon: 'FileJson' },
      { id: 'json-to-ts', name: 'JSON to TypeScript', desc: { en: 'Convert JSON to static compile-time TypeScript types alongside JSON Schema.', ko: '런타임 검증용 스키마와 함께 컴파일용 TS 인터페이스를 도출합니다.', ja: '実行時バリデーション用のスキーマと同時に静的型定義も生成します。' }, icon: 'Code' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare schema versions to detect breaking API changes.', ko: '스키마 버전 간 차이점을 비교하여 Breaking Change를 감지합니다.', ja: 'スキーマのバージョン差異を比較して互換性の破損を検証します。' }, icon: 'Braces' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Inspect and model JSON schemas for authorization token payloads.', ko: '인증 토큰(JWT)의 페이로드 구조를 분석하고 스키마를 모델링합니다.', ja: '認証トークンのペイロード構造を解析してスキーマ化します。' }, icon: 'Shield' }
    ]
  }
];
