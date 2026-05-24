import json

with open("src/lib/i18n.ts", "r") as f:
    i18n_content = f.read()

locales = {
  "en": {
    "jsonTs.seo.title": "Why TypeScript Interfaces Matter for Modern Web Development",
    "jsonTs.seo.p1": "When constructing robust, scalable web applications, the integrity of your data objects is paramount. A common point of failure occurs at the boundary between the client application and external REST or GraphQL APIs. APIs traditionally return dynamically typed JSON payloads, which lack inherent structural guarantees when parsed in JavaScript. By explicitly mapping these dynamic JSON payloads into strictly typed TypeScript interfaces, developers can significantly reduce runtime errors, improve editor autocompletion (IntelliSense), and guarantee contract stability across the engineering team.",
    "jsonTs.seo.h2": "Designing Stable API Types",
    "jsonTs.seo.p2": "Manually writing TypeScript interfaces for complex, deeply nested JSON responses is a tedious and error-prone process. It requires painstakingly inspecting the JSON tree and manually typing out nested object arrays. Our JSON to TS Converter automates this workflow entirely. By utilizing a recursive parsing algorithm mapping over key-value structures, this tool instantly breaks down complex entity relationships—extracting nested objects into distinct, perfectly named child interfaces. This ensures your TypeScript declarations remain DRY (Don't Repeat Yourself) and highly maintainable. For example, a single massive 'User' profile JSON containing embedded 'Address' and 'Preferences' objects will be neatly separated into `interface User`, `interface Address`, and `interface Preferences`.",
    "jsonTs.seo.h3": "Zero Data Storage: Client-Side Security Guarantee",
    "jsonTs.seo.p3": "Security and Privacy are the core tenets of DevToolz. Often, the JSON payloads you need to type-check contain highly sensitive, proprietary business logic, or personally identifiable user data (PII). Transmitting this data over the network to external third-party servers for simple text manipulation poses a severe security risk. This utility performs the entire lexing and type generation process using the computational power of your local browser JavaScript engine. Absolutely zero data is uploaded, intercepted, or logged, meaning your proprietary API shapes remain strictly confidential.",

    "token.seo.title": "Understanding LLM Tokenization and Cost Estimation",
    "token.seo.p1": "In the era of Large Language Models (LLMs), understanding how text is processed is crucial for building cost-effective and performant AI applications. Models like OpenAI's GPT-4o, Anthropic's Claude, and Google's Gemini do not process text character-by-character or word-by-word. Instead, they break strings down into smaller contextual chunks called Tokens. A token can be a single character, a fragment of a word (like \"sub\" or \"ing\"), or an entire word.",
    "token.seo.h2": "Why Token Counting Matters for AI Engineering",
    "token.seo.p2": "Accurate token calculation serves two primary purposes in production environments: Context Window Limits and Financial Forecasting. Every LLM has a hard limit on the maximum number of tokens it can accept in a single request (the context window). Exceeding this limit will result in API rejections. Furthermore, API providers bill strictly based on the volume of tokens ingested (Input Tokens) and generated (Output Tokens). A prompt that seems short in words might unexpectedly contain a high number of tokens if it includes dense code, non-English characters, or complex structural formatting like deeply nested JSON.",
    "token.seo.h3": "Client-Side Evaluation Guarantee",
    "token.seo.p3": "System prompts often contain proprietary business logic, few-shot examples comprising sensitive user data, or secure operational blueprints. Using third-party token counting services that require a network request is a severe security risk. The DevToolz Token Counter utilizes standard exact-match Byte Pair Encoding (BPE) algorithms executing 100% locally within your browser tab. Your proprietary payloads are never transmitted to an external server. You get real-time, instantaneous feedback while maintaining absolute confidentiality.",

    "pass.seo.title": "The Cryptography Behind Secure Password Generators",
    "pass.seo.p1": "In an era defined by massive credential stuffing attacks and automated brute-force breaches, relying on human-generated passwords or predictably altered dictionary words is a critical security vulnerability. A robust password strategy demands cryptographically secure, high-entropy secrets that lack any discernible pattern.",
    "pass.seo.h2": "Why Math.random() is Dangerous",
    "pass.seo.p2": "Many basic utilities use JavaScript's built-in Math.random() function to generate passwords. This is a fatal flaw for applications intended to secure financial networks or administrative system access. Math.random() is a Pseudo-Random Number Generator (PRNG); its outputs are computationally predictable if the internal seed state is discovered. DevToolz exclusively utilizes the Web Crypto API (specifically window.crypto.getRandomValues) to extract entropy directly from the underlying operating system's cryptographic hardware, ensuring your generated passwords are truly unpredictable.",
    "pass.seo.h3": "Zero Data Transmission Guarantee",
    "pass.seo.p3": "When evaluating a password generation service, the primary concern must be: \"Who else knows this password?\" If a web application sends an API request to a remote server to generate your password, that secret exists in network traffic logs, server RAM, and potentially database records. DevToolz fundamentally eliminates this attack vector through absolute client-side processing. The mathematics used to generate your secure passwords, passphrases, and QR codes execute 100% locally within your browser sandbox. We do not know your password, we never transmit your password, and your data never touches our network.",
    "pass.seo.h4": "Passphrase vs. Random Characters",
    "pass.seo.p4": "This tool supports two distinct cryptographic paradigms depending on your use case: Random Generated Strings (Best for API keys, providing maximum entropy) and XKCD-Style Passphrases (Combinations of random dictionary words, maintaining extremely high mathematical entropy while remaining cognitively digestible for humans).",

    "regex.seo.title": "Mastering Regular Expressions for Data Validation",
    "regex.seo.p1": "Regular Expressions (Regex or RegExp) form the backbone of string searching algorithms and input validation across virtually all modern programming languages. From verifying email addresses during user registration to parsing complex server log files for error tracing, a solid grasp of regex syntax is indispensable for software engineers. However, crafting the precise pattern to capture your intended substring—without inadvertently causing catastrophic backtracking or missing edge cases—can be notoriously difficult.",
    "regex.seo.h2": "Client-Side Evaluation vs. Server-Side Processing",
    "regex.seo.p2": "When you run regex patterns against sensitive data strings—such as lists of passwords, proprietary API keys, or personally identifiable information (PII)—the execution environment matters immensely. DevToolz enforces a strict client-side-only execution model. Using this Regex Tester, your pattern and test string are evaluated synchronously in your local browser sandbox utilizing the built-in JavaScript RegExp object. Unlike traditional diagnostic utilities that post your payloads to a remote backend processor, our architecture mathematically guarantees zero data leakage. Nothing leaves your device.",
    "regex.seo.h3": "Understanding Common Flags",
    "regex.seo.p3": "The behavior of a Regular Expression can be drastically altered by its execution flags: g (Global) instructs the engine to traverse the entire string; i (Case-insensitive) treats \"A\" and \"a\" identically; m (Multiline) modifies the behavior of the start and end anchors to match individual lines within a multi-line string block.",
    "regex.seo.p4": "By utilizing the preset dropdown menu in this utility, you can instantly load industry-standard, robust patterns for validating Email addresses, URLs, IPv4/IPv6 structures, and Passwords. This sandbox provides immediate visual confirmation of your logic."
  },
  "ko": {
    "jsonTs.seo.title": "현대 웹 개발에서 TypeScript 인터페이스의 중요성",
    "jsonTs.seo.p1": "견고하고 확장 가능한 웹 애플리케이션을 구축할 때 데이터 객체의 무결성은 무엇보다 중요합니다. 외부 REST 또는 GraphQL API와 클라이언트 애플리케이션 간의 경계는 심각한 오류가 발생하기 쉬운 지점입니다. API는 기본적으로 동적 타입인 JSON 페이로드를 반환하며, 이는 JavaScript로 파싱될 때 구조적인 안정성을 전혀 보장하지 못합니다. 이러한 동적 JSON 페이로드를 엄격하게 타입이 지정된 TypeScript 인터페이스로 명시적으로 매핑함으로써 개발자는 런타임 오류를 크게 줄이고, 편집기 자동 완성(IntelliSense)을 개선하며, 엔지니어링 팀 전체의 컨트랙트 안정성을 보장할 수 있습니다.",
    "jsonTs.seo.h2": "안정적인 API 타입 설계",
    "jsonTs.seo.p2": "깊게 중첩된 복잡한 JSON 응답에 대하여 수동으로 TypeScript 인터페이스를 작성하는 것은 지루하고 오류가 발생하기 쉬운 작업입니다. JSON 트리를 검사하고 중첩된 배열과 객체를 일일이 타이핑해야 합니다. 당사의 JSON to TS 변환기는 이 워크플로를 완전히 자동화합니다. 재귀적 파싱 알고리즘을 활용하여 복잡한 엔티티 관계를 즉시 분해하고, 중첩된 객체를 완벽한 이름의 자식 인터페이스로 추출하여 TypeScript 선언을 DRY(Don't Repeat Yourself)하고 유지보수하기 쉽게 유지해 줍니다.",
    "jsonTs.seo.h3": "제로 데이터 전송: 클라이언트 안전 보장",
    "jsonTs.seo.p3": "보안과 개인정보 보호는 DevToolz의 핵심 원칙입니다. 종종 타입 검사가 필요한 JSON 페이로드에는 매우 민감한 내부 비즈니스 로직이나 개인 식별 정보(PII)가 포함됩니다. 단순히 텍스트 변환을 위해 이러한 데이터를 네트워크를 통해 원격 제3자 서버로 전송하는 것은 심각한 보안 위험을 초래합니다. 본 도구는 오로지 귀하의 로컬 브라우저 엔진의 연산 능력을 사용하여 프로세스를 실행합니다. 단 하나의 데이터도 저장되거나, 전송되거나 기록되지 않아 API 페이로드 기밀이 완벽히 유지됩니다.",

    "token.seo.title": "LLM 토큰화 및 비용 추정의 이해",
    "token.seo.p1": "LLM(대규모 언어 모델) 시대에서 텍스트가 처리되는 방식을 이해하는 것은 가격 효율적이고 뛰어난 성능의 AI 애플리케이션을 구축하는 데 필수적입니다. OpenAI의 GPT-4o, Anthropic의 Claude, Google의 Gemini와 같은 모델들은 텍스트를 문자나 단어 단위로 처리하지 않고 '토큰(Token)'이라고 하는 더 작은 맥락의 덩어리로 분해합니다. 토큰은 단일 문자일 수도 있고, \"sub\"나 \"ing\" 같은 단어의 일부일 수도, 전체 단어일 수도 있습니다.",
    "token.seo.h2": "AI 엔지니어링에서 토큰 카운팅의 중요성",
    "token.seo.p2": "정확한 토큰 계산은 프로덕션 환경에서 모델의 문맥 제한(Context Window) 방지 및 재무적 비용 예측이라는 두 가지 주요 목적을 가집니다. 모든 LLM은 단일 요청당 허용되는 하드 리미트 토큰 수가 정해져 있으며, 이를 초과 시 API 거부가 발생합니다. 또한 API 공급사는 입력 및 생성된 텍스트 크기에 따라 엄격하게 과금합니다.",
    "token.seo.h3": "로컬 클라이언트 환경 처리 보장",
    "token.seo.p3": "시스템 프롬프트에는 독점적인 비즈니스 로직이나 민감한 사용자 데이터를 포함한 few-shot 예시가 포함되는 경우가 많습니다. 네트워크 요청을 요구하는 타사 API 기반 토큰 계산 서비스를 이용하는 것은 심각한 보안 리스크를 의미합니다. DevToolz Token Counter는 귀하의 로컬 브라우저 내부에서만 100% 실행되는 표준 BPE(Byte Pair Encoding) 알고리즘을 채택합니다. 단일 프롬프트 정보도 원격 서버로 전송되지 않으므로, 완벽한 기밀성을 유지하면서 실시간 계산 결과를 확인할 수 있습니다.",

    "pass.seo.title": "안전한 비밀번호 생성기의 암호학적 원리",
    "pass.seo.p1": "광범위한 크리덴셜 스터핑(Credential Stuffing) 및 자동화된 무차별 대입 공격이 이루어지는 시대에서 인간이 예측 가능한 비밀번호나 단순 변형 단어에 의존하는 것은 심각한 보안 취약점입니다. 강력한 암호 전략을 위해서는 식별 가능한 패턴이 전혀 존재하지 않는 암호학적으로 안전한 고엔트로피(High-entropy) 비밀이 필수적입니다.",
    "pass.seo.h2": "Math.random() 함수 사용의 위험성",
    "pass.seo.p2": "수많은 기본 도구들은 자체 비밀번호 생성에 Javascript의 기본 Math.random() 함수를 사용하는데, 이는 심각한 결함입니다. Math.random()은 의사 난수 생성기(PRNG)로서 특정 내부 시드 상태를 알면 수학적으로 결과값을 예측할 수 있습니다. DevToolz는 운영 체제의 암호학적 하드웨어 기기에서 무작위성(Entropy)을 직접 추출하는 Web Crypto API(window.crypto.getRandomValues)만을 철저하게 사용하여 예측 불가능성을 보장합니다.",
    "pass.seo.h3": "제로 데이터 전송 보안 보장",
    "pass.seo.p3": "비밀번호 생성 서비스를 평가할 때 \"나 외에 비밀번호를 아는 존재가 있는가?\"가 가장 중요합니다. 웹 애플리케이션이 비밀번호 생성을 위해 원격 서버로 요청을 보내는 순간 네트워크 트래픽이나 서버 메모리에 흔적이 남습니다. DevToolz는 브라우저 내부 샌드박스에서 수학적 연산을 100% 로컬 연산하여 이 문제 공격 벡터를 근본적으로 차단합니다.",
    "pass.seo.h4": "패스프레이즈 (Passphrase) 대 무작위 문자열",
    "pass.seo.p4": "이 도구는 유스케이스에 맞춰 극도의 수학적 엔트로피(Entropy)를 보장하는 무작위 생성 문자열을 지원할 뿐만 아니라, 개발자가 수동으로 외워야 하는 상황을 고려하여 무작위 사전 조합 단어를 사용하여 인지적 기억에 용이하게 만든 XKCD 방식의 패스프레이즈 역시 지원합니다.",

    "regex.seo.title": "데이터 검증을 위한 정규 표현식 마스터하기",
    "regex.seo.p1": "정규 표현식(RegExp 또는 Regex)은 현대의 모든 프로그래밍 언어에서 텍스트 수색 알고리즘과 입력값 검증의 근간을 이룹니다. 이메일 주소의 유효성 검사에서 복잡한 서버 로그에서 오류 원인을 찾아내는 파싱 과정에 이르기까지, 정규식 구문에 대한 탄탄한 이해는 개발자들에게 없어서는 안 될 요소입니다.",
    "regex.seo.h2": "클라이언트 측(Client-Side) 평가 대 서버 데이터 프로세싱",
    "regex.seo.p2": "비밀번호 목록이나 사내용 API 키, PII(개인 식별 정보)와 같은 대용량 민감 데이터 문자열에 대해 정규식 테스트를 수행할 때 컴퓨팅을 처리하는 환경의 위치는 치명적으로 중요합니다. 일반적인 백엔드 서버에서 실행하는 외부 정규식 진단 툴들과 다르게, 본 Regex Tester는 브라우저의 기본 자바스크립트 RegExp 객체를 통해 고객님의 브라우저 샌드박스 내부에서 안전히 비동기적으로 평가됩니다.",
    "regex.seo.h3": "정규식 주요 플래그 이해하기",
    "regex.seo.p3": "정규 표현식의 논리 연산은 실행 플래그를 통해 크게 달라집니다. g(글로벌)은 엔진에 문자열 전체를 순회하도록 지시하며, i(대소문자 무시)는 A와 a를 동일하게 처리하게 됩니다. m(다중 라인)은 ^ / $ 의 고정과 관련하여 여러 라인 내부 블록의 로직을 일치하게 합니다.",
    "regex.seo.p4": "이 도구에서 제공되는 프리셋(Preset) 드롭다운 메뉴를 통해 이메일 주소, IPv4 / IPv6, 강력 기능 비밀번호 등을 정확하게 검증할 수 있는 업계 표준 알고리즘 패턴을 즉시 로드하고 시각적으로 확인할 수 있습니다."
  },
  "ja": {
    "jsonTs.seo.title": "現代のウェブ開発においてTypeScriptインターフェースが重要な理由",
    "jsonTs.seo.p1": "堅牢でスケーラブルなWebアプリケーションを構築する場合、データオブジェクトの整合性が最も重要です。一般的なエラーは、クライアント・アプリケーションと外部APIとの境界で発生します。APIは動的に型付けされたJSONペイロードを返しますが、TypeScriptインターフェースに明示的にマッピングすることで、ランタイムエラーを大幅に減らし、チーム間の安定性を保証します。",
    "jsonTs.seo.h2": "安定したAPI型の設計",
    "jsonTs.seo.p2": "複雑にネストされたJSONから手動でTypeScript型を作成することは、エラーのリスクが高まります。当社のJSON to TSコンバーターは、再帰的パース処理を活用してネストされたオブジェクトを展開し、TypeScript宣言をすぐに使えるDRYな形で提供します。",
    "jsonTs.seo.h3": "ゼロ・データ送信：ローカルセキュリティの保証",
    "jsonTs.seo.p3": "APIペイロードには機密性の高いプロプライエタリなビジネスロジックや個人情報（PII）が含まれている場合があります。ネットワークを介してサードパーティサーバーに送信するのは危険です。このツールはブラウザのローカル演算能力を使用し、データは一切外部のバックエンドに送信されません。",

    "token.seo.title": "LLMトークン化とコスト予測の理解",
    "token.seo.p1": "大規模言語モデル（LLM）の時代において、テキストがどのように処理されるかを理解することは不可欠です。GPT-4o、Claude、GeminiなどのAIモデルは、文字単位や単語単位で処理するのではなく、「トークン」として分割します。",
    "token.seo.h2": "トークンカウントが重要な理由",
    "token.seo.p2": "本番環境では「コンテキスト長のリミット超過」と「金融コストの予測」のためにトークンの計算が不可欠です。すべてのLLMにはトークンの入力制限があり、さらに入力トークンと出力トークンに基づいてAPI課金が発生するためです。",
    "token.seo.h3": "クライアントサイド評価の絶対的な保証",
    "token.seo.p3": "プロンプト（指示文）には自社のコードやユーザーの機密情報が含まれることがよくあります。サードパーティの計算機にリクエストを送信するのはセキュリティ上のリスクです。DevToolzのトークンカウンターは、ローカル環境で100%動作するBPE (Byte Pair Encoding) アルゴリズムを利用するため、データ通信は発生しません。",

    "pass.seo.title": "安全なパスワード生成ツールの暗号学的原理",
    "pass.seo.p1": "クレデンシャルスタッフィング攻撃が日常的に発生する現代で、人間が作成したパスワードや辞書の単語の組み合わせに頼るのは深刻なセキュリティの脆弱性です。",
    "pass.seo.h2": "Math.random()の危険性",
    "pass.seo.p2": "一般的なパスワード生成機はJavaScriptの組み込みの Math.random() 関数を利用しますが、これはシードから結果を予測できる疑似乱数（PRNG）であるため危険です。当ツールはネイティブの Web Crypto API を活用し、真のハードウェアエントロピーから暗号学的に安全かつ予測不可能な文字列を生成します。",
    "pass.seo.h3": "ゼロ・データ転送による情報漏洩防止",
    "pass.seo.p3": "生成を外部APIに依存すればログに記録される可能性がありますが、当ツールはクライアントデバイスの中で完全にローカル完結するため、あなた以外にパスワードを知る者は存在しません。",
    "pass.seo.h4": "パスフレーズとランダム文字列の使い分け",
    "pass.seo.p4": "APIキーなど記憶が不要なものに対しては高いエントロピーを提供するランダム文字を、人間が記憶する必要があるマスタパスワードに対しては、高いセキュリティを保ちながら人間が覚えやすいXKCDスタイルの辞書単語パスフレーズをサポートしています。",

    "regex.seo.title": "データ検証のための正規表現マスター",
    "regex.seo.p1": "正規表現（RegExpまたはRegex）は、事実上すべての最新のプログラミング言語におけるアルゴリズムと入力検証の基盤です。",
    "regex.seo.h2": "クライアントサイド評価とサーバーサイド処理の違い",
    "regex.seo.p2": "パスワードリストや社内のAPIキー、PII（個人を特定できる情報）などの機密性の高い大容量データに対して正規表現テストを実行する場合、計算環境の場所が極めて重要になります。DevToolzは厳格なクライアント側のみの実行モデルを強制し、データ漏洩が数学的にゼロであることを保証します。",
    "regex.seo.h3": "一般的な正規表現フラグの理解",
    "regex.seo.p3": "g (Global) は全体を巡回し、i (大文字小文字を区別しない) は \"A\" と \"a\" を同じものとして評価します。m (Multiline) は複数行ブロックの行単位で動作するように設定します。",
    "regex.seo.p4": "このツールで提供されるプリセット（Preset）を活用することで、電子メールアドレスやIPv4 / IPv6の構造などを正確に検証する堅牢なパターンを即座に視覚的にテストできます。"
  }
}

import re

for lang, data in locales.items():
    for key, val in data.items():
        escaped_val = json.dumps(val)
        insert_string = f'      "{key}": {escaped_val},\n'
        
        # We append directly to i18n_content before "about.title":
        # we have 3 blocks (en, ko, ja) and we match the corresponding one based on lang and "about.title"
        if lang == "en":
            i18n_content = re.sub(r'("en":\s*\{\s*translation:\s*\{[\s\S]*?)(\s*"about\.title":)', r'\g<1>' + insert_string + r'\g<2>', i18n_content, count=1)
        elif lang == "ko":
            i18n_content = re.sub(r'("ko":\s*\{\s*translation:\s*\{[\s\S]*?)(\s*"about\.title":)', r'\g<1>' + insert_string + r'\g<2>', i18n_content, count=1)
        elif lang == "ja":
            i18n_content = re.sub(r'("ja":\s*\{\s*translation:\s*\{[\s\S]*?)(\s*"about\.title":)', r'\g<1>' + insert_string + r'\g<2>', i18n_content, count=1)

with open("src/lib/i18n.ts", "w") as f:
    f.write(i18n_content)

print("Patch applied to i18n.ts successfully")
