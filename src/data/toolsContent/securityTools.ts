import { ToolContentData } from './types';

export const securityTools: ToolContentData[] = [
  {
    id: 'jwt-decoder',
    meta: {
      title: {
        en: 'JWT Decoder - Decode & Inspect JSON Web Tokens Online',
        ko: 'JWT 디코더 - JSON Web Token 디코딩 및 클레임 분석기',
        ja: 'JWTデコーダー - JSON Web Token解析・検証無料ツール'
      },
      description: {
        en: 'Securely decode and inspect JSON Web Tokens (JWT) in your browser. View Header algorithms, Payload claims, and expiration timestamps without sending your token to any server.',
        ko: '브라우저에서 JSON Web Token(JWT)의 Header와 Payload를 안전하게 디코딩합니다. 토큰 만료 시간(exp), 발급자(iss), 사용자 권한 클레임을 서버 전송 없이 즉시 확인하세요.',
        ja: 'ブラウザ上で安全にJWTトークンをデコード・解析。Header、Payload、有効期限（exp）を外部送信なしで瞬時に確認できます。'
      }
    },
    overview: {
      en: 'JSON Web Tokens (JWT, RFC 7519) are the industry standard for stateless web authentication and API authorization. A JWT consists of three Base64URL-encoded parts separated by dots: Header, Payload, and Signature. Developers frequently need to verify token expiration dates (exp), inspect user permission claims (roles), or diagnose "401 Unauthorized" errors without risking token leakage to remote logging services.',
      ko: 'JSON Web Token(JWT, RFC 7519)은 현대 웹 애플리케이션의 무상태(Stateless) 사용자 인증과 API 인가 처리에 널리 사용되는 표준 규격입니다. 마침표(.)로 구분된 3개 영역(Header, Payload, Signature)으로 구성되며, 개발 중 401 Unauthorized 에러의 원인을 찾거나 토큰의 만료 일시(exp), 사용자 역할(roles), 고유 ID(sub)를 확인할 때 필수적으로 사용됩니다.',
      ja: 'JSON Web Token（JWT）は、Web認証やAPI認可における業界標準の仕様です。ドットで区切られた3つのBase64URL部分（Header, Payload, Signature）から構成され、トークンの有効期限切れやパーミッション情報の確認、401エラーのデバッグ時に不可欠なツールです。'
    },
    whenToUse: {
      en: [
        { title: 'Token Expiration Inspection', desc: 'Convert Unix epoch timestamps in the "exp" claim to readable local dates to debug premature logouts.' },
        { title: 'RBAC Permission Auditing', desc: 'Verify whether the expected roles, scopes, or group attributes are properly contained in the payload.' },
        { title: '401 Unauthorized Troubleshooting', desc: 'Inspect issuer (iss) and audience (aud) claims to diagnose token validation failures.' },
        { title: 'Algorithm & Header Verification', desc: 'Check the signing algorithm (e.g., HS256, RS256) and Key ID (kid) defined in the token header.' }
      ],
      ko: [
        { title: '토큰 만료 시간(exp) 확인', desc: 'Unix 타임스탬프로 기록된 exp 값을 읽기 쉬운 현지 일시로 변환하여 갑작스러운 로그아웃 원인을 파악합니다.' },
        { title: '권한(Role/Scope) 검증', desc: '관리자 권한이나 API 스코프가 페이로드 내에 정상적으로 담겨 발급되었는지 점검합니다.' },
        { title: '401 Unauthorized 디버깅', desc: '발급자(iss)나 수신자(aud) 설정이 일치하지 않아 발생하는 백엔드 인증 실패 원인을 분석합니다.' },
        { title: '서명 알고리즘 및 Header 확인', desc: '토큰이 RS256인지 HS256인지, kid(Key ID)가 올바르게 지정되었는지 헤더 정보를 확인합니다.' }
      ],
      ja: [
        { title: '有効期限（exp）の確認', desc: 'Unixタイムスタンプで記述された有効期限をローカル日時に変換し、セッション切れの原因を調査します。' },
        { title: '権限・ロール（Roles）の検証', desc: 'ユーザーに付与されたロールや権限スコープがPayloadに正しく含まれているか確認します。' },
        { title: '401認証エラーの調査', desc: '発行者（iss）や対象受信者（aud）の不一致による認証失敗の原因を特定します。' },
        { title: '署名アルゴリズムの確認', desc: 'RS256やHS256などのアルゴリズムやKey ID（kid）が正しく指定されているか検証します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Paste Token', desc: 'Paste your raw Bearer or Authorization JWT string into the input editor.' },
        { step: 2, title: 'Instant Decoding', desc: 'The tool automatically splits the 3 dot-delimited segments and decodes the Base64URL data.' },
        { step: 3, title: 'Inspect Claims', desc: 'Review the formatted Header and Payload JSON blocks with highlighted expiration status.' },
        { step: 4, title: 'Copy JSON', desc: 'Copy the parsed payload claims to your clipboard for documentation or code testing.' }
      ],
      ko: [
        { step: 1, title: '토큰 붙여넣기', desc: '브라우저 쿠키나 Authorization 헤더에서 복사한 JWT 문자열(ey...)을 입력창에 넣습니다.' },
        { step: 2, title: '자동 디코딩', desc: '점(.)으로 구분된 3개 파트를 자동 분리하고 Base64URL 알고리즘으로 디코딩합니다.' },
        { step: 3, title: '클레임 및 만료일 확인', desc: 'Header의 알고리즘과 Payload의 사용자 정보, 만료 일시(만료 여부 표시)를 확인합니다.' },
        { step: 4, title: '결과 복사 및 활용', desc: '파싱된 JSON 데이터를 복사하여 테스트 코드나 API 문서에 활용합니다.' }
      ],
      ja: [
        { step: 1, title: 'トークンを貼り付け', desc: 'AuthorizationヘッダーなどからコピーしたJWT文字列（ey...）を入力します。' },
        { step: 2, title: '自動デコード', desc: 'ドットで区切られた3つの領域を即座に分解し、Base64URLデコードを実行します。' },
        { step: 3, title: 'クレームと有効期限を確認', desc: 'Headerのアルゴリズム情報やPayloadのユーザー属性、期限切れ状況を把握します。' },
        { step: 4, title: '結果をコピー', desc: '整形されたJSONデータをクリップボードにコピーして利用します。' }
      ]
    },
    example: {
      input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4z...',
      output: '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "role": "admin",\n  "iat": 1516239022,\n  "exp": 1916239022 (Valid)\n}'
    },
    faq: {
      en: [
        { q: 'Does decoding a JWT compromise security?', a: 'JWT payloads are simply Base64URL-encoded, meaning anyone who has the token can read the claims. Decoding reveals the content, but the signature part requires the private/secret key to forge. Never store sensitive passwords or credit card numbers in a JWT payload.' },
        { q: 'Can this tool verify the signature of my token?', a: 'This tool decodes the token claims purely on the client side. To verify the cryptographic signature, you must provide your private key or public certificate, which should always remain securely protected in your local/backend environment.' },
        { q: 'Why does my token say "Expired"?', a: 'The "exp" (Expiration Time) claim is an epoch timestamp in seconds. If the current system time is greater than this value, the token has expired and API gateways will reject it with a 401 response.' }
      ],
      ko: [
        { q: 'JWT를 웹에서 디코딩하면 보안상 위험하지 않나요?', a: '본 도구는 100% 브라우저 메모리 안에서만 동작하며 외부 서버로 토큰을 전송하지 않습니다. 또한 JWT의 Payload는 암호화가 아닌 단순 Base64 인코딩이므로 원래 누구나 열어볼 수 있는 공개 클레임입니다. 따라서 비밀번호나 개인정보는 애초에 JWT에 넣지 않는 것이 보안 원칙입니다.' },
        { q: '토큰 서명(Signature) 유효성도 검증되나요?', a: '서명 검증은 토큰을 발급한 서버의 비밀키(Secret Key)나 공개키 인증서가 필요합니다. 비밀키 유출을 방지하기 위해 이 도구는 안전한 클레임 열람 및 만료시간 분석에 집중합니다.' },
        { q: '토큰이 왜 "만료됨(Expired)"으로 표시되나요?', a: 'JWT의 exp(만료시간) 클레임은 초 단위의 유닉스 시간입니다. 현재 시간보다 과거의 시간이 적혀있다면 이미 수명이 다한 토큰이며, API 서버에서 인증 거부(401) 처리가 발생합니다.' }
      ],
      ja: [
        { q: 'JWTをWeb上でデコードしても安全ですか？', a: '本ツールはブラウザのクライアントサイドでのみ動作し、トークンが外部サーバーへ送信されることはありません。また、JWTのPayloadは暗号化ではなくBase64エンコードに過ぎないため、機密情報をそもそも含めない設計が原則です。' },
        { q: '署名（Signature）の検証は行われますか？', a: '署名検証には秘密鍵または公開鍵が必要です。秘密鍵の漏洩を防ぐため、本ツールは安全なクレーム閲覧と有効期限の確認に特化しています。' },
        { q: 'なぜトークンが「期限切れ」と表示されるのですか？', a: 'expクレームに指定されたUnix時間が現在時刻を過ぎている場合、そのトークンは失効しており、APIサーバー側で拒否されます。' }
      ]
    },
    notes: {
      en: [
        'Tokens are processed strictly inside your browser memory; zero network transmission ensures your session credentials remain private.',
        'Supports standard RFC 7519 JWT specifications including common claims: sub, iss, aud, exp, nbf, and iat.'
      ],
      ko: [
        '입력한 인증 토큰은 오직 사용자의 브라우저에서만 해석되며, 어떤 원격 서버나 로깅 시스템으로도 전송되지 않습니다.',
        'RFC 7519 표준에 따른 일반 클레임(sub, iss, aud, exp, iat, nbf)을 정확하게 파싱하고 시간을 현지화합니다.'
      ],
      ja: [
        '入力されたトークンはブラウザ内でのみ処理され、外部への送信やログ記録は一切行われません。',
        'RFC 7519規格に基づく主要なクレーム（sub, iss, aud, exp, iatなど）を正確に可視化します。'
      ]
    },
    relatedTools: [
      { id: 'base64-converter', name: 'Base64 Converter', desc: { en: 'Inspect and decode raw Base64 and Base64URL chunks.', ko: 'Base64 및 Base64URL 형식의 바이너리 데이터를 직접 인코딩/디코딩합니다.', ja: 'Base64やBase64URL形式のデータを手動でエンコード・デコードします。' }, icon: 'Binary' },
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Beautify complex nested JSON payload objects from tokens.', ko: 'JWT 페이로드에서 추출한 복잡한 JSON 구조를 읽기 쉽게 정렬합니다.', ja: 'JWTから抽出した複雑なJSONペイロードを見やすく整形します。' }, icon: 'FileJson' },
      { id: 'unix-timestamp', name: 'Unix Timestamp Converter', desc: { en: 'Convert epoch seconds in "exp" and "iat" claims to human-readable dates.', ko: 'exp, iat 클레임의 초 단위 타임스탬프를 상세 일시로 변환합니다.', ja: 'expやiatなどの秒単位タイムスタンプを詳細な日時に変換します。' }, icon: 'Clock' },
      { id: 'hash-generator', name: 'Hash Generator', desc: { en: 'Calculate HMAC and SHA-256 digests used in token signing.', ko: '토큰 서명에 사용되는 SHA-256 및 해시 다이제스트를 계산합니다.', ja: 'トークン署名に用いられる暗号学的ハッシュ値を計算します。' }, icon: 'Hash' }
    ]
  },
  {
    id: 'password-generator',
    meta: {
      title: {
        en: 'Password Generator - Strong & Secure Random Password Generator',
        ko: '비밀번호 생성기 - 안전하고 강력한 무작위 비밀번호 생성',
        ja: 'パスワード生成器 - 強力で安全なランダムパスワード自動生成'
      },
      description: {
        en: 'Generate strong, unpredictable random passwords with customizable length, numbers, symbols, and ambiguous character filters using cryptographic entropy.',
        ko: '영문 대소문자, 숫자, 특수문자 조합 및 헷갈리는 문자 제외 옵션을 지원하는 고보안 무작위 비밀번호 생성기입니다. Web Crypto API 기반의 암호학적 난수를 사용합니다.',
        ja: 'Web Crypto APIの暗号学的乱数を用いた高セキュリティなランダムパスワード生成ツール。長さ、記号、紛らわしい文字の除外などを自由に設定可能。'
      }
    },
    overview: {
      en: 'Weak, reused passwords are the number one vector for credential stuffing and brute-force account compromises. Modern security standards mandate lengthy passwords (16+ characters) combining uppercase, lowercase, digits, and symbols. This generator uses standard Web Crypto API (window.crypto.getRandomValues) to create cryptographically unpredictable strings completely offline in your browser.',
      ko: '반복되거나 단순한 비밀번호는 브루트포스(무차별 대입) 공격 및 크리덴셜 스터핑(사전 공격)의 주된 표적이 됩니다. 엔터프라이즈 보안 가이드라인은 대소문자, 숫자, 특수문자를 혼합한 16자리 이상의 비밀번호 사용을 강력히 권장합니다. 본 도구는 브라우저 내장 암호화 엔진(window.crypto)을 활용하여 완벽한 암호학적 난수를 생성합니다.',
      ja: '単純なパスワードや使い回しは、総当たり攻撃（ブルートフォース）や不正アクセスの最大の標的です。近年のセキュリティ基準では、16文字以上の大文字・小文字・数字・記号を組み合わせたパスワードが推奨されます。本ツールはWeb Crypto APIを活用し、予測不可能な安全なパスワードをブラウザ内で瞬時に生成します。'
    },
    whenToUse: {
      en: [
        { title: 'New Account Creation', desc: 'Create unique, complex passwords for banking, cloud platforms (AWS, GCP), and email accounts.' },
        { title: 'Database & Server Secrets', desc: 'Generate high-entropy master keys for database connections, SSH users, and root credentials.' },
        { title: 'API Keys & Bearer Tokens', desc: 'Generate alphanumeric secret tokens to authenticate custom internal microservice webhooks.' },
        { title: 'Ambiguous Character Filtering', desc: 'Avoid easily confused characters (O vs 0, l vs 1) for passwords that humans may need to transcribe.' }
      ],
      ko: [
        { title: '신규 계정 회원가입', desc: 'AWS, 구글 클라우드, 금융 포털 등 중요 서비스 계정에 사용할 안전하고 독립적인 암호를 만듭니다.' },
        { title: '데이터베이스 및 서버 루트 계정', desc: 'PostgreSQL, MySQL, SSH 접속에 필요한 엔트로피 높은 마스터 패스워드를 구성합니다.' },
        { title: 'API 시크릿 키 발급', desc: '웹훅 및 내부 마이크로서비스 인증에 사용할 영숫자 조합의 무작위 비밀 토큰을 생성합니다.' },
        { title: '오타 방지(혼동 문자 제외)', desc: '화면을 보고 직접 입력해야 하는 경우를 위해 0과 O, 1과 l처럼 헷갈리는 문자를 필터링합니다.' }
      ],
      ja: [
        { title: '新規アカウントの登録', desc: 'クラウドサービス（AWS/GCP）や金融機関アカウント向けの強力な個別パスワードを作成します。' },
        { title: 'データベース・サーバーの認証情報', desc: 'DBのルートパスワードやSSH接続キーとして十分なエントロピーを持つ文字列を生成します。' },
        { title: 'API秘密鍵・トークンの作成', desc: '内部マイクロサービスやWebhook認証で使用するセキュアな乱数トークンを生成します。' },
        { title: '見間違いやすい文字の除外', desc: '手入力時のミスを防ぐため、数字の0とアルファベットのO、数字の1とlなどを除外して生成します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Set Length', desc: 'Choose your desired password length (16 to 32 characters recommended for optimal security).' },
        { step: 2, title: 'Toggle Character Sets', desc: 'Select uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%).' },
        { step: 3, title: 'Exclude Ambiguous', desc: 'Enable "Exclude Ambiguous" to remove lookalike characters like 0/O, 1/l, and I.' },
        { step: 4, title: 'Generate & Copy', desc: 'Click generate, inspect the entropy strength indicator, and copy the password securely.' }
      ],
      ko: [
        { step: 1, title: '비밀번호 길이 조절', desc: '슬라이더를 조작해 원하는 자릿수(보안성을 위해 16자리 이상 권장)를 지정합니다.' },
        { step: 2, title: '문자 구성 선택', desc: '대문자(A-Z), 소문자(a-z), 숫자(0-9), 특수문자(!@#$%)의 포함 여부를 선택합니다.' },
        { step: 3, title: '혼동 문자 제외 옵션', desc: '입력 실수 방지가 필요한 경우 0, O, l, 1, I 등의 유사 문자를 제외하도록 체크합니다.' },
        { step: 4, title: '생성 및 안전한 복사', desc: '생성 버튼을 누른 후 보안 강도 게이지를 확인하고 복사하여 비밀번호 관리자에 저장합니다.' }
      ],
      ja: [
        { step: 1, title: '文字数の指定', desc: 'スライダーを動かしてパスワードの長さ（安全のため16文字以上を推奨）を設定します。' },
        { step: 2, title: '使用文字の選択', desc: '大文字、小文字、数字、記号（!@#$%など）の組み合わせを切り替えます。' },
        { step: 3, title: '見間違い文字の除外', desc: '手入力の頻度が高い場合、0とO、1とlなどの類似文字を除外するオプションを有効にします。' },
        { step: 4, title: '生成してコピー', desc: '生成ボタンを押し、強度メーターを確認してクリップボードに安全にコピーします。' }
      ]
    },
    example: {
      input: 'Length: 20, Include: Uppercase, Lowercase, Numbers, Symbols, Exclude Ambiguous: Yes',
      output: 'kR7#mP9$vW2!xN5*qT8&'
    },
    faq: {
      en: [
        { q: 'Are generated passwords saved anywhere?', a: 'Never. Passwords are generated exclusively on your device via standard browser JavaScript Web Crypto API and immediately discarded. We never log or transmit passwords.' },
        { q: 'What is cryptographic entropy in password generation?', a: 'Entropy measures the unpredictability of a password in bits. A 20-character password using all character types offers over 120 bits of entropy, making brute-force cracking mathematically infeasible for billions of years.' },
        { q: 'Why avoid Math.random() for passwords?', a: 'Math.random() is a pseudo-random number generator designed for speed, not security, and its output sequence can be reverse-engineered. This tool strictly relies on window.crypto.getRandomValues, which pulls true entropy from OS-level hardware noise.' }
      ],
      ko: [
        { q: '생성된 비밀번호가 서버에 기록되나요?', a: '절대 기록되지 않습니다. 모든 연산은 사용자의 컴퓨터 브라우저 메모리 안에서만 Web Crypto API를 통해 실행되며, 페이지를 닫거나 새로고침하면 즉시 소멸합니다.' },
        { q: '비밀번호 엔트로피(Entropy)란 무엇인가요?', a: '비밀번호의 무작위성과 예측 불가능성을 나타내는 수학적 단위입니다. 대소문자, 숫자, 특수문자를 조합한 20자리 비밀번호는 120비트 이상의 엔트로피를 가지며, 슈퍼컴퓨터로도 수억 년 동안 해독할 수 없습니다.' },
        { q: '자바스크립트 기본 Math.random()을 쓰지 않는 이유는 무엇인가요?', a: 'Math.random()은 단순한 유사 난수 함수로 시드(seed) 값을 추적하면 다음 생성될 값을 예측할 수 있어 보안용으로 부적합합니다. 본 도구는 운영체제의 하드웨어 노이즈 엔트로피를 사용하는 window.crypto.getRandomValues를 전적으로 사용합니다.' }
      ],
      ja: [
        { q: '生成されたパスワードがサーバーに保存されることはありますか？', a: '一切ありません。すべてのパスワードはブラウザ内のWeb Crypto APIによって生成され、いかなる通信も行われません。' },
        { q: 'パスワードのエントロピーとは何ですか？', a: '文字列の予測不可能性を表す情報理論上の尺度です。記号を含む20文字のパスワードは120ビット以上のエントロピーを持ち、総当たり攻撃に対して物理的に破られない強度を誇ります。' },
        { q: 'なぜMath.random()を使用しないのですか？', a: 'Math.random()は擬似乱数であり、アルゴリズムの周期性から予測が可能です。本ツールはOSハードウェアの乱数源を利用する「window.crypto.getRandomValues」を厳格に使用しています。' }
      ]
    },
    notes: {
      en: [
        'Uses window.crypto.getRandomValues() for cryptographically secure pseudo-random number generation (CSPRNG).',
        'We strongly advise storing your generated passwords in a dedicated password manager (e.g., 1Password, Bitwarden).'
      ],
      ko: [
        '운영체제 수준의 CSPRNG(암호학적으로 안전한 의사 난수 생성기)를 활용하므로 절대 패턴이 예측되지 않습니다.',
        '생성된 강력한 비밀번호는 기억하려 하지 마시고 Bitwarden, 1Password 등 안전한 비밀번호 관리자(Password Manager)에 보관하세요.'
      ],
      ja: [
        'OSレベルのCSPRNG（暗号論的擬似乱数生成器）を使用しており、高いランダム性が保証されます。',
        '生成したパスワードは忘れないよう、Bitwardenや1Passwordなどの専用パスワードマネージャーに保管することを推奨します。'
      ]
    },
    relatedTools: [
      { id: 'uuid-generator', name: 'UUID Generator', desc: { en: 'Generate high-entropy RFC 4122 v4 unique identifiers.', ko: '충돌 없는 분산 시스템용 RFC 4122 v4 UUID 식별자를 생성합니다.', ja: 'RFC 4122 v4仕様に基づく重複のないUUIDを生成します。' }, icon: 'Fingerprint' },
      { id: 'hash-generator', name: 'Hash Generator', desc: { en: 'Compute SHA-256 and SHA-512 hashes for secure credential storage.', ko: '비밀번호 암호화 저장에 쓰이는 SHA-256 해시값을 산출합니다.', ja: 'パスワードのハッシュ化検証に使用するSHA-256値を計算します。' }, icon: 'Hash' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Inspect tokens authenticated with high-security credentials.', ko: '강력한 비밀번호로 발급된 JWT 인증 토큰의 유효성을 검사합니다.', ja: '認証情報から発行されたJWTトークンの内容を検証します。' }, icon: 'Shield' },
      { id: 'base64-converter', name: 'Base64 Converter', desc: { en: 'Encode credentials for HTTP Basic Authentication headers.', ko: '생성한 자격증명을 HTTP Basic 인증 헤더용으로 인코딩합니다.', ja: '生成した認証情報をHTTP Basic認証ヘッダー用にエンコードします。' }, icon: 'Binary' }
    ]
  },
  {
    id: 'hash-generator',
    meta: {
      title: {
        en: 'Hash Generator - MD5, SHA-1, SHA-256, SHA-512 Online',
        ko: '해시 생성기 - MD5, SHA-1, SHA-256, SHA-512 암호화 해시 계산',
        ja: 'ハッシュ生成ツール - MD5, SHA-1, SHA-256, SHA-512 オンライン計算'
      },
      description: {
        en: 'Calculate cryptographic hash checksums including MD5, SHA-1, SHA-256, and SHA-512 in real time. Perfect for data integrity verification, password digests, and commit hashing.',
        ko: '텍스트나 파일에 대한 MD5, SHA-1, SHA-256, SHA-512 단방향 암호화 해시를 실시간 계산합니다. 파일 무결성 체크섬 확인 및 데이터 핑거프린트 도출에 필수적인 도구입니다.',
        ja: 'テキストからMD5、SHA-1、SHA-256、SHA-512などの暗号学的ハッシュ値をリアルタイム計算。データの完全性検証やチェックサム確認に最適。'
      }
    },
    overview: {
      en: 'A cryptographic hash function maps arbitrary data to a fixed-size bit string (digest) designed to be a one-way mathematical operation. Modifying even a single character in the input completely alters the resulting hash (the avalanche effect). Software engineers rely on hashes like SHA-256 to verify downloaded file integrity, deduplicate database rows, and create unique content address identifiers.',
      ko: '암호학적 해시 함수는 임의의 길이의 텍스트나 데이터를 입력받아 고정된 길이의 비트 문자열(다이제스트)로 변환하는 단방향 수학 연산입니다. 입력값이 단 한 글자만 바뀌어도 결과 해시값이 완전히 달라지는 눈사태 효과(Avalanche Effect)를 보입니다. 파일 다운로드 시 위변조를 검증하거나, 데이터베이스 중복 제거, 깃(Git) 커밋 식별 등에 표준적으로 활용됩니다.',
      ja: '暗号学的ハッシュ関数は、任意の長さのデータを固定長のビット列（ダイジェスト）に変換する一方向の計算アルゴリズムです。入力データが1文字変わるだけで結果が全く異なる「雪崩効果」を持ちます。ダウンロードしたファイルの改ざん検知やGitのコミット識別などに幅広く利用されています。'
    },
    whenToUse: {
      en: [
        { title: 'Download Integrity Verification', desc: 'Compare downloaded installer checksums against the official SHA-256 hash published by distributors.' },
        { title: 'Data Deduplication & Fingerprinting', desc: 'Hash large data payloads to create compact unique fingerprints for caching or database indexing.' },
        { title: 'Digital Signatures & Blockchain', desc: 'Generate message digests as the foundation for asymmetric cryptographic signing.' },
        { title: 'Legacy Protocol Debugging', desc: 'Inspect MD5 or SHA-1 hashes used in legacy systems or ETags in HTTP caching headers.' }
      ],
      ko: [
        { title: '다운로드 파일 무결성 검증', desc: '공식 배포처가 공개한 SHA-256 체크섬과 내가 다운로드한 파일의 해시를 비교하여 변조 여부를 확인합니다.' },
        { title: '데이터 중복 제거 및 캐싱', desc: '대용량 데이터의 고유 핑거프린트(지문)를 해시값으로 생성하여 캐시 키나 인덱스로 활용합니다.' },
        { title: '전자 서명 및 블록체인', desc: '비대칭 암호화 서명 알고리즘의 기초가 되는 원문 메시지의 다이제스트를 신속하게 산출합니다.' },
        { title: 'HTTP ETag 및 레거시 디버깅', desc: '웹 서버가 리소스 캐싱을 위해 ETag 헤더에 부여한 MD5/SHA-1 해시 일치 여부를 대조합니다.' }
      ],
      ja: [
        { title: 'ダウンロードファイルの完全性確認', desc: '公式サイトで公開されているSHA-256チェックサムと比較し、ファイルが改ざんされていないか検証します。' },
        { title: 'データの重複排除とキャッシュ', desc: '大容量データのハッシュ値を算出し、一意の指紋（フィンガープリント）としてキャッシュキーに利用します。' },
        { title: '電子署名・ブロックチェーン基盤', desc: '公開鍵暗号による電子署名の入力となるメッセージダイジェストを素早く算出します。' },
        { title: 'HTTP ETagの確認', desc: 'Webサーバーがキャッシュ判定に使用するETagヘッダーのハッシュ値とローカルデータを照合します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Enter Text', desc: 'Type or paste the input string you wish to hash into the editor.' },
        { step: 2, title: 'Real-time Hashing', desc: 'The tool calculates digests across MD5, SHA-1, SHA-256, and SHA-512 simultaneously.' },
        { step: 3, title: 'Select Case', desc: 'Toggle between lowercase and uppercase hex representations based on your requirements.' },
        { step: 4, title: 'Copy Hash', desc: 'Click copy next to your desired hash algorithm for instant use.' }
      ],
      ko: [
        { step: 1, title: '텍스트 입력', desc: '해시값을 계산하고자 하는 원문 문자열을 입력창에 입력합니다.' },
        { step: 2, title: '실시간 해시 연산', desc: '입력과 동시에 MD5, SHA-1, SHA-256, SHA-512 결과가 브라우저에서 즉각 계산됩니다.' },
        { step: 3, title: '대소문자 표기 설정', desc: '프로젝트 규격에 맞게 소문자 16진수 또는 대문자 16진수로 표기를 전환합니다.' },
        { step: 4, title: '해시값 복사', desc: '원하는 알고리즘 옆의 복사 버튼을 눌러 체크섬을 클립보드에 담습니다.' }
      ],
      ja: [
        { step: 1, title: 'テキストを入力', desc: 'ハッシュ値を計算したい文字列を入力欄に貼り付けます。' },
        { step: 2, title: 'リアルタイム計算', desc: '入力と同時にMD5、SHA-1、SHA-256、SHA-512の各ハッシュ値が即座に出力されます。' },
        { step: 3, title: '大文字・小文字の切替', desc: 'システムの仕様に合わせて16進数の大文字・小文字表記をワンクリックで切り替えます。' },
        { step: 4, title: 'ハッシュ値をコピー', desc: '必要なアルゴリズムの横にあるコピーボタンを押して利用します。' }
      ]
    },
    example: {
      input: 'DevToolz 2026',
      output: 'SHA-256: 7d6c6e7a1b48b1d9263fe507c5702bb2b406b2d2a457fcefc8846387d3a2ad07'
    },
    faq: {
      en: [
        { q: 'Can a hash be reversed back to original text?', a: 'No. Cryptographic hashes are strictly one-way mathematical functions. You cannot decrypt a hash. The only way to find the original input is brute-force trial or lookup tables (rainbow tables).' },
        { q: 'Is MD5 still safe to use today?', a: 'No. MD5 and SHA-1 have known collision vulnerabilities where two distinct inputs yield identical hashes. They are acceptable only for non-security checksums. For security-critical applications, always use SHA-256 or SHA-512.' },
        { q: 'Does this tool send my hashed data to a server?', a: 'No. All calculations are executed locally via the browser Web Crypto API (SubtleCrypto.digest) for complete privacy and instantaneous performance.' }
      ],
      ko: [
        { q: '해시값을 다시 원본 텍스트로 되돌릴 수 있나요?', a: '불가능합니다. 암호학적 해시는 단방향 연산이므로 수학적으로 복호화(Decryption)할 수 없습니다. 원문을 찾는 유일한 방법은 무차별 대입이나 미리 계산된 레인보우 테이블을 대조하는 것뿐입니다.' },
        { q: 'MD5와 SHA-1을 아직 보안용으로 써도 되나요?', a: '권장하지 않습니다. MD5와 SHA-1은 서로 다른 입력값이 같은 해시를 만들어내는 충돌 공격(Collision) 취약점이 발견되었습니다. 보안이 중요한 암호화나 인증에는 반드시 SHA-256 이상의 최신 알고리즘을 사용해야 합니다.' },
        { q: '해시 계산 시 입력한 데이터가 서버로 전송되나요?', a: '전혀 전송되지 않습니다. 브라우저의 표준 Web Crypto API(SubtleCrypto)를 사용하여 기기 내부에서 순수 연산되므로 매우 빠르고 안전합니다.' }
      ],
      ja: [
        { q: 'ハッシュ値から元のテキストを復元（復号）できますか？', a: 'できません。暗号学的ハッシュは不可逆な一方向関数であり、数学的に復号することは不可能です。特定するには総当たり攻撃による試行しかありません。' },
        { q: 'MD5やSHA-1は現在でもセキュリティ上安全ですか？', a: '推奨されません。衝突攻撃（異なるデータから同じハッシュが生成される現象）の脆弱性が報告されているため、セキュリティ用途には必ずSHA-256やSHA-512を使用してください。' },
        { q: 'ハッシュ計算時に入力データがサーバーへ送信されますか？', a: '一切送信されません。ブラウザ標準のWeb Crypto APIを用いてクライアント端末内でローカル計算されるため、完全なプライバシーが保たれます。' }
      ]
    },
    notes: {
      en: [
        'Harnesses the browser native window.crypto.subtle.digest engine for maximum execution speed.',
        'Properly handles UTF-8 multi-byte characters and edge-case binary inputs.'
      ],
      ko: [
        '브라우저 내장 하드웨어 가속 SubtleCrypto 엔진을 사용하여 밀리초 단위로 신속하게 계산합니다.',
        '한글 및 다국어 UTF-8 인코딩을 정확하게 바이트 배열로 변환하여 표준 해시 규격을 충족합니다.'
      ],
      ja: [
        'ブラウザネイティブのSubtleCryptoAPIを使用し、高速かつ安定した計算処理を実現しています。',
        '日本語を含むUTF-8マルチバイト文字列も正確にバイト変換され、標準的なハッシュ値を出力します。'
      ]
    },
    relatedTools: [
      { id: 'uuid-generator', name: 'UUID Generator', desc: { en: 'Generate random UUID v4 identifiers alongside hash fingerprints.', ko: '해시 체크섬과 함께 데이터 식별에 쓰이는 무작위 UUID를 생성합니다.', ja: 'ハッシュフィンガープリントと並びデータ識別に使われるUUIDを生成します。' }, icon: 'Fingerprint' },
      { id: 'password-generator', name: 'Password Generator', desc: { en: 'Generate high-entropy passwords before creating hash digests.', ko: '해시화하여 저장할 고강도 무작위 비밀번호를 생성합니다.', ja: 'ハッシュ化して保存するための高強度パスワードを生成します。' }, icon: 'Lock' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Decode tokens and inspect signature verification algorithms.', ko: '해시 알고리즘(HS256 등)으로 서명된 JWT 토큰을 분석합니다.', ja: 'ハッシュアルゴリズムで署名されたJWTトークンを解析します。' }, icon: 'Shield' },
      { id: 'base64-converter', name: 'Base64 Converter', desc: { en: 'Encode raw binary hash digests into Base64 strings.', ko: '바이너리 해시 다이제스트를 Base64 문자열로 상호 변환합니다.', ja: 'バイナリ形式のハッシュダイジェストをBase64に変換します。' }, icon: 'Binary' }
    ]
  },
  {
    id: 'uuid-generator',
    meta: {
      title: {
        en: 'UUID Generator - Generate RFC 4122 v4 UUIDs Online',
        ko: 'UUID 생성기 - v4 고유 식별자 대량 생성 도구',
        ja: 'UUID生成ツール - RFC 4122 v4準拠のGUID/UUID自動生成'
      },
      description: {
        en: 'Generate cryptographically random UUID v4 (Universally Unique Identifiers) instantly. Supports batch generation, hyphen toggling, uppercase/lowercase formatting, and JSON export.',
        ko: '암호학적 난수 기반의 RFC 4122 v4 UUID(GUID)를 실시간 생성합니다. 대량 생성(최대 100개), 하이픈 제거, 대소문자 변환 및 JSON 내보내기를 지원합니다.',
        ja: '暗号学的乱数に基づくRFC 4122 v4 UUID（GUID）を生成。一括生成、ハイフン有無、大文字/小文字切替、JSON形式エクスポートに対応。'
      }
    },
    overview: {
      en: 'A Universally Unique Identifier (UUID, also known as GUID) is a 128-bit identifier standardized under RFC 4122. UUID Version 4 uses 122 bits of pseudo-random entropy. In distributed architectures and microservices, relying on sequential database auto-increment IDs causes coordination bottlenecks and reveals business metrics. UUID v4 solves this by enabling distributed systems to generate globally unique primary keys without central coordination.',
      ko: 'UUID(Universally Unique Identifier, GUID라고도 함)는 분산 컴퓨팅 환경에서 중복 없는 고유성을 보장하기 위해 고안된 128비트 식별자 규격(RFC 4122)입니다. 특히 버전 4(v4)는 122비트의 무작위 난수를 사용하여 생성됩니다. 마이크로서비스나 분산 DB에서 순차 증가 번호(Auto Increment ID)를 쓰면 중앙 동기화 병목이 발생하거나 비즈니스 규모가 노출될 수 있는데, UUID v4를 사용하면 시스템 간 통신 없이도 전 세계에서 유일한 기본키(PK)를 독립 생성할 수 있습니다.',
      ja: 'UUID（Universally Unique Identifier）は、分散システムにおいて中央の管理サーバーなしに一意性を保証できる128ビットの識別子規格です。バージョン4（v4）は暗号学的な乱数に基づいて生成されます。データベースの主キー（PK）や分散トレーシングIDとして広く使用されています。'
    },
    whenToUse: {
      en: [
        { title: 'Distributed Database Primary Keys', desc: 'Assign conflict-free primary keys (PKs) in distributed databases like MongoDB, DynamoDB, or CockroachDB.' },
        { title: 'Distributed Tracing & Request IDs', desc: 'Tag API requests with an "X-Request-ID" header to trace transactions across microservice logs.' },
        { title: 'Mock & Seed Data Generation', desc: 'Populate test database seed scripts with realistic, non-colliding unique record identifiers.' },
        { title: 'Preventing Enumeration Attacks', desc: 'Replace sequential integer URLs (/users/1024) with unguessable UUIDs (/users/a8098c1a-...) to protect user privacy.' }
      ],
      ko: [
        { title: '분산 데이터베이스의 기본키(PK)', desc: 'PostgreSQL, DynamoDB, MongoDB 등에서 노드 간 충돌 없는 분산 레코드 기본키로 지정합니다.' },
        { title: '분산 추적 Request-ID 발급', desc: '마이크로서비스 간 HTTP 요청 헤더(X-Request-ID)에 UUID를 주입하여 전 구간 트랜잭션 로그를 추적합니다.' },
        { title: '개발용 목(Mock) 데이터 생성', desc: '테스트 환경이나 데이터베이스 시드 스크립트에 필요한 고유 식별자를 대량으로 즉시 생성합니다.' },
        { title: '순차 ID 유추 공격(ID Enumeration) 차단', desc: '/orders/1, /orders/2 처럼 다음 번호가 예측되는 문제를 난수 UUID로 치환하여 데이터 유출을 방어합니다.' }
      ],
      ja: [
        { title: '分散データベースの主キー（PK）', desc: 'DynamoDBやPostgreSQLなどで、サーバー間通信を行わずに一意なプライマリキーを発行します。' },
        { title: '分散トレーシング用Request-ID', desc: 'マイクロサービス間でリクエストを追跡するための「X-Request-ID」ヘッダーとして利用します。' },
        { title: 'テスト用モックデータの一括作成', desc: 'テストデータベースの投入データ用として、重複しない一意の識別子をまとめて用意します。' },
        { title: 'ID推測攻撃の防止', desc: '連番IDによるユーザー情報の推測を防ぐため、推測困難なランダムUUIDで保護します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Select Quantity', desc: 'Choose how many UUIDs you want to generate in a single batch (1 to 100).' },
        { step: 2, title: 'Configure Format', desc: 'Toggle hyphens (8-4-4-4-12) or remove them for compact 32-character strings.' },
        { step: 3, title: 'Choose Casing', desc: 'Select standard lowercase or uppercase hexadecimal output.' },
        { step: 4, title: 'Copy or Export', desc: 'Copy all generated UUIDs with one click or export them as JSON/CSV arrays.' }
      ],
      ko: [
        { step: 1, title: '생성 개수 설정', desc: '한 번에 생성할 UUID의 개수(1개부터 최대 100개까지)를 선택합니다.' },
        { step: 2, title: '하이픈 및 형식 지정', desc: '표준 하이픈 형태(8-4-4-4-12)를 유지할지, 하이픈 없는 32자리 연속 형태로 뽑을지 결정합니다.' },
        { step: 3, title: '대소문자 지정', desc: '시스템 규격에 맞춰 소문자(기본) 또는 대문자로 변환합니다.' },
        { step: 4, title: '복사 및 다운로드', desc: '클릭 한 번으로 전체 목록을 복사하거나 JSON 배열 형식으로 다운로드합니다.' }
      ],
      ja: [
        { step: 1, title: '生成個数を指定', desc: '1回で生成したいUUIDの個数（1個〜最大100個）を設定します。' },
        { step: 2, title: 'フォーマットの調整', desc: '標準的なハイフン区切り（8-4-4-4-12）またはハイフンなしを選択します。' },
        { step: 3, title: '大文字・小文字の切替', desc: '利用環境に合わせて小文字または大文字を指定します。' },
        { step: 4, title: 'コピー・保存', desc: '一括でクリップボードにコピー、またはJSONファイルとして保存します。' }
      ]
    },
    example: {
      input: 'Quantity: 1, Format: Hyphenated, Case: Lowercase',
      output: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    },
    faq: {
      en: [
        { q: 'Can two UUID v4 values ever collide?', a: 'Mathematically, the probability of a UUID v4 collision is virtually zero. You would need to generate approximately 1 billion UUIDs per second for roughly 85 years before the probability of a single collision reaches 50%.' },
        { q: 'What do the version and variant bits represent?', a: 'In standard UUID v4, the 13th character is always "4" (representing version 4 random), and the 17th character begins with 8, 9, a, or b (indicating the RFC 4122 variant bits).' },
        { q: 'Is crypto.randomUUID() supported in all browsers?', a: 'Yes. Modern web browsers support the native crypto.randomUUID() API, delivering hardware-entropy backed random identifiers with sub-millisecond execution.' }
      ],
      ko: [
        { q: 'UUID v4가 우연히 서로 겹쳐 충돌(Collision)할 확률이 있나요?', a: '수학적으로 충돌 가능성은 실질적으로 0에 가깝습니다. 전 세계에서 매초 10억 개의 UUID를 85년 동안 계속해서 생성해야 비로소 단 1회의 충돌 확률이 50%에 달할 정도로 안전합니다.' },
        { q: 'UUID 문자열에서 버전 4임을 어떻게 알 수 있나요?', a: '표준 UUID v4는 3번째 그룹의 첫 번째 문자가 항상 숫자 4(xxxx-xxxx-4xxx-...)로 고정되며, 4번째 그룹의 첫 글자는 8, 9, a, b 중 하나로 시작합니다.' },
        { q: '브라우저 네이티브 API로 생성되나요?', a: '네, 최신 브라우저에 내장된 crypto.randomUUID() 표준 엔진을 사용하여 외부 라이브러리 없이 가장 안전하고 빠른 암호학적 난수를 도출합니다.' }
      ],
      ja: [
        { q: 'UUID v4が重複（衝突）する可能性はありますか？', a: '天文学的に極めて低く、実質的にゼロとみなせます。毎秒10億個のUUIDを85年間生成し続けてようやく50%の確率で1回衝突する規模です。' },
        { q: 'UUIDのバージョン4であることはどう見分けられますか？', a: '3つ目のハイフンブロックの先頭文字が必ず「4」（例: xxxxxxxx-xxxx-4xxx-...）となっているのがv4の特徴です。' },
        { q: 'ブラウザの標準機能で生成されていますか？', a: 'はい。現代の主要ブラウザに組み込まれている「crypto.randomUUID()」エンジンにより高速かつ安全に生成されます。' }
      ]
    },
    notes: {
      en: [
        'Strictly complies with IETF RFC 4122 UUID Version 4 specification.',
        'Runs completely offline on client-side memory with zero external logging.'
      ],
      ko: [
        'IETF RFC 4122 국제 표준 규격을 100% 준수하여 생성됩니다.',
        '모든 식별자는 브라우저 로컬에서만 생성되며 서버나 외부 데이터베이스에 일체 기록되지 않습니다.'
      ],
      ja: [
        'IETF RFC 4122規格に厳格に準拠したフォーマットで出力されます。',
        'すべてのIDはブラウザ内でローカル生成され、外部への通信記録は一切残りません。'
      ]
    },
    relatedTools: [
      { id: 'hash-generator', name: 'Hash Generator', desc: { en: 'Generate cryptographic hash fingerprints from UUIDs.', ko: '생성한 UUID를 암호화 해시로 변환하여 체크섬을 만듭니다.', ja: '生成したUUIDを暗号ハッシュ化してチェックサムを作成します。' }, icon: 'Hash' },
      { id: 'password-generator', name: 'Password Generator', desc: { en: 'Generate high-entropy random credentials.', ko: 'UUID와 더불어 인증에 필요한 복합 패스워드를 생성합니다.', ja: '認証に必要な高セキュリティなパスワードを生成します。' }, icon: 'Lock' },
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Inspect UUID-formatted "sub" and "jti" claims inside tokens.', ko: '토큰 내부에 포함된 UUID 형식의 사용자 ID(sub) 및 고유 식별자(jti)를 확인합니다.', ja: 'JWTトークン内のUUID形式のsubクレームやjtiを確認します。' }, icon: 'Shield' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare UUID lists and detect missing or duplicate keys.', ko: '데이터베이스 덤프 간 UUID 목록의 누락이나 차이점을 대조합니다.', ja: 'UUIDのリスト同士を比較して差分を検証します。' }, icon: 'Braces' }
    ]
  }
];
