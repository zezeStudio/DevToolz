import { ToolContentData } from './types';

export const utilityTools: ToolContentData[] = [
  {
    id: 'diff-checker',
    meta: {
      title: {
        en: 'Diff Checker - Compare Text, Code & JSON Differences Online',
        ko: 'Diff 체커 - 텍스트 및 코드 차이점 비교 도구',
        ja: 'Diffチェッカー - テキスト・コードの差分比較ツール'
      },
      description: {
        en: 'Compare two text files, code snippets, or JSON documents side-by-side or in unified inline view. Highlights added, removed, and modified lines with precision.',
        ko: '두 개의 텍스트나 소스 코드, 환경설정 파일의 차이점을 나란히(Side-by-side) 또는 한 줄(Inline)로 시각화하여 변경 내역을 빠르고 정밀하게 검출합니다.',
        ja: '2つのテキスト、コード、JSON設定ファイルの差分を並列表示（Side-by-Side）またはインライン表示で視覚的に比較・検出します。'
      }
    },
    overview: {
      en: 'Identifying exact discrepancies between configuration files, API payloads, or code snippets is a daily task in software development. Manual line-by-line reading is slow and easily overlooks subtle changes like trailing commas or whitespace. This Diff Checker uses the Myers diff algorithm to highlight precise additions, deletions, and inline modifications in real time.',
      ko: '서로 다른 두 버전의 설정 파일(config), API 응답 페이로드, 또는 코드 조각의 차이점을 눈으로 일일이 대조하는 것은 매우 피로하고 쉼표나 공백 하나의 차이를 놓치기 쉽습니다. 본 Diff 체커는 Myers 차이 비교 알고리즘을 기반으로 추가된 줄(초록), 삭제된 줄(빨강), 변경된 내부 단어를 실시간으로 정밀하게 하이라이트합니다.',
      ja: '異なるバージョンの設定ファイルやAPIレスポンス、ソースコードの差異を目視で確認するのは時間がかかり見落としの原因になります。本ツールはMyers差分アルゴリズムを用いて、追加・削除・変更箇所を行単位および文字単位でリアルタイムに強調表示します。'
    },
    whenToUse: {
      en: [
        { title: 'Environment Config Comparison', desc: 'Detect missing keys or differing values between .env.development and .env.production.' },
        { title: 'API Response Regression Testing', desc: 'Paste before-and-after API response JSON payloads to verify backward compatibility.' },
        { title: 'Git Merge Conflict Pre-check', desc: 'Inspect conflicting file chunks side-by-side to understand divergence before committing.' },
        { title: 'Contract & Document Review', desc: 'Compare two versions of legal terms, markdown READMEs, or documentation drafts.' }
      ],
      ko: [
        { title: '환경설정(.env) 차이 비교', desc: '개발 환경(.env.dev)과 운영 환경(.env.prod) 간에 누락된 환경변수나 설정값 차이를 검출합니다.' },
        { title: 'API 응답 회귀 테스트', desc: '신규 배포 전후의 API JSON 페이로드를 좌우에 붙여넣어 예기치 않게 깨진 필드가 없는지 검증합니다.' },
        { title: 'Git 충돌(Conflict) 사전 확인', desc: '머지 과정에서 충돌이 난 두 브랜치의 코드 조각을 시각적으로 대조하여 안전하게 정리합니다.' },
        { title: '문서 및 약관 개정 대조', desc: '개정된 이용약관, 마크다운 README.md 문서에서 실제로 추가되거나 수정된 문장을 정확히 찾아냅니다.' }
      ],
      ja: [
        { title: '環境変数（.env）の差分比較', desc: '開発環境と本番環境の設定ファイル間で、欠落しているキーや設定値の違いを検出します。' },
        { title: 'APIレスポンスの互換性検証', desc: 'リリース前後のAPIレスポンスJSONを左右で突き合わせ、想定外の破壊的変更がないか確認します。' },
        { title: 'Gitコンフリクトの事前確認', desc: '競合が発生したコードの変更点を左右比較で視覚的に把握し、安全なマージを支援します。' },
        { title: '利用規約やREADMEの改訂比較', desc: '更新されたドキュメントや規約文で、具体的に変更・加筆された部分を正確に特定します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Input Original Text', desc: 'Paste your original (base) text or code into the left editor.' },
        { step: 2, title: 'Input Modified Text', desc: 'Paste your updated (new) text or code into the right editor.' },
        { step: 3, title: 'Choose View Mode', desc: 'Switch between "Split (Side-by-Side)" view or "Unified (Inline)" view.' },
        { step: 4, title: 'Inspect Differences', desc: 'Review highlighted insertions (green) and deletions (red) with line numbers.' }
      ],
      ko: [
        { step: 1, title: '원본 텍스트 입력', desc: '비교 기준이 되는 원래의 텍스트나 소스 코드를 왼쪽 창에 붙여넣습니다.' },
        { step: 2, title: '수정본 텍스트 입력', desc: '변경 사항이 반영된 새로운 텍스트나 코드를 오른쪽 창에 붙여넣습니다.' },
        { step: 3, title: '비교 뷰 모드 선택', desc: '좌우 나란히 비교(Split) 또는 한 줄 통합 뷰(Unified) 중 원하는 모드를 선택합니다.' },
        { step: 4, title: '차이점 분석', desc: '추가된 라인(녹색)과 제거된 라인(적색) 및 변경된 글자 위치를 한눈에 파악합니다.' }
      ],
      ja: [
        { step: 1, title: '元のテキストを入力', desc: '比較の基準となる元の文章やコードを左側の入力欄に入力します。' },
        { step: 2, title: '変更後テキストを入力', desc: '更新された新しい文章やコードを右側の入力欄に入力します。' },
        { step: 3, title: '表示形式の選択', desc: '左右並列（Split）表示または統合インライン（Unified）表示を切り替えます。' },
        { step: 4, title: '差分の確認', desc: '追加行（緑）と削除行（赤）がハイライトされ、変更箇所を迅速に把握できます。' }
      ]
    },
    example: {
      input: 'Original:\nconst port = 3000;\nconsole.log("Starting server");\n\nModified:\nconst port = 8080;\nconsole.log("Starting production server");\napp.listen(port);',
      output: '- const port = 3000;\n+ const port = 8080;\n- console.log("Starting server");\n+ console.log("Starting production server");\n+ app.listen(port);'
    },
    faq: {
      en: [
        { q: 'Can it compare whitespace and indentation changes?', a: 'Yes. The diff engine meticulously detects leading tabs, spaces, and line break discrepancies.' },
        { q: 'Can it compare large files?', a: 'Files up to thousands of lines are diffed instantaneously in browser memory. Extremely huge files with millions of characters might require a moment for calculation.' },
        { q: 'Is my proprietary code kept private?', a: 'Yes. All diff computations are executed purely client-side using JavaScript. Your confidential source code is never sent to any remote server.' }
      ],
      ko: [
        { q: '공백(스페이스)이나 들여쓰기 차이도 잡아내나요?', a: '네, 탭과 스페이스 차이 및 줄바꿈 변경점까지 정확하게 감지하여 표시합니다.' },
        { q: '수천 줄 이상의 대용량 코드도 비교 가능한가요?', a: '수천 라인 단위의 텍스트도 브라우저 메모리 안에서 1초 미만으로 고속 비교됩니다.' },
        { q: '비교한 소스 코드가 외부로 유출되지 않나요?', a: '완벽한 100% 브라우저 로컬 연산으로 동작하므로, 사내 기밀 소스 코드나 개인정보를 대조해도 서버로 데이터가 나가지 않습니다.' }
      ],
      ja: [
        { q: '空白やインデントの差異も検出できますか？', a: 'はい。スペースやタブ、改行コードの細かな違いも正確に検知して差分として表示します。' },
        { q: '数千行を超えるコードでも比較可能ですか？', a: 'ブラウザメモリ内で高速演算を行うため、数千行規模のテキストでも瞬時に比較完了します。' },
        { q: '入力した機密コードが外部に送信されませんか？', a: '完全なクライアントサイド実行のため、社内の機密コードや設定ファイルも安全に比較できます。' }
      ]
    },
    notes: {
      en: [
        'Implements the standard Myers diff algorithm, the same mathematical engine used by Git diff.',
        'Runs completely offline in the browser sandbox for total security.'
      ],
      ko: [
        'Git diff의 핵심 기반인 검증된 Myers diff 알고리즘을 사용하여 정확하고 직관적인 차이점을 도출합니다.',
        '완전한 브라우저 오프라인 구동으로 민감한 프로덕션 소스코드도 안심하고 비교할 수 있습니다.'
      ],
      ja: [
        'Git diffでも採用されているMyers差分アルゴリズムにより、最も自然で正確な比較結果を提供します。',
        '完全なオフライン処理により、本番環境のソースコードも漏洩の心配なく安全に検証できます。'
      ]
    },
    relatedTools: [
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Format and indent JSON files before running diff comparisons.', ko: 'diff 비교 전 두 JSON의 들여쓰기를 일정하게 정렬하여 가짜 차이를 없앱니다.', ja: '差分比較の前にJSONのインデントを統一して不要な差分を排除します。' }, icon: 'FileJson' },
      { id: 'text-analyzer', name: 'Text Analyzer', desc: { en: 'Analyze character count, word density, and statistics of compared texts.', ko: '비교한 텍스트의 글자 수, 단어 수, 줄 바꿈 통계를 분석합니다.', ja: '比較した文章の文字数や単語数、行数統計を詳細に分析します。' }, icon: 'FileText' },
      { id: 'markdown-editor', name: 'Markdown Editor', desc: { en: 'Edit and preview formatted markdown documents after diff checks.', ko: '차이점을 수정한 마크다운 문서를 실시간 미리보기로 확인합니다.', ja: '差分を修正したMarkdownファイルをリアルタイムプレビューします。' }, icon: 'Edit3' },
      { id: 'regex-tester', name: 'Regex Tester', desc: { en: 'Test regex replace patterns to refactor code differences.', ko: '코드 차이점을 일괄 수정하기 위한 정규식 치환 패턴을 테스트합니다.', ja: 'コード差分の一括置換を行うための正規表現を検証します。' }, icon: 'Code' }
    ]
  },
  {
    id: 'regex-tester',
    meta: {
      title: {
        en: 'Regex Tester - Regular Expression Tester & Debugger',
        ko: '정규식 테스터 - 정규표현식 실시간 테스트 및 캡처 그룹 디버거',
        ja: '正規表現テスター - リアルタイムRegex検証・キャプチャ確認ツール'
      },
      description: {
        en: 'Test and debug regular expressions with real-time match highlighting, capture group extraction, and flag toggles (g, i, m, s). Includes a cheat sheet for common regex patterns.',
        ko: '정규표현식(Regex)을 실시간으로 테스트하고 매칭된 텍스트와 캡처 그룹을 즉시 시각화합니다. 이메일, 전화번호 등 자주 쓰는 정규식 치트시트 제공.',
        ja: '正規表現のリアルタイムマッチング検証、キャプチャグループの展開、フラグ切替（g, i, m, s）をサポート。よく使う正規表現のチートシート付き。'
      }
    },
    overview: {
      en: 'Regular expressions are an indispensable tool for text validation, scraping, and string transformations. However, complex patterns involving lookaheads, lookbehinds, and nested capture groups can easily lead to greedy matching or catastrophic backtracking. This interactive tester evaluates your regular expression in real time as you type, highlighting all match occurrences and separating indexed capture groups.',
      ko: '정규표현식(Regex)은 텍스트 유효성 검사, 로그 추출, 문자열 치환 등에 필수적인 도구입니다. 하지만 전방/후방 탐색이나 중첩 캡처 그룹이 얽힌 복잡한 정규식은 탐욕적 매칭(Greedy)이나 예기치 않은 버그를 유발하기 쉽습니다. 본 정규식 테스터는 입력과 동시에 매칭된 영역을 색상별로 하이라이트하고, 캡처된 그룹을 개별 분리하여 직관적인 디버깅을 지원합니다.',
      ja: '正規表現はテキスト検証や文字列抽出に不可欠ですが、先読み・後読みや複雑なキャプチャが絡むと意図しないマッチングを引き起こしがちです。本ツールは入力と同時にマッチ箇所をリアルタイムに色分け表示し、グループごとの抽出結果を明快に確認できます。'
    },
    whenToUse: {
      en: [
        { title: 'Form Input Validation', desc: 'Craft bulletproof patterns for email addresses, international phone numbers, and strong passwords.' },
        { title: 'Server Log Extraction', desc: 'Extract IP addresses, HTTP status codes, and request URIs from Nginx or Apache access logs.' },
        { title: 'Data Cleaning & Scraping', desc: 'Extract HTML attributes, markdown links, or monetary values from unorganized raw text.' },
        { title: 'Capture Group Verification', desc: 'Verify that numbered ($1, $2) or named capture groups isolate the exact intended substrings.' }
      ],
      ko: [
        { title: '폼 입력값 유효성 검증', desc: '이메일, 한국 휴대폰 번호(010-xxxx-xxxx), 비밀번호 복잡도 검증용 정규식을 사전에 테스트합니다.' },
        { title: '서버 액세스 로그 추출', desc: 'Nginx, Apache 로그 파일에서 IP 주소, HTTP 응답 코드, 요청 경로를 정확히 파싱합니다.' },
        { title: '데이터 정제 및 크롤링', desc: '정리되지 않은 원문에서 특정 HTML 태그, 가격 정보, 날짜 문자열만 쏙 뽑아냅니다.' },
        { title: '캡처 그룹($1, $2) 검증', desc: '정규식 괄호 안에 담긴 하위 문자열이 의도한 변수에 올바르게 할당되는지 단계별로 확인합니다.' }
      ],
      ja: [
        { title: '入力フォームのバリデーション', desc: 'メールアドレスや郵便番号、電話番号の検証用パターンを事前にテスト・調整します。' },
        { title: 'アクセスログの解析', desc: 'NginxやApacheログからIPアドレス、HTTPステータス、リクエストパスを抽出します。' },
        { title: 'テキストデータの抽出・整形', desc: '大量の文章からURL、日付、金額などの特定フォーマットの文字列を抜き出します。' },
        { title: 'キャプチャグループの検証', desc: '括弧で囲んだグループが意図した通りに分割抽出されているかを視覚的に確認します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Enter Pattern', desc: 'Type your regular expression pattern in the regex bar (e.g., [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}).' },
        { step: 2, title: 'Set Flags', desc: 'Toggle flags: g (global), i (case-insensitive), m (multiline), and s (dotAll).' },
        { step: 3, title: 'Input Test String', desc: 'Paste sample text to test matches against.' },
        { step: 4, title: 'Inspect Matches', desc: 'View highlighted text spans, match count, and broken-down capture groups.' }
      ],
      ko: [
        { step: 1, title: '정규표현식 작성', desc: '상단 바에 테스트할 정규식 패턴(예: ^01[016789]-\\d{3,4}-\\d{4}$)을 입력합니다.' },
        { step: 2, title: '플래그(Flag) 설정', desc: '전체 검색(g), 대소문자 무시(i), 다중행(m), 개행포함(s) 등 필요한 플래그를 켭니다.' },
        { step: 3, title: '테스트 문자열 입력', desc: '아래 본문 창에 매칭을 검증할 예시 텍스트들을 여러 줄로 자유롭게 입력합니다.' },
        { step: 4, title: '매칭 및 그룹 분석', desc: '실시간으로 칠해지는 형광 하이라이트와 캡처 그룹 목록을 보며 패턴을 튜닝합니다.' }
      ],
      ja: [
        { step: 1, title: '正規表現パターンを入力', desc: '上部の入力欄に検証したいパターンを入力します。' },
        { step: 2, title: 'フラグの設定', desc: 'g（グローバル）、i（大小文字無視）、m（複数行）、s（dotAll）などのフラグを指定します。' },
        { step: 3, title: 'テスト文章を入力', desc: '下部のエディタに検証対象となるサンプルテキストを貼り付けます。' },
        { step: 4, title: '結果の確認', desc: 'マッチした文字列のハイライトと、抽出されたキャプチャグループの一覧を確認します。' }
      ]
    },
    example: {
      input: 'Pattern: (\\d{4})-(\\d{2})-(\\d{2})\nText: Project launched on 2026-09-04 successfully.',
      output: 'Full Match: "2026-09-04"\nGroup 1: "2026"\nGroup 2: "09"\nGroup 3: "04"'
    },
    faq: {
      en: [
        { q: 'Which regex dialect does this tool support?', a: 'It runs the ECMAScript (JavaScript) standard regex engine natively provided by modern web browsers, supporting modern features like Unicode property escapes and lookaround assertions.' },
        { q: 'What is Catastrophic Backtracking?', a: 'When nested quantifiers (e.g., (a+)+$) fail to match, the regex engine attempts an exponential number of permutations, freezing the execution. If a pattern takes too long, your browser sandbox protects against system crashes.' },
        { q: 'How can I replace matches?', a: 'You can test substitution patterns using standard replacement tokens like $1 and $2 to verify your output before implementing in code.' }
      ],
      ko: [
        { q: '어떤 정규식 엔진 규격을 따르나요?', a: '자바스크립트 표준(ECMAScript) 정규표현식 규격을 완벽하게 따르며, 전방탐색(?=), 후방탐색(?<=), 유니코드 속성 탈출문자(\\p{...}) 등 최신 스펙을 모두 지원합니다.' },
        { q: '지연시간(Catastrophic Backtracking) 현상이란 무엇인가요?', a: '중첩된 반복 수량자((a+)+ 등)가 포함된 정규식에서 불일치가 발생할 때 엔진이 지수 단위의 경우의 수를 되짚어가며 브라우저를 멈추게 만드는 현상입니다. 안전한 패턴 작성을 권장합니다.' },
        { q: '매칭된 결과를 치환(Replace)해 볼 수도 있나요?', a: '치환 문자열 탭을 통해 $1, $2 등의 그룹 참조자를 활용하여 원하는 문자열로 실시간 교체되는 모습을 미리 확인할 수 있습니다.' }
      ],
      ja: [
        { q: 'どの正規表現規格に対応していますか？', a: '最新のECMAScript（JavaScript）標準仕様に完全準拠しており、肯定/否定の先読み・後読みやUnicodeプロパティもサポートしています。' },
        { q: '破滅的なバックトラッキング（Catastrophic Backtracking）とは？', a: 'ネストされた量詞などにより、不一致時に指数関数的な組み合わせ探索が発生してブラウザがフリーズする現象です。効率的なパターンの構築をお勧めします。' },
        { q: '置換（Replace）結果のシミュレーションは可能ですか？', a: 'はい、$1や$2などのグループ参照を用いた置換結果をリアルタイムに確認できます。' }
      ]
    },
    notes: {
      en: [
        'Evaluated natively via the V8/SpiderMonkey JavaScript regex compiler for authentic runtime behavior.',
        'No data leaves your device; test patterns on proprietary logs with zero confidentiality risk.'
      ],
      ko: [
        '브라우저 네이티브 JavaScript V8 정규식 컴파일러를 통해 실제 서비스와 100% 동일한 실행 결과를 보장합니다.',
        '내부 로그나 개인정보가 담긴 텍스트를 붙여넣어도 브라우저 외부로 전송되지 않으므로 안전합니다.'
      ],
      ja: [
        'ブラウザ内蔵のJavaScript正規表現エンジンにより、実際のプロダクション環境と同一の挙動を検証できます。',
        '機密情報を含むテキストを検証しても外部送信は一切行われないため、安心してご利用いただけます。'
      ]
    },
    relatedTools: [
      { id: 'url-encoder', name: 'URL Encoder', desc: { en: 'Encode and decode URL parameters verified via regex.', ko: '정규식으로 검증한 URL 쿼리 파라미터를 % 인코딩합니다.', ja: '正規表現で抽出したURLパラメータをエンコードします。' }, icon: 'Link' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare text differences before and after regex replacements.', ko: '정규식 일괄 치환 전후의 텍스트 차이점을 대조합니다.', ja: '正規表現による置換前後のテキスト差分を検証します。' }, icon: 'Braces' },
      { id: 'text-analyzer', name: 'Text Analyzer', desc: { en: 'Analyze character count and statistics of matched text.', ko: '정규식으로 필터링한 텍스트의 글자 수와 빈도수를 분석합니다.', ja: 'マッチした文字列の文字数や出現頻度を詳細分析します。' }, icon: 'FileText' },
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Format JSON strings extracted via regex parsing.', ko: '정규식으로 로그에서 추출한 JSON 문자열을 보기 좋게 정렬합니다.', ja: '正規表現で抽出したJSON文字列を見やすくインデント整形します。' }, icon: 'FileJson' }
    ]
  },
  {
    id: 'unix-timestamp',
    meta: {
      title: {
        en: 'Unix Timestamp Converter - Epoch Seconds & Milliseconds to Date',
        ko: 'Unix 타임스탬프 변환기 - Epoch 초/밀리초 날짜 변환',
        ja: 'Unixタイムスタンプ変換ツール - エポック秒/ミリ秒を日時に相互変換'
      },
      description: {
        en: 'Convert Unix epoch timestamps (seconds and milliseconds) to human-readable UTC and local date-time strings, or convert calendar dates back to Unix timestamps in real time.',
        ko: '초 및 밀리초 단위의 Unix 타임스탬프(Epoch Time)를 현지 시각(KST) 및 표준시(UTC)로 상호 변환합니다. 백엔드 DB 시간 및 로그 타임스탬프 분석에 최적화되었습니다.',
        ja: 'エポック秒・ミリ秒とローカル日時（JST）・協定世界時（UTC）を相互変換。現在時刻のリアルタイム表示やログ解析に最適。'
      }
    },
    overview: {
      en: 'Unix time (POSIX or Epoch time) represents the number of seconds that have elapsed since midnight Coordinated Universal Time (UTC) on January 1, 1970 (not counting leap seconds). It is the ubiquitous standard for database timestamps, event logging, and caching expiration headers. This utility provides bidirectional conversion between raw integer timestamps and human-readable calendar dates across timezones.',
      ko: '유닉스 타임스탬프(Epoch Time)는 1970년 1월 1일 00:00:00 UTC(그리니치 표준시)를 기점으로 흘러간 시간을 초(Seconds) 또는 밀리초(Milliseconds) 단위의 정수로 나타낸 표준 체계입니다. 데이터베이스(created_at), 분산 서버 로그, JWT 토큰 만료시간 등에 폭넓게 사용되며, 이 도구를 통해 복잡한 숫자를 현지 시간과 UTC 날짜로 즉시 변환할 수 있습니다.',
      ja: 'Unixタイムスタンプ（エポック秒）は、1970年1月1日00:00:00 UTCからの経過秒数を表す世界共通の時刻規格です。データベースのタイムスタンプやサーバーログ、APIトークンの期限管理などに広く用いられます。本ツールは整数値と人間が読めるカレンダー日時を双方向に瞬時変換します。'
    },
    whenToUse: {
      en: [
        { title: 'Database Record Auditing', desc: 'Translate raw integer timestamp columns (e.g. 1772619000) from SQL/NoSQL databases to readable dates.' },
        { title: 'JWT Expiration Debugging', desc: 'Convert "exp" and "iat" epoch claims from authorization tokens to local expiration times.' },
        { title: 'Server Log Correlation', desc: 'Sync and compare microservice log events recorded across disparate UTC/local time representations.' },
        { title: 'Future Expiration Calculation', desc: 'Generate exact timestamp values for Redis TTL keys or HTTP Cache-Control headers.' }
      ],
      ko: [
        { title: 'DB 타임스탬프 컬럼 조회', desc: 'PostgreSQL, MySQL, MongoDB 등의 정수형 시간 컬럼(1772619000)을 사람이 읽을 수 있는 날짜로 복원합니다.' },
        { title: 'JWT 만료시간(exp) 분석', desc: '인증 토큰 내부의 exp 초 단위 숫자를 한국 시간(KST)으로 변환하여 토큰 수명을 확인합니다.' },
        { title: '분산 서버 로그 시간 동기화', desc: '해외 리전 서버(UTC)에서 찍힌 에러 로그 발생 시각을 국내 시간대로 환산해 장애를 추적합니다.' },
        { title: 'Redis TTL / 캐시 만료 설정', desc: '특정 미래 날짜나 시간에 맞춰 만료되어야 하는 캐시 키의 Unix 타임스탬프 정수값을 도출합니다.' }
      ],
      ja: [
        { title: 'DBのタイムスタンプ照会', desc: 'データベースに保存された秒単位の数値（例: 1772619000）を日本時間（JST）の日時へ変換します。' },
        { title: 'JWTの有効期限（exp）確認', desc: '認証トークン内のexpクレームの値を日本時間に変換し、期限切れ時刻を特定します。' },
        { title: 'サーバーログの時刻同期', desc: 'UTCで記録されたエラーログの発生時刻をローカル日時に換算して障害調査を行います。' },
        { title: 'キャッシュ有効期限（TTL）の作成', desc: 'RedisやHTTPヘッダーに設定する将来の失効タイムスタンプ数値を逆算・取得します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Current Time Display', desc: 'View the live, ticking Unix epoch timestamp for right now.' },
        { step: 2, title: 'Timestamp to Date', desc: 'Enter any 10-digit (seconds) or 13-digit (milliseconds) integer to see full UTC, ISO 8601, and local dates.' },
        { step: 3, title: 'Date to Timestamp', desc: 'Pick any calendar date and time to calculate its corresponding Unix epoch integer.' },
        { step: 4, title: 'Copy Timestamp', desc: 'Click copy next to any formatted representation for your code or database queries.' }
      ],
      ko: [
        { step: 1, title: '실시간 현재 타임스탬프', desc: '페이지 상단에서 매초 갱신되는 현재 시각의 Unix 초/밀리초 값을 확인합니다.' },
        { step: 2, title: '숫자를 날짜로 변환', desc: '10자리(초) 또는 13자리(밀리초) 숫자를 입력하면 한국 표준시(KST) 및 UTC 날짜가 출력됩니다.' },
        { step: 3, title: '날짜를 숫자로 변환', desc: '캘린더 피커에서 원하는 연/월/일/시/분을 선택하면 해당하는 유닉스 타임스탬프 정수가 계산됩니다.' },
        { step: 4, title: '결과 복사 및 활용', desc: '필요한 포맷(ISO 8601, 현지 시각, 정수값)을 원클릭으로 복사하여 쿼리나 코드에 적용합니다.' }
      ],
      ja: [
        { step: 1, title: '現在のタイムスタンプ', desc: '現在時刻のエポック秒およびミリ秒がリアルタイムに表示されます。' },
        { step: 2, title: '数値から日時に変換', desc: '10桁（秒）または13桁（ミリ秒）の数値を入力すると、JSTやUTCの日時を展開します。' },
        { step: 3, title: '日時から数値に変換', desc: 'カレンダーから任意の日時を指定すると、対応するエポックタイムスタンプが算出されます。' },
        { step: 4, title: '結果をコピー', desc: 'ISO 8601形式や整数値をワンクリックでコピーして開発に活用します。' }
      ]
    },
    example: {
      input: 'Timestamp: 1772619000',
      output: 'UTC: 2026-03-04 10:10:00\nLocal: 2026-03-04 19:10:00 (KST/JST, GMT+9)\nISO 8601: 2026-03-04T10:10:00.000Z'
    },
    faq: {
      en: [
        { q: 'How can I tell seconds apart from milliseconds?', a: 'A standard 10-digit timestamp (e.g. 1772619000) represents seconds. A 13-digit timestamp (e.g. 1772619000000) represents milliseconds, which is the standard format used by JavaScript Date.now().' },
        { q: 'What is the Year 2038 Problem (Y2038)?', a: 'On January 19, 2038, standard 32-bit signed integers will overflow 2,147,483,647 seconds and wrap around to negative numbers (1901). Modern 64-bit systems handle timestamps safely for hundreds of billions of years.' },
        { q: 'Does Unix time account for leap seconds?', a: 'By definition (POSIX), Unix time ignores leap seconds. Each day is treated as strictly having 86,400 seconds.' }
      ],
      ko: [
        { q: '초(Seconds)와 밀리초(Milliseconds)는 어떻게 구분하나요?', a: '10자리 숫자는 초 단위이며(C, Go, Python 기본형), 13자리 숫자는 밀리초 단위입니다(JavaScript Date.now(), Java Date 기본형).' },
        { q: '2038년 문제(Year 2038 Problem)란 무엇인가요?', a: '과거 32비트 정수형 시스템은 2038년 1월 19일에 최대치(2,147,483,647)를 넘어 음수로 오버플로우되는 문제가 있었습니다. 현재의 64비트 환경에서는 수천억 년 동안 안전합니다.' },
        { q: '윤초(Leap Second)는 어떻게 계산되나요?', a: 'POSIX 국제 표준에 따라 유닉스 시간은 윤초를 무시하며, 하루를 정확히 86,400초로 고정하여 계산합니다.' }
      ],
      ja: [
        { q: '秒とミリ秒はどうやって見分ければよいですか？', a: '通常、10桁の数値は「秒単位」、13桁の数値は「ミリ秒単位」（JavaScriptのDate.now()などで使用）となります。' },
        { q: '2038年問題（Y2038）とは何ですか？', a: '32ビット符号付き整数が2038年1月19日に上限値を超えてオーバーフローする問題です。現在の64ビット環境では問題なく動作します。' },
        { q: 'うるう秒は考慮されますか？', a: 'POSIX規格により、Unix時間はうるう秒をカウントせず、1日を厳密に86,400秒として扱います。' }
      ]
    },
    notes: {
      en: [
        'Utilizes browser Intl.DateTimeFormat and Date objects for precise timezone calculations.',
        'Supports ISO 8601, RFC 2822, and standard locale-specific datetime formatting.'
      ],
      ko: [
        '브라우저의 표준 Date 및 Intl.DateTimeFormat API를 활용하여 전 세계 모든 타임존을 정확하게 계산합니다.',
        'ISO 8601 및 RFC 2822 등 백엔드 API 표준 포맷을 완벽하게 지원합니다.'
      ],
      ja: [
        'ブラウザのIntl.DateTimeFormatAPIを活用し、各タイムゾーンに応じた厳密な時刻計算を行います。',
        'ISO 8601などの国際規格に準拠したフォーマット出力に対応しています。'
      ]
    },
    relatedTools: [
      { id: 'jwt-decoder', name: 'JWT Decoder', desc: { en: 'Inspect and convert epoch expiration claims inside tokens.', ko: 'JWT 인증 토큰의 exp 만료일시를 유닉스 타임스탬프로 대조합니다.', ja: 'JWTトークン内のexpクレームのタイムスタンプを即座に確認します。' }, icon: 'Shield' },
      { id: 'uuid-generator', name: 'UUID Generator', desc: { en: 'Generate unique identifiers alongside time-based transaction logs.', ko: '시간 기반 로그 추적에 필요한 고유 트랜잭션 UUID를 발급합니다.', ja: '時刻ベースのログ追跡に必要なUUIDを一意に発行します。' }, icon: 'Fingerprint' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare timestamped server logs across incidents.', ko: '타임스탬프가 찍힌 서로 다른 서버 로그 파일의 차이점을 대조합니다.', ja: 'タイムスタンプ付きサーバーログの差分を比較します。' }, icon: 'Braces' },
      { id: 'text-analyzer', name: 'Text Analyzer', desc: { en: 'Analyze log data volumes containing multiple timestamp records.', ko: '타임스탬프가 포함된 대량 로그 텍스트의 통계를 분석합니다.', ja: 'タイムスタンプを含むログテキストの文字数や統計を解析します。' }, icon: 'FileText' }
    ]
  },
  {
    id: 'text-analyzer',
    meta: {
      title: {
        en: 'Text Analyzer - Word Count, Character Count & Read Time Tool',
        ko: '텍스트 분석기 - 글자수, 단어수, 바이트(Byte) 및 읽기 시간 계산',
        ja: 'テキスト分析ツール - 文字数、単語数、バイト数、読了時間計算'
      },
      description: {
        en: 'Analyze character count (with/without spaces), word count, UTF-8 byte size, reading time, and keyword frequency in real time. Ideal for blog posts, SEO metadata, and DB string limit checks.',
        ko: '공백 포함/제외 글자수, 단어수, 줄(Line)수, UTF-8 바이트 크기, 예상 읽기 시간 및 키워드 출현 빈도를 실시간 분석합니다. 블로그 원고, 자소서 및 DB 컬럼 길이 검증에 필수적입니다.',
        ja: '文字数（空白込み/除外）、単語数、行数、UTF-8バイト数、読了時間、キーワード出現頻度をリアルタイム分析。SEO記事作成や文字数制限チェックに最適。'
      }
    },
    overview: {
      en: 'Whether drafting SEO blog posts, respecting database VARCHAR byte limits, or adhering to social media character caps, precise text metrics are vital. Simple word counts in word processors often fail to measure multi-byte UTF-8 bytes or omit whitespace distinctions. This Text Analyzer evaluates your copy in real time across characters, words, lines, byte footprints, and keyword densities.',
      ko: 'SEO 블로그 포스팅을 작성할 때, 데이터베이스 컬럼의 VARCHAR 바이트 한도를 맞출 때, 혹은 채용 자기소개서나 SNS 글자수 제한을 지켜야 할 때 정확한 텍스트 분석이 필수적입니다. 일반 워드프로세서는 한글 3바이트(UTF-8) 특성을 간과하기 쉽습니다. 본 텍스트 분석기는 공백 유무에 따른 글자수, 단어수, 바이트수, 예상 독서 시간 및 키워드 빈도수를 실시간으로 종합 분석합니다.',
      ja: 'ブログ記事の執筆やデータベースのVARCHARバイト数制限、SNSの文字数制限に対応するためには、正確なテキスト計測が重要です。日本語や韓国語はUTF-8で3バイト消費するため、単純な文字数だけでなくバイト数の把握が欠かせません。本ツールは文字数、単語数、バイト数、読了予測時間を瞬時に算出します。'
    },
    whenToUse: {
      en: [
        { title: 'Database VARCHAR Byte Limits', desc: 'Ensure strings fit within MySQL or Oracle VARCHAR(255) byte constraints, accounting for UTF-8.' },
        { title: 'SEO Title & Meta Description Checks', desc: 'Optimize titles (50-60 characters) and descriptions (150-160 characters) for Google search snippets.' },
        { title: 'Blog & Article Read Time', desc: 'Estimate audience reading time based on standard reading velocities (200 words/min).' },
        { title: 'Essay & Resume Character Caps', desc: 'Meet strict academic or job application character thresholds (with and without whitespace).' }
      ],
      ko: [
        { title: '데이터베이스 VARCHAR 바이트 계산', desc: 'MySQL 등 DB에 저장 시 한글(3바이트)로 인해 VARCHAR(255) 한도를 초과하여 잘리는 현상을 방지합니다.' },
        { title: 'SEO 검색 노출 최적화', desc: '구글/네이버 검색결과에서 제목(50~60자)과 메타 설명문(140~160자)이 말줄임표로 잘리지 않도록 맞춥니다.' },
        { title: '콘텐츠 예상 읽기 시간 산출', desc: '작성한 블로그나 뉴스레터 원고의 독자 평균 완독 시간(분당 500자 기준)을 사전 측정합니다.' },
        { title: '자기소개서/공모전 글자수 준수', desc: '공백 포함 글자수와 공백 제외 글자수를 엄격히 구분하여 제출 요건을 완벽히 충족합니다.' }
      ],
      ja: [
        { title: 'DBのVARCHARバイト数チェック', desc: 'MySQLなどで日本語（1文字3バイト）がカラム制限を超えて切り捨てられるのを防ぎます。' },
        { title: 'SEOタイトル・メタディスクリプション最適化', desc: 'Google検索結果でタイトル（30〜35文字）や概要文（120文字前後）が途切れないよう調整します。' },
        { title: 'ブログ記事の読了時間予測', desc: '一般的な読書速度（1分あたり約500〜600文字）を基準に、記事の推定読了時間を算出します。' },
        { title: 'エントリーシートや課題の文字数管理', desc: '空白込み・空白除外の文字数を厳密に把握し、提出規定に適合させます。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Input Copy', desc: 'Paste or type your text directly into the main writing area.' },
        { step: 2, title: 'Instant Metric Overview', desc: 'Review total characters, characters excluding spaces, words, lines, and paragraphs.' },
        { step: 3, title: 'Inspect UTF-8 Byte Size', desc: 'Check the exact binary byte size (ASCII=1 byte, Korean/Japanese=3 bytes, Emojis=4 bytes).' },
        { step: 4, title: 'Explore Keyword Density', desc: 'Inspect the most frequently occurring terms to optimize keyword distribution.' }
      ],
      ko: [
        { step: 1, title: '원고 입력', desc: '분석할 본문이나 문단을 입력창에 직접 타이핑하거나 붙여넣습니다.' },
        { step: 2, title: '통계 지표 실시간 확인', desc: '총 글자수, 공백 제외 글자수, 단어수, 문장수, 문단수가 즉각 계산되어 카드에 표시됩니다.' },
        { step: 3, title: 'UTF-8 바이트 크기 점검', desc: '영문 1바이트, 한글 3바이트, 이모지 4바이트로 계산된 정확한 메모리 용량을 파악합니다.' },
        { step: 4, title: '키워드 빈도수 분석', desc: '글에서 가장 많이 반복된 핵심 단어들의 횟수와 비율을 확인하여 문맥을 다듬습니다.' }
      ],
      ja: [
        { step: 1, title: 'テキストを入力', desc: '分析したい文章を入力欄に入力または貼り付けます。' },
        { step: 2, title: '統計指標の確認', desc: '文字数、空白除外文字数、単語数、行数、段落数がリアルタイムに算出されます。' },
        { step: 3, title: 'UTF-8バイト数の把握', desc: '日本語（3バイト）や英数字（1バイト）を含む正確なバイト容量を確認します。' },
        { step: 4, title: '頻出キーワードの分析', desc: '文章内で繰り返し使用されている重要語句の出現回数と比率を確認します。' }
      ]
    },
    example: {
      input: 'DevToolz는 개발자를 위한 100% 무료 도구 모음입니다. 빠르고 안전합니다!',
      output: '글자수 (공백 포함): 44자\n글자수 (공백 제외): 36자\n단어수: 8단어\nUTF-8 바이트: 92 Bytes\n예상 읽기 시간: 약 10초'
    },
    faq: {
      en: [
        { q: 'How is UTF-8 byte size calculated?', a: 'Standard ASCII letters count as 1 byte. Extended Latin and Greek take 2 bytes. CJK characters (Korean, Chinese, Japanese) take 3 bytes. Modern emojis take 4 bytes. This tool uses standard TextEncoder API for exact byte calculations.' },
        { q: 'What formula is used for reading time?', a: 'Reading time is calculated using an average reading speed of 200 to 250 words per minute for English, and approximately 500 characters per minute for CJK scripts.' },
        { q: 'Is my text uploaded to any external server?', a: 'No. All calculations are executed purely in your browser runtime via native JavaScript APIs. Your drafts remain entirely private.' }
      ],
      ko: [
        { q: 'UTF-8 바이트는 어떻게 계산되나요?', a: '기본 영문/숫자는 1바이트, 한글/한자/일본어는 글자당 3바이트, 이모지(특수문자)는 4바이트를 차지합니다. 본 도구는 TextEncoder 표준 API를 사용하여 시스템과 오차 없는 바이트 크기를 산출합니다.' },
        { q: '예상 읽기 시간은 어떤 기준으로 측정되나요?', a: '한국어 기준 성인 평균 묵독 속도인 분당 약 500자를 기준으로 계산되어, 블로그나 뉴스레터 독자의 체류 시간을 가늠하는 지표가 됩니다.' },
        { q: '입력한 원고가 외부에 저장되나요?', a: '전혀 저장되지 않습니다. 모든 텍스트 카운팅은 브라우저 내부에서만 수행되므로 미공개 소설, 기획서, 자소서도 안심하고 분석할 수 있습니다.' }
      ],
      ja: [
        { q: 'UTF-8バイト数はどのように計算されますか？', a: '半角英数字は1バイト、日本語のひらがな・カタカナ・漢字は原則3バイト、絵文字は4バイトで計算されます。ブラウザのTextEncoderを用いて正確なバイト数を返します。' },
        { q: '読了時間はどのような基準で算出されますか？', a: '一般的な日本語の読書速度（1分あたり約500文字）に基づいて推定読了時間を計算しています。' },
        { q: '入力した文章が外部に保存されることはありますか？', a: '一切ありません。すべてのテキスト分析はブラウザ内でローカルに実行され、完全な機密性が守られます。' }
      ]
    },
    notes: {
      en: [
        'Utilizes browser TextEncoder and Intl.Segmenter APIs for culturally accurate word and character separation.',
        'Runs completely offline on your device with zero cloud tracking.'
      ],
      ko: [
        '브라우저 표준 TextEncoder 및 Intl.Segmenter API를 활용하여 한글 조사와 어절을 정확하게 분석합니다.',
        '완전한 브라우저 오프라인 연산으로 개인 원고의 프라이버시를 철저히 보장합니다.'
      ],
      ja: [
        '最新のTextEncoderおよびIntl.SegmenterAPIを活用し、高精度な文字・単語カウントを行います。',
        '完全なオフライン処理により、未公開原稿などの機密文章も安心して分析できます。'
      ]
    },
    relatedTools: [
      { id: 'markdown-editor', name: 'Markdown Editor', desc: { en: 'Write and preview markdown documents measured with this tool.', ko: '분석한 텍스트를 마크다운 서식으로 편집하고 실시간 미리보기합니다.', ja: '文字数を計測した文章をMarkdown形式で編集・プレビューします。' }, icon: 'Edit3' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare drafted revisions of your text side-by-side.', ko: '수정 전후의 글자수 변화와 원고의 구체적인 문장 차이점을 대조합니다.', ja: '推敲前後の文章差分を並列比較して確認します。' }, icon: 'Braces' },
      { id: 'regex-tester', name: 'Regex Tester', desc: { en: 'Filter and extract specific terms analyzed in keyword counts.', ko: '빈도수가 높은 특정 단어나 문장 패턴을 정규식으로 추출합니다.', ja: '頻出単語や特定の構文を正規表現で抽出・置換します。' }, icon: 'Code' },
      { id: 'token-counter', name: 'LLM Token Counter', desc: { en: 'Calculate LLM token consumption (GPT-4o, Claude) from your text.', ko: '단어수와 함께 AI 모델(GPT, Claude)의 실제 토큰 소비량을 측정합니다.', ja: '文字数と同時にLLM（GPT-4oやClaude）のトークン消費量を算出します。' }, icon: 'Cpu' }
    ]
  },
  {
    id: 'markdown-editor',
    meta: {
      title: {
        en: 'Markdown Editor - Free Online Markdown Editor & Live Preview',
        ko: '마크다운 에디터 - 실시간 미리보기 & HTML 변환기',
        ja: 'Markdownエディター - リアルタイムプレビュー＆HTML変換無料ツール'
      },
      description: {
        en: 'Write and preview GitHub Flavored Markdown (GFM) with live split-screen rendering, syntax highlighting, table generation, and one-click HTML / Markdown export.',
        ko: 'GitHub Flavored Markdown(GFM) 규격을 완벽 지원하는 실시간 분할 화면 마크다운 에디터입니다. 표, 체크리스트, 코드 블록을 즉시 렌더링하고 HTML로 변환합니다.',
        ja: 'GitHub Flavored Markdown（GFM）完全準拠のリアルタイムプレビュー付きエディタ。テーブルやチェックリストに対応し、HTML形式でのエクスポートも可能。'
      }
    },
    overview: {
      en: 'Markdown is the ubiquitous writing standard for developer documentation, GitHub READMEs, static site generators (Next.js, Hugo), and technical blogs. Writing raw markdown without visual feedback often leads to broken table layouts or misaligned heading hierarchies. This split-screen editor provides synchronized real-time rendering, full GFM support (tables, task lists, strikethrough), and seamless export options.',
      ko: '마크다운(Markdown)은 개발자 문서, GitHub README.md, 기술 블로그(Velog, Tistory), 정적 웹사이트 작성에 없어서는 안 될 표준 서식 언어입니다. 미리보기 없이 원문만 작성하면 표(Table)가 깨지거나 코드 블록 서식이 어긋나기 쉽습니다. 본 에디터는 좌우 실시간 분할 미리보기와 GitHub Flavored Markdown(GFM) 표준을 지원하여 편리한 문서 작성을 돕습니다.',
      ja: 'Markdownは、GitHubのREADMEや技術ドキュメント、ブログ記事の標準的な記法です。プレビューなしでの執筆は表の崩れや見出しレベルの誤りを招きます。本ツールはリアルタイムな左右分割プレビューとGFM（GitHub標準記法）を完全サポートし、快適な執筆環境を提供します。'
    },
    whenToUse: {
      en: [
        { title: 'GitHub README.md Authoring', desc: 'Craft professional repository READMEs with project badges, code fences, and installation tables.' },
        { title: 'Technical Blog Post Drafting', desc: 'Write technical articles and export clean HTML ready for CMS platforms like WordPress.' },
        { title: 'API Documentation Notes', desc: 'Document endpoint contracts with curl snippets and JSON payload blocks.' },
        { title: 'Checklists & Task Tracking', desc: 'Manage sprint task lists using interactive GitHub-style GFM checkboxes (- [x]).' }
      ],
      ko: [
        { title: 'GitHub 저장소 README.md 작성', desc: '프로젝트 소개, 뱃지, 설치 가이드 테이블, 코드 블록이 포함된 깔끔한 리드미를 작성합니다.' },
        { title: '기술 블로그 원고 작성', desc: '코드 구문 강조(Syntax Highlighting)가 적용된 아티클을 작성하고 깨끗한 HTML로 내보냅니다.' },
        { title: 'REST API 명세 정리', desc: 'curl 요청 예시와 JSON 응답 페이로드가 포함된 개발자 가이드 문서를 신속하게 정리합니다.' },
        { title: '스프린트 체크리스트 관리', desc: '깃허브 스타일의 대화형 할 일 목록(- [x]) 서식으로 작업 현황을 일목요연하게 정리합니다.' }
      ],
      ja: [
        { title: 'GitHub README.mdの作成', desc: 'バッジやインストール手順、コードブロックを含むリポジトリ用ドキュメントを作成します。' },
        { title: '技術ブログの執筆', desc: 'シンタックスハイライト付きの記事を作成し、Webサイト用のクリーンなHTMLへ変換します。' },
        { title: 'API仕様ドキュメントの整理', desc: 'curlコマンドの例やJSONレスポンスを含む見やすいAPI仕様書を記述します。' },
        { title: 'タスクチェックリストの作成', desc: 'GitHub形式のタスク記法（- [x]）を用いてプロジェクトのToDoリストを管理します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Write Markdown', desc: 'Type your markdown content in the left editor panel or load an example template.' },
        { step: 2, title: 'Real-time Preview', desc: 'Observe instant HTML rendering in the right pane with synchronized headings and typography.' },
        { step: 3, title: 'Use Formatting Toolbar', desc: 'Use top shortcuts for bold, italics, headers (H1-H3), code blocks, and markdown tables.' },
        { step: 4, title: 'Export Document', desc: 'Copy the compiled HTML code or download the file directly as README.md.' }
      ],
      ko: [
        { step: 1, title: '마크다운 작성', desc: '왼쪽 편집창에 텍스트를 입력하거나 상단 툴바의 단축 버튼을 이용해 서식을 넣습니다.' },
        { step: 2, title: '실시간 렌더링 확인', desc: '오른쪽 미리보기 창에서 제목 크기, 표 정렬, 코드 블록이 올바르게 출력되는지 확인합니다.' },
        { step: 3, title: '툴바 활용', desc: '굵게, 기울임, 링크, 이미지, 인용구, 표 생성 툴바를 클릭하여 복잡한 문법을 쉽게 적용합니다.' },
        { step: 4, title: '내보내기 및 복사', desc: '완성된 마크다운을 README.md 파일로 다운로드하거나, 블로그용 HTML 코드로 복사합니다.' }
      ],
      ja: [
        { step: 1, title: 'Markdownの記述', desc: '左側のエディタにテキストを入力するか、上部ツールバーのショートカットを利用します。' },
        { step: 2, title: 'リアルタイムプレビュー', desc: '右側の画面で見出し、リスト、テーブル、コードブロックの表示状態を即座に確認します。' },
        { step: 3, title: '装飾ツールの活用', desc: '太字、斜体、リンク、引用、テーブル挿入などの補助機能で効率的に記述します。' },
        { step: 4, title: 'エクスポート', desc: '完成したドキュメントをREADME.mdとして保存、またはHTMLコードとしてコピーします。' }
      ]
    },
    example: {
      input: '# DevToolz\n\n- [x] Free and Fast\n- [ ] Multi-language Support\n\n```json\n{"status": "ok"}\n```',
      output: '<h1>DevToolz</h1>\n<ul>\n  <li><input type="checkbox" checked disabled> Free and Fast</li>\n  <li><input type="checkbox" disabled> Multi-language Support</li>\n</ul>\n<pre><code class="language-json">{"status": "ok"}</code></pre>'
    },
    faq: {
      en: [
        { q: 'Is GitHub Flavored Markdown (GFM) supported?', a: 'Yes. Features like tables, autolinks, strikethrough (~~text~~), task lists (- [ ]), and fenced code blocks are fully supported.' },
        { q: 'Can I render raw HTML inside my markdown?', a: 'Standard HTML tags (like <kbd>, <span>, <div>) are rendered properly within the markdown document while being securely sanitized against XSS.' },
        { q: 'Does my document get saved if I close the tab?', a: 'Yes. Drafts can be automatically preserved in your browser local storage so your work is safe if you accidentally reload the page.' }
      ],
      ko: [
        { q: 'GitHub 확장 마크다운(GFM) 문법도 지원하나요?', a: '네! 표(Table), 작업 목록 체크박스(- [x]), 취소선(~~텍스트~~), 자동 URL 링크 등 GitHub 표준 문법을 완벽하게 렌더링합니다.' },
        { q: '마크다운 본문에 일반 HTML 태그도 섞어 쓸 수 있나요?', a: '네, <kbd>, <span>, <center> 등 웹 호환 HTML 태그를 마크다운과 함께 자유롭게 혼용하여 레이아웃을 꾸밀 수 있습니다.' },
        { q: '작성 중 실수로 탭을 닫아도 복구되나요?', a: '브라우저 로컬 저장소(localStorage)에 작성 중인 내용이 안전하게 임시 저장되므로 새로고침해도 원고가 보존됩니다.' }
      ],
      ja: [
        { q: 'GitHub標準の拡張記法（GFM）に対応していますか？', a: 'はい。テーブル、チェックボックス付きタスクリスト、取り消し線、コードブロックなどを完全サポートしています。' },
        { q: 'Markdown内にHTMLタグを記述することは可能ですか？', a: 'はい。<kbd>や<span>タグなど、通常のHTMLマークアップを混在させて記述することができます。' },
        { q: '誤ってブラウザを閉じても下書きは残りますか？', a: 'ローカルストレージによりブラウザ内に下書きが自動保持されるため、安全に執筆を継続できます。' }
      ]
    },
    notes: {
      en: [
        'Rendered using a lightweight, compliant AST-based Markdown pipeline entirely in client JavaScript.',
        'Zero external server calls ensure your internal documentation and draft articles stay confidential.'
      ],
      ko: [
        '브라우저 내 클라이언트 사이드 AST 마크다운 파서를 통해 외부 통신 없이 즉각적이고 부드러운 렌더링을 제공합니다.',
        '사내 프로젝트 가이드나 미공개 기술 아티클을 작성해도 서버로 데이터가 전송되지 않아 철저한 보안이 유지됩니다.'
      ],
      ja: [
        'クライアントサイドの高速なMarkdownパーサーにより、低遅延で快適な執筆体験を提供します。',
        'すべての処理がブラウザ内で完結するため、社内向けの機密文書作成にも安心してご利用いただけます。'
      ]
    },
    relatedTools: [
      { id: 'text-analyzer', name: 'Text Analyzer', desc: { en: 'Check character counts and reading time for your markdown articles.', ko: '작성한 마크다운 문서의 글자 수, 단어 수 및 완독 시간을 측정합니다.', ja: '作成したMarkdown文書の文字数や推定読了時間を計測します。' }, icon: 'FileText' },
      { id: 'diff-checker', name: 'Diff Checker', desc: { en: 'Compare revisions and git differences of markdown files.', ko: '마크다운 리드미 문서의 버전 간 변경 사항을 좌우로 비교합니다.', ja: 'Markdownドキュメントの改訂前後の差分を視覚的に比較します。' }, icon: 'Braces' },
      { id: 'json-formatter', name: 'JSON Formatter', desc: { en: 'Format JSON snippets to embed inside markdown code blocks.', ko: '마크다운 코드 블록(```json) 안에 들어갈 JSON 데이터를 깔끔하게 정렬합니다.', ja: 'Markdownコードブロックに掲載するJSONを整形します。' }, icon: 'FileJson' },
      { id: 'qr-code', name: 'QR Code Generator', desc: { en: 'Generate QR codes for links embedded in documentation.', ko: '기술 문서나 발표 자료에 첨부할 웹사이트 링크 QR 코드를 만듭니다.', ja: 'ドキュメント内に掲載するリンク用のQRコードを生成します。' }, icon: 'QrCode' }
    ]
  },
  {
    id: 'color-converter',
    meta: {
      title: {
        en: 'Color Converter - HEX, RGB, HSL, CMYK Online Color Tool',
        ko: '색상 변환기 - HEX, RGB, HSL, CMYK 상호 변환 및 팔레트',
        ja: 'カラー変換ツール - HEX, RGB, HSL, CMYK 相互変換＆パレット'
      },
      description: {
        en: 'Convert colors seamlessly across HEX, RGB, HSL, and CMYK formats with real-time visual picker, WCAG contrast ratio analysis, and CSS code copy.',
        ko: 'HEX(#000000), RGB, HSL, CMYK 색상 코드를 실시간으로 상호 변환합니다. 웹 접근성(WCAG) 명도 대비비 검사 및 CSS 색상 코드 즉시 복사 지원.',
        ja: 'HEX、RGB、HSL、CMYK形式のカラーコードを相互変換。ビジュアルカラーピッカー、WCAGコントラスト比チェック、CSS出力に対応。'
      }
    },
    overview: {
      en: 'Designers and developers often collaborate using different color models: UI designers work in HSL or HEX, frontend developers write CSS rgb() or hex codes, and print teams demand CMYK values. Manually recalculating color coordinates is tedious. This utility provides instantaneous bidirectional conversion across all primary color spaces alongside WCAG contrast evaluation to guarantee accessible UI components.',
      ko: '디자이너와 프론트엔드 개발자는 서로 다른 색상 포맷을 자주 다룹니다. Figma에서는 HEX나 HSL을 쓰고, CSS에서는 rgb()나 hex를 작성하며, 인쇄물 작업 시에는 CMYK 수치가 필요합니다. 본 색상 변환기는 모든 주요 색상 모델 간의 상호 변환을 실시간으로 지원하며, 웹 접근성 가이드라인(WCAG)에 따른 텍스트 대비비(Contrast Ratio)를 함께 검증합니다.',
      ja: 'デザインと開発の現場では異なるカラーモデルが日常的に使われます。FigmaでのHEX/HSL、CSSでのRGB、印刷でのCMYKなど多岐にわたります。本ツールは主要な色空間を相互変換し、Webアクセシビリティ（WCAG）基準に合致するコントラスト比の検証も同時に行えます。'
    },
    whenToUse: {
      en: [
        { title: 'CSS Theme Palette Creation', desc: 'Convert design tokens from Figma (HEX) into CSS variable formats like hsl(var(--primary)).' },
        { title: 'Web Accessibility (WCAG) Auditing', desc: 'Verify that text colors meet WCAG AA (4.5:1) or AAA (7:1) contrast standards against backgrounds.' },
        { title: 'Print to Digital Synchronization', desc: 'Translate print-ready CMYK ink percentages into digital sRGB / HEX equivalents.' },
        { title: 'Tailwind CSS Color Extensions', desc: 'Extract clean RGB channels to implement opacity-friendly Tailwind utility colors.' }
      ],
      ko: [
        { title: 'CSS 테마 및 디자인 시스템 구축', desc: '피그마(Figma)에서 전달받은 HEX 코드를 CSS 커스텀 속성용 HSL이나 RGB 수치로 변환합니다.' },
        { title: '웹 접근성(WCAG) 명도 대비비 점검', desc: '배경색 위에 올릴 글자색이 WCAG AA 기준(4.5:1 이상)을 충족하는지 실시간으로 검사합니다.' },
        { title: '인쇄용 CMYK와 웹용 RGB 동기화', desc: '브로슈어나 명함용 CMYK 잉크 값을 웹사이트용 디지털 sRGB/HEX 코드로 손쉽게 환산합니다.' },
        { title: 'Tailwind CSS 불투명도 채널 추출', desc: 'Tailwind에서 투명도 조절(bg-opacity)이 가능한 RGB 채널 분리값을 도출합니다.' }
      ],
      ja: [
        { title: 'CSSテーマパレットの構築', desc: 'デザインツールから抽出したHEXカラーを、CSS変数（HSLやRGB）へ瞬時に変換します。' },
        { title: 'WCAGアクセシビリティ検証', desc: '背景色と文字色のコントラスト比がWCAG AA基準（4.5:1以上）をクリアしているか判定します。' },
        { title: '印刷用CMYKとWeb用RGBの連携', desc: '印刷向けCMYK値とWeb向けデジタルsRGB値を手軽に相互変換します。' },
        { title: 'Tailwind CSS用の透過カラー設定', desc: 'アルファ値（不透明度）を適用しやすいRGB形式のカラー定義を素早く取得します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Pick or Enter Color', desc: 'Select a color visually via the picker or paste a code (e.g. #3B82F6 or rgb(59, 130, 246)).' },
        { step: 2, title: 'Instant Conversion', desc: 'Inspect synchronized outputs for HEX, RGB, HSL, HSV, and CMYK.' },
        { step: 3, title: 'Check WCAG Contrast', desc: 'Review the contrast ratio against black and white text for accessibility compliance.' },
        { step: 4, title: 'Copy CSS Code', desc: 'Click copy next to any format to paste directly into your CSS or Tailwind stylesheet.' }
      ],
      ko: [
        { step: 1, title: '색상 선택 또는 입력', desc: '비주얼 컬러 피커를 클릭하거나 입력창에 HEX(#3b82f6) 또는 RGB 값을 직접 입력합니다.' },
        { step: 2, title: '실시간 색상값 확인', desc: 'HEX, RGB, HSL, CMYK 포맷으로 자동 변환된 정확한 수치들을 확인합니다.' },
        { step: 3, title: '웹 접근성 대비비 확인', desc: '선택한 색상 위에서 흰색 글자와 검은색 글자가 읽기 쉬운지(WCAG 합격 여부)를 점검합니다.' },
        { step: 4, title: 'CSS 코드 복사', desc: '원하는 포맷 옆의 복사 버튼을 눌러 스타일시트나 디자인 토큰 파일에 바로 붙여넣습니다.' }
      ],
      ja: [
        { step: 1, title: '色を選択または入力', desc: 'カラーピッカーから直感的に選ぶか、HEX（#3B82F6など）を直接入力します。' },
        { step: 2, title: '相互変換値の確認', desc: 'HEX、RGB、HSL、CMYKの各フォーマット値が同時に算出されます。' },
        { step: 3, title: 'WCAGコントラスト判定', desc: '黒文字および白文字を重ねた場合の視認性（AA/AAA適合度）を確認します。' },
        { step: 4, title: 'CSSコードをコピー', desc: '必要なフォーマットをワンクリックでコピーし、スタイルシートへ適用します。' }
      ]
    },
    example: {
      input: 'HEX: #3B82F6',
      output: 'RGB: rgb(59, 130, 246)\nHSL: hsl(217, 91%, 60%)\nCMYK: cmyk(76%, 47%, 0%, 4%)\nWCAG Contrast on White: 3.4:1 (Fail)\nWCAG Contrast on Black: 6.2:1 (Pass AA)'
    },
    faq: {
      en: [
        { q: 'Why do frontend developers prefer HSL over HEX?', a: 'HSL (Hue, Saturation, Lightness) aligns intuitively with human perception. Tweaking brightness or creating lighter hover states simply requires adjusting the Lightness percentage (e.g., from 50% to 60%) without altering the base hue.' },
        { q: 'Can CMYK perfectly represent all RGB colors on screens?', a: 'No. The RGB color gamut for digital displays is significantly wider than the subtractive CMYK ink gamut used in offset printing. Some vibrant neon blues and greens in RGB cannot be fully reproduced in standard CMYK.' },
        { q: 'What is the minimum WCAG contrast ratio for body text?', a: 'Under WCAG 2.1 Level AA, standard body text must achieve a minimum contrast ratio of 4.5:1 against its background. Large text (18pt+ or bold 14pt+) requires at least 3.0:1.' }
      ],
      ko: [
        { q: '프론트엔드에서 HEX 대신 HSL을 선호하는 이유는 무엇인가요?', a: 'HSL(색상, 채도, 명도)은 인간의 직관과 가장 잘 맞습니다. 버튼 호버 효과를 만들 때 색상값을 새로 찾을 필요 없이 명도(Lightness) 수치만 50%에서 60%로 올리면 일관된 테마 색상을 유지할 수 있기 때문입니다.' },
        { q: '화면의 RGB 색상을 CMYK로 100% 똑같이 인쇄할 수 있나요?', a: '빛으로 표현되는 RGB의 색역(Color Gamut)이 잉크로 표현되는 CMYK보다 넓기 때문에, 화면에서 보이는 형광 파랑이나 네온 녹색 등은 인쇄 시 다소 톤이 가라앉아 보일 수 있습니다.' },
        { q: '본문 텍스트의 웹 접근성(WCAG) 최소 대비비는 얼마인가요?', a: 'WCAG 2.1 AA 기준에 따르면 일반 본문 텍스트는 배경과의 명도 대비비가 최소 4.5:1 이상이어야 하며, 18pt 이상의 큰 글씨는 3.0:1 이상이어야 시각 장애인도 원활히 식별할 수 있습니다.' }
      ],
      ja: [
        { q: 'なぜCSS開発でHSLが注目されているのですか？', a: 'HSL（色相・彩度・明度）は人間の感覚に合致しており、色相を変えずに明度（L）の数値を微調整するだけでホバー色やアクティブ色を体系的に管理できるためです。' },
        { q: 'RGBの色はCMYKで完全に再現できますか？', a: '発光色であるRGBの色域はインクのCMYKよりも広いため、画面上の鮮やかな青や緑は印刷時にくすむ傾向があります。本ツールは理論値換算を行います。' },
        { q: '本文テキストの最低限のコントラスト比は？', a: 'WCAG 2.1 AA規格では、通常の文字サイズにおいて背景色との間で4.5:1以上のコントラスト比が義務付けられています。' }
      ]
    },
    notes: {
      en: [
        'Adheres to standard W3C CSS Color Module Level 4 mathematical color conversion formulas.',
        'Computes relative luminance for WCAG contrast based on the sRGB photometric curve.'
      ],
      ko: [
        'W3C CSS Color Module 국제 표준 수학 공식을 적용하여 변환 오차를 없앴습니다.',
        'sRGB 표준 상대 휘도(Relative Luminance) 알고리즘을 바탕으로 엄밀한 WCAG 명도 대비비를 계산합니다.'
      ],
      ja: [
        'W3C標準のカラー変換数式に厳密に準拠し、誤差のない色彩値を導出します。',
        'sRGB相対輝度計算に基づき、客観的なWCAGアクセシビリティ評価指標を提供します。'
      ]
    },
    relatedTools: [
      { id: 'image-compressor', name: 'Image Compressor', desc: { en: 'Optimize images preserving calibrated color profiles.', ko: '선택한 색상 팔레트가 적용된 웹 이미지의 용량을 최적화합니다.', ja: '色域を維持しながらWeb画像の容量を最適化圧縮します。' }, icon: 'Image' },
      { id: 'qr-code', name: 'QR Code Generator', desc: { en: 'Generate high-contrast, accessible QR codes.', ko: '충분한 명도 대비비를 가진 브랜드 색상 QR 코드를 생성합니다.', ja: '十分なコントラスト比を保った安全なカラーQRコードを生成します。' }, icon: 'QrCode' },
      { id: 'markdown-editor', name: 'Markdown Editor', desc: { en: 'Document design system palette specifications in markdown.', ko: '디자인 시스템 색상 팔레트 명세서를 마크다운으로 정리합니다.', ja: 'デザインシステムのカラーパレット仕様書を記述します。' }, icon: 'Edit3' },
      { id: 'text-analyzer', name: 'Text Analyzer', desc: { en: 'Inspect CSS theme files containing color code tokens.', ko: '다양한 색상 코드가 포함된 CSS 테마 파일의 용량을 분석합니다.', ja: 'カラー定義を含むCSSファイルのコード量を計測します。' }, icon: 'FileText' }
    ]
  },
  {
    id: 'qr-code',
    meta: {
      title: {
        en: 'QR Code Generator - Custom QR Codes with Colors & Download',
        ko: 'QR 코드 생성기 - 고해상도 맞춤형 QR 코드 생성 및 다운로드',
        ja: 'QRコード作成ツール - 無料オンライン高画質QRコード生成'
      },
      description: {
        en: 'Generate high-resolution QR codes for URLs, Wi-Fi networks, text, and contact cards. Customize foreground/background colors, error correction levels, and download in PNG or SVG.',
        ko: '웹사이트 URL, Wi-Fi 접속, 텍스트, 명함 정보를 담은 고해상도 QR 코드를 생성합니다. 색상 커스텀, 오류 복원율(ECC) 설정, PNG/SVG 다운로드를 지원합니다.',
        ja: 'URL、Wi-Fi接続、テキスト用の高画質QRコードを無料作成。カラーカスタマイズ、誤り訂正レベル設定、PNG/SVG画像ダウンロードに対応。'
      }
    },
    overview: {
      en: 'Quick Response (QR) codes are 2D matrix barcodes designed to bridge the physical and digital worlds. Mobile devices scan QR codes to open URLs, connect to secured Wi-Fi networks without typing passwords, or authenticate two-factor logins. This generator renders vector-crisp QR codes instantly in your browser with adjustable Reed-Solomon error correction to ensure scannability even on damaged prints.',
      ko: 'QR 코드(Quick Response Code)는 오프라인과 온라인을 즉각 연결해 주는 2차원 매트릭스 바코드입니다. 스마트폰 카메라로 비추기만 하면 웹사이트로 이동하거나, 복잡한 비밀번호 없이 Wi-Fi에 자동 접속하고, 2단계 인증(2FA) 등록에 활용됩니다. 본 도구는 리드 솔로몬(Reed-Solomon) 오류 복원 기술을 적용하여 인쇄물이 다소 구겨지거나 오염되어도 안전하게 인식되는 고품질 QR을 생성합니다.',
      ja: 'QRコードは、スマートフォン等で読み取ることでURLアクセスやWi-Fiへの自動接続、2要素認証の登録などを瞬時に実行できる2次元バーコードです。本ツールはリード・ソロモン誤り訂正アルゴリズムを採用し、印刷物の汚れや欠けにも強い高品質なQRコードをブラウザ内で作成します。'
    },
    whenToUse: {
      en: [
        { title: 'Mobile Website Testing', desc: 'Instantly beam local development URLs (localhost/staging) to mobile test devices for UI QA.' },
        { title: 'Guest Wi-Fi Access Sharing', desc: 'Create a scan-to-join QR code for home or office Wi-Fi networks with WPA2/WPA3 security.' },
        { title: 'Event Marketing & Business Cards', desc: 'Generate high-resolution vector QR codes for print flyers, posters, brochures, and vCards.' },
        { title: '2FA Authentication Secrets', desc: 'Test and render TOTP setup QR codes for authenticator apps like Google Authenticator.' }
      ],
      ko: [
        { title: '모바일 반응형 웹 테스트', desc: '개발 중인 로컬/스테이징 서버 주소를 스마트폰으로 즉시 스캔하여 모바일 화면을 검수합니다.' },
        { title: '카페/사무실 Wi-Fi 간편 공유', desc: '네트워크 SSID와 암호가 담긴 QR을 인쇄하여 비밀번호 입력 없이 손님이 원터치로 연결하게 합니다.' },
        { title: '명함 및 인쇄 홍보물 제작', desc: '전단지, 브로슈어, 포스터에 인쇄할 수 있는 선명한 고해상도 벡터/이미지 QR을 추출합니다.' },
        { title: '2단계 인증(2FA) TOTP 등록', desc: 'Google OTP 등의 앱에 등록할 수 있는 계정 보안 설정 QR 코드를 생성합니다.' }
      ],
      ja: [
        { title: '実機スマホでのWebサイト検証', desc: 'ローカル開発環境のURLをスマホのカメラで素早く読み取り、モバイル表示を検証します。' },
        { title: 'Wi-Fi接続用QRコードの作成', desc: 'SSIDとパスワードを埋め込んだQRコードを印刷し、手入力なしでWi-Fi接続を提供します。' },
        { title: '名刺やチラシ等の印刷物', desc: 'パンフレットやポスターに印刷しても鮮明にスキャンできる高解像度画像を書き出します。' },
        { title: '2要素認証（TOTP）の検証', desc: '認証アプリに登録するためのセットアップ用QRコードを生成・テストします。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Enter Content', desc: 'Type or paste your destination URL, Wi-Fi credentials, or text message.' },
        { step: 2, title: 'Adjust Styling', desc: 'Customize foreground and background colors ensuring high contrast for scanners.' },
        { step: 3, title: 'Set Error Correction', desc: 'Choose Error Correction Level (L: 7%, M: 15%, Q: 25%, H: 30% recovery capacity).' },
        { step: 4, title: 'Download Image', desc: 'Save your generated QR code as a PNG raster image or crisp SVG vector file.' }
      ],
      ko: [
        { step: 1, title: '내용 입력', desc: '연결할 웹사이트 링크(https://...), 와이파이 정보, 또는 텍스트를 입력창에 넣습니다.' },
        { step: 2, title: '디자인 커스텀', desc: '배경색과 QR 코드 색상을 지정합니다. (인식률을 위해 높은 명도 대비 유지 권장)' },
        { step: 3, title: '오류 복원율(ECC) 선택', desc: '사용 환경에 맞춰 복원율(L 7%, M 15%, Q 25%, H 30%)을 선택합니다.' },
        { step: 4, title: '다운로드', desc: '완성된 QR 코드를 웹용 PNG 이미지 또는 인쇄용 SVG 벡터 파일로 다운로드합니다.' }
      ],
      ja: [
        { step: 1, title: '内容を入力', desc: 'アクセス先のURLやWi-Fi情報、テキストを入力欄に貼り付けます。' },
        { step: 2, title: 'カラーのカスタマイズ', desc: 'スキャン認識率を維持するため、背景とコードのコントラスト比を意識して色を設定します。' },
        { step: 3, title: '誤り訂正レベルの選択', desc: '用途に応じて訂正レベル（L: 7%、M: 15%、Q: 25%、H: 30%）を切り替えます。' },
        { step: 4, title: 'ダウンロード', desc: '生成されたQRコードをWeb用のPNG画像または印刷用のSVG形式で保存します。' }
      ]
    },
    example: {
      input: 'URL: https://www.zezelab.xyz, ECC Level: H (High)',
      output: 'Generated 2D Barcode (Version 3, 29x29 matrix, 30% Reed-Solomon redundancy)'
    },
    faq: {
      en: [
        { q: 'What is Error Correction Level (ECC)?', a: 'QR codes use Reed-Solomon error correction. Level H allows the QR code to be scanned successfully even if up to 30% of the symbol is obscured or damaged, which is ideal if you plan to embed a central brand logo.' },
        { q: 'Do generated QR codes ever expire?', a: 'No. These are static QR codes where the actual text/URL is directly encoded into the binary matrix. As long as your destination link is active, the QR code will work permanently.' },
        { q: 'Why won\'t my custom-colored QR code scan?', a: 'Scanners require adequate brightness contrast between dark modules and light backgrounds. Inverted colors (light QR on dark background) or low contrast colors (yellow on white) often fail to read.' }
      ],
      ko: [
        { q: '오류 복원율(ECC)이란 무엇인가요?', a: '리드 솔로몬 오류 정정 알고리즘입니다. H 레벨(30%)로 설정하면 QR 코드 표면의 30%가 찢어지거나 오염되어도 스캔이 가능하며, 가운데에 로고 이미지를 삽입할 때 필수적입니다.' },
        { q: '생성된 QR 코드의 유효기간이 있나요?', a: '전혀 없습니다. 본 도구가 만드는 QR은 외부 서버를 거치지 않고 데이터 자체가 직접 바코드 패턴으로 새겨지는 영구 정적(Static) QR 코드입니다.' },
        { q: '색상을 바꿨더니 스캔이 잘 안 되는 이유는 무엇인가요?', a: '카메라 인식 센서는 명암 차이(Contrast)를 기준으로 모듈을 감지합니다. 배경과 코드의 명도 차이가 작거나, 밝은색 바탕에 밝은 글씨를 쓰면 인식이 실패할 수 있습니다.' }
      ],
      ja: [
        { q: '誤り訂正レベル（ECC）とは何ですか？', a: 'コードの一部が破損したり隠れたりしても読み取りを可能にする冗長化技術です。レベルHでは最大30%の欠損でもデータを復元できます。' },
        { q: '作成したQRコードに有効期限はありますか？', a: '期限はありません。URLや文字データそのものが直接コードに記録される静的QRコードのため、永続的にご利用いただけます。' },
        { q: '色を変更すると読み取れなくなるのはなぜですか？', a: 'スキャナーは明暗差で白黒パターンを判別します。コントラスト比が低い配色や、暗い背景に明るいコードを配置すると読み取りに失敗しやすくなります。' }
      ]
    },
    notes: {
      en: [
        'Generates standard ISO/IEC 18004 compliant QR codes completely within browser canvas.',
        'Zero tracking or redirection: users navigate directly to your destination with full privacy.'
      ],
      ko: [
        'ISO/IEC 18004 국제 표준을 100% 준수하는 호환성 높은 QR 코드를 브라우저에서 직접 생성합니다.',
        '중간 리다이렉트 서버가 개입하지 않는 순수 다이렉트 링크이므로 개인정보가 완벽히 보호됩니다.'
      ],
      ja: [
        'ISO/IEC 18004国際規格に準拠した互換性の高いQRコードをブラウザ内で直接レンダリングします。',
        '中間サーバーを経由しない直接リンク形式のため、トラッキングの心配がなく安全です。'
      ]
    },
    relatedTools: [
      { id: 'url-encoder', name: 'URL Encoder', desc: { en: 'Safely encode query parameters embedded into QR codes.', ko: 'QR 코드에 넣을 복잡한 URL 쿼리스트링을 % 코드로 안전하게 인코딩합니다.', ja: 'QRコードに埋め込むURLパラメータを安全にエンコードします。' }, icon: 'Link' },
      { id: 'color-converter', name: 'Color Converter', desc: { en: 'Find high-contrast palette colors for accessible QR designs.', ko: 'QR 코드의 스캔 인식률을 높여주는 고대비 색상값을 찾습니다.', ja: 'QRコードの視認性を高める高コントラストなカラーコードを取得します。' }, icon: 'Palette' },
      { id: 'image-compressor', name: 'Image Compressor', desc: { en: 'Compress downloaded QR code PNGs for web delivery.', ko: '다운로드한 고해상도 QR 코드 이미지의 파일 용량을 최적화합니다.', ja: 'ダウンロードしたQR画像のファイルサイズを最適化します。' }, icon: 'Image' },
      { id: 'base64-converter', name: 'Base64 Converter', desc: { en: 'Convert generated QR images into Data URIs for inline HTML.', ko: '생성된 QR 코드 이미지를 HTML에 바로 넣을 수 있는 Data URI로 변환합니다.', ja: '生成したQR画像をインライン埋め込み用のData URIへ変換します。' }, icon: 'Binary' }
    ]
  },
  {
    id: 'image-compressor',
    meta: {
      title: {
        en: 'Image Compressor - Compress PNG, JPEG & WebP Online Free',
        ko: '이미지 압축기 - 무손실 웹 이미지 용량 최적화 도구',
        ja: '画像圧縮ツール - PNG、JPEG、WebP無料オンライン軽量化'
      },
      description: {
        en: 'Compress JPEG, PNG, and WebP images up to 80% without noticeable quality loss. Operates completely in your browser memory for total privacy.',
        ko: '웹 업로드용 JPEG, PNG, WebP 이미지 용량을 화질 저하 없이 최대 80% 압축합니다. 모든 처리가 브라우저 로컬에서 이루어져 개인 사진 유출 위험이 없습니다.',
        ja: 'JPEG、PNG、WebP画像を画質を維持したまま最大80%軽量化。完全ブラウザ完結処理のため写真が外部送信されず安全。'
      }
    },
    overview: {
      en: 'Uncompressed image assets are the single largest contributor to slow page load times and poor Core Web Vitals scores (LCP). High-resolution smartphone photos and uncompressed PNG exports from graphic tools routinely exceed several megabytes. This client-side compressor uses HTML5 Canvas and modern browser compression algorithms to strip redundant metadata and re-encode images with customizable quality sliders.',
      ko: '최적화되지 않은 대용량 이미지는 웹사이트 로딩 속도를 떨어뜨리고 구글의 코어 웹 바이탈(Core Web Vitals - LCP) 점수를 깎아먹는 가장 큰 주원인입니다. 스마트폰으로 찍은 원본 사진이나 그래픽 도구에서 추출한 PNG는 수 MB에 달하는 경우가 많습니다. 본 이미지 압축기는 브라우저 내장 Canvas 엔진을 통해 불필요한 메타데이터를 제거하고 화질 손실을 최소화하면서 파일 크기를 획기적으로 줄여줍니다.',
      ja: '最適化されていない巨大な画像ファイルは、Webサイトの表示速度を低下させSEO評価（Core Web Vitals）を損なう主な要因です。スマホ撮影写真やグラフィックツールのPNGは数MB以上になることが一般的です。本ツールはブラウザのCanvas技術を活用し、不要なメタ情報を削除してファイルサイズを劇的に軽量化します。'
    },
    whenToUse: {
      en: [
        { title: 'Web Performance Optimization', desc: 'Shrink hero banners and article thumbnails to improve Google PageSpeed and LCP scores.' },
        { title: 'File Upload Limit Bypassing', desc: 'Compress user avatars or documents that exceed server limits (e.g. strict 2MB or 5MB caps).' },
        { title: 'Email & Messaging Attachments', desc: 'Reduce megabyte-heavy photo attachments for quick sending without hitting mailbox quotas.' },
        { title: 'Format Modernization to WebP', desc: 'Convert legacy heavy PNG/JPEG images into modern, highly compressed WebP formats.' }
      ],
      ko: [
        { title: '웹사이트 로딩 속도(LCP) 개선', desc: '블로그 썸네일이나 메인 히어로 배너 용량을 줄여 구글 PageSpeed 점수를 극대화합니다.' },
        { title: '업로드 용량 한도(2MB/5MB) 통과', desc: '커뮤니티 게시판이나 채용 사이트의 엄격한 파일 첨부 크기 제한에 맞게 사진을 줄입니다.' },
        { title: '이메일 및 메신저 전송 최적화', desc: '수십 MB에 달하는 고해상도 사진을 가볍게 줄여 메일함 용량 초과 없이 신속히 전송합니다.' },
        { title: '차세대 WebP 포맷 변환', desc: '무거운 기존 PNG/JPEG 이미지를 웹 표준 고효율 WebP 규격으로 변환하여 트래픽을 아낍니다.' }
      ],
      ja: [
        { title: 'Webサイト表示速度（LCP）の改善', desc: 'サムネイルやアイキャッチ画像を軽量化し、PageSpeed Insightsのスコアを大幅に改善します。' },
        { title: 'ファイルアップロード制限の回避', desc: '各種フォームや会員サイトの容量制限（例: 2MB以内）に合わせて画像を圧縮します。' },
        { title: 'メール添付サイズの削減', desc: '大容量の撮影写真を軽量化し、送信エラーやメールボックス圧迫を回避します。' },
        { title: 'WebP形式への移行', desc: '従来のJPEGやPNGを、最新の高圧縮WebPフォーマットへ変換してデータ通信量を節約します。' }
      ]
    },
    howToUse: {
      en: [
        { step: 1, title: 'Upload Image', desc: 'Drag and drop your JPEG, PNG, or WebP file into the upload zone or browse from your device.' },
        { step: 2, title: 'Adjust Quality Slider', desc: 'Set the target quality level (0.1 to 1.0; 0.8 is recommended for ideal balance).' },
        { step: 3, title: 'Inspect Reduction', desc: 'Review the instant before-and-after comparison showing saved bytes and percentage reduction.' },
        { step: 4, title: 'Download Compressed File', desc: 'Download the optimized, featherlight image ready for production deployment.' }
      ],
      ko: [
        { step: 1, title: '이미지 업로드', desc: '압축할 JPEG, PNG, WebP 파일을 드래그 앤 드롭하거나 파일 선택 창에서 불러옵니다.' },
        { step: 2, title: '품질 슬라이더 조절', desc: '품질 비율(0.1 ~ 1.0)을 조절합니다. 일반적으로 0.8(80%) 설정 시 시각적 화질 저하 없이 큰 폭으로 압축됩니다.' },
        { step: 3, title: '절감 용량 실시간 확인', desc: '압축 전후의 파일 크기와 절감율(%)을 확인하고 미리보기로 선명도를 점검합니다.' },
        { step: 4, title: '최적화 이미지 다운로드', desc: '가벼워진 고화질 이미지를 즉시 컴퓨터나 스마트폰에 다운로드합니다.' }
      ],
      ja: [
        { step: 1, title: '画像をアップロード', desc: 'JPEG、PNG、WebPファイルをドラッグ＆ドロップまたは選択して読み込みます。' },
        { step: 2, title: '品質スライダーの調整', desc: '圧縮品質（0.1〜1.0）を設定します。通常は0.8（80%）程度が視覚品質と軽さの最適バランスです。' },
        { step: 3, title: '削減率の確認', desc: '圧縮前後のファイルサイズ比較と削減パーセンテージ、プレビュー画質を確認します。' },
        { step: 4, title: 'ダウンロード', desc: '軽量化された画像をワンクリックでダウンロードしてWebや資料に活用します。' }
      ]
    },
    example: {
      input: 'Original: photo_hero.png (4.2 MB, 3840x2160)',
      output: 'Compressed: photo_hero.webp (640 KB, 85% Size Reduction, Visually Lossless)'
    },
    faq: {
      en: [
        { q: 'Are my personal photos uploaded to a cloud server?', a: 'Never. All compression logic executes entirely inside your browser using HTML5 Canvas APIs. Your private images are never sent over the internet.' },
        { q: 'Why is WebP better than PNG or JPEG?', a: 'WebP is a modern image format developed by Google that provides superior lossless and lossy compression. WebP images are typically 25% to 34% smaller than comparable JPEGs at equivalent visual quality.' },
        { q: 'Does compressing remove EXIF metadata?', a: 'Yes. Re-encoding via HTML5 Canvas naturally discards bloated camera metadata (GPS coordinates, camera serial numbers), which further shrinks file size and protects privacy.' }
      ],
      ko: [
        { q: '사진이 외부 클라우드 서버로 업로드되나요?', a: '전혀 업로드되지 않습니다. 모든 이미지 디코딩과 재인코딩은 웹 브라우저의 HTML5 Canvas 메모리에서만 이루어지므로 개인 사진도 100% 안전합니다.' },
        { q: 'WebP 포맷이 기존 JPG/PNG보다 좋은 이유는 무엇인가요?', a: 'WebP는 구글이 개발한 차세대 웹 이미지 규격으로, 동일한 시각적 화질을 유지하면서도 JPEG 대비 약 25~34% 더 작은 파일 크기를 자랑합니다.' },
        { q: '사진에 담긴 촬영 정보(EXIF)도 함께 지워지나요?', a: '네, 브라우저 Canvas를 통해 순수 픽셀 데이터만 재인코딩되므로 촬영 위치(GPS), 카메라 기종 등 불필요한 개인정보 메타데이터가 자동으로 제거되어 프라이버시가 보호됩니다.' }
      ],
      ja: [
        { q: '画像が外部サーバーへ送信・保存されることはありますか？', a: '一切ありません。すべての処理はブラウザのHTML5 Canvas機能によりローカルメモリ内で行われます。' },
        { q: 'WebP形式が推奨される理由は何ですか？', a: 'Googleが開発したWebPは、従来のJPEGやPNGと比べて画質を保ちながら25〜35%ほどファイル容量を削減できる優れた圧縮率を持つためです。' },
        { q: '位置情報などのEXIFデータは削除されますか？', a: 'はい。Canvasを通じた再エンコードにより、GPS位置情報や撮影機器情報などの不要なメタデータが自動的に除去され、プライバシー保護にも寄与します。' }
      ]
    },
    notes: {
      en: [
        'Pure client-side image compression: works completely offline without network consumption.',
        'Supports standard browser-supported image formats: image/jpeg, image/png, and image/webp.'
      ],
      ko: [
        '데이터 네트워크 소모 없이 기기 자체의 연산력으로 구동되는 순수 클라이언트 기반 압축기입니다.',
        'JPEG, PNG, WebP 등 주요 웹 이미지 규격을 폭넓게 지원합니다.'
      ],
      ja: [
        'ネットワーク通信を行わず端末のCPU/GPU性能を活かして動作する完全クライアント型ツールです。',
        '主要なWeb画像フォーマット（JPEG、PNG、WebP）の最適化に対応しています。'
      ]
    },
    relatedTools: [
      { id: 'base64-converter', name: 'Base64 Converter', desc: { en: 'Convert compressed images to Data URIs for inline CSS.', ko: '압축된 이미지를 CSS에 바로 넣을 수 있도록 Base64 Data URI로 변환합니다.', ja: '圧縮後の画像をCSSに埋め込めるBase64 Data URIに変換します。' }, icon: 'Binary' },
      { id: 'color-converter', name: 'Color Converter', desc: { en: 'Inspect dominant palette colors to accompany graphic assets.', ko: '압축한 그래픽 이미지와 어울리는 테마 색상 코드를 추출합니다.', ja: '画像デザインに合わせたテーマカラーのコードを確認します。' }, icon: 'Palette' },
      { id: 'qr-code', name: 'QR Code Generator', desc: { en: 'Generate optimized QR codes to link to hosted image assets.', ko: '최적화된 이미지 에셋 링크를 담은 고품질 QR 코드를 생성합니다.', ja: '最適化した画像へのリンクを埋め込んだQRコードを作成します。' }, icon: 'QrCode' },
      { id: 'markdown-editor', name: 'Markdown Editor', desc: { en: 'Embed lightweight compressed images in markdown READMEs.', ko: '압축하여 가벼워진 이미지 링크를 마크다운 문서에 삽입합니다.', ja: '軽量化した画像をMarkdownドキュメントに埋め込んでプレビューします。' }, icon: 'Edit3' }
    ]
  }
];
