import { 
  Code2, 
  Binary, 
  Link as LinkIcon, 
  FileJson, 
  Palette, 
  Type, 
  FileText, 
  Key, 
  Fingerprint, 
  Hash, 
  Clock, 
  QrCode, 
  Search, 
  FileDiff, 
  Image as ImageIcon, 
  Bot, 
  Terminal, 
  Braces, 
  Layers, 
  BookOpen,
  LucideIcon
} from 'lucide-react';

export type ToolCategory = 'ai' | 'developer' | 'text' | 'design' | 'security' | 'blog';

export interface SearchableTool {
  id: string;
  path: string; // e.g. 'json-formatter' (without leading slash or lang prefix)
  icon: LucideIcon;
  category: ToolCategory;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  name: {
    en: string;
    ko: string;
    ja: string;
  };
  description: {
    en: string;
    ko: string;
    ja: string;
  };
  keywords: string[];
  isPopular?: boolean;
}

export const SEARCHABLE_TOOLS: SearchableTool[] = [
  // --- AI Utilities ---
  {
    id: 'function-calling-builder',
    path: 'function-calling-builder',
    icon: Bot,
    category: 'ai',
    colorClass: 'bg-indigo-500 text-white',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    badgeText: 'AI Tool',
    name: {
      en: 'Function Calling Payload Builder',
      ko: '함수 호출 페이로드 빌더 (Function Calling)',
      ja: 'Function Calling ペイロードビルダー'
    },
    description: {
      en: 'Visually build tool definitions and function calling schemas for OpenAI, Anthropic Claude, and Gemini.',
      ko: 'OpenAI, Anthropic Claude, Gemini용 함수 호출 및 도구 스키마를 시각적으로 생성합니다.',
      ja: 'OpenAI、Anthropic Claude、Gemini向けの関数呼び出しツール定義を視覚的に生成します。'
    },
    keywords: ['function', 'calling', 'tools', 'openai', 'gemini', 'anthropic', 'claude', 'agent', 'schema', 'payload', '함수', '도구', '에이전트'],
    isPopular: true
  },
  {
    id: 'token-counter',
    path: 'token-counter',
    icon: Terminal,
    category: 'ai',
    colorClass: 'bg-teal-600 text-white',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    badgeText: 'AI Tool',
    name: {
      en: 'AI Token Counter & Cost Calculator',
      ko: 'AI 토큰 계산기 및 비용 예측기',
      ja: 'AIトークン計算機・コスト見積もり'
    },
    description: {
      en: 'Calculate prompt tokens for GPT-4o, Claude 3.5, and Gemini models with real-time pricing estimates.',
      ko: 'GPT-4o, Claude 3.5, Gemini 모델의 프롬프트 토큰 수와 예상 API 비용을 실시간 계산합니다.',
      ja: 'GPT-4o、Claude 3.5、Geminiのプロンプトトークン数とAPI利用コストを瞬時に計算します。'
    },
    keywords: ['token', 'counter', 'tiktoken', 'gpt-4o', 'claude', 'gemini', 'cost', 'pricing', 'api', '토큰', '비용', '계산기', 'トークン'],
    isPopular: true
  },
  {
    id: 'json-schema-generator',
    path: 'json-schema-generator',
    icon: Bot,
    category: 'ai',
    colorClass: 'bg-teal-500 text-white',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    badgeText: 'AI Tool',
    name: {
      en: 'JSON Schema Generator',
      ko: 'JSON 스키마 생성기',
      ja: 'JSONスキーマジェネレーター'
    },
    description: {
      en: 'Generate strict Draft-07 JSON Schemas for OpenAI and Gemini Structured Outputs from sample JSON.',
      ko: '샘플 JSON 데이터로부터 OpenAI 및 Gemini 구조화 출력용 JSON Schema를 자동 생성합니다.',
      ja: 'サンプルJSONからOpenAIおよびGeminiの構造化出力用JSONスキーマを自動作成します。'
    },
    keywords: ['json schema', 'schema', 'openai', 'gemini', 'structured outputs', 'validation', '스키마', '구조화', 'スキーマ']
  },
  {
    id: 'json-to-ts',
    path: 'json-to-ts',
    icon: Code2,
    category: 'ai',
    colorClass: 'bg-emerald-600 text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    badgeText: 'AI Tool',
    name: {
      en: 'JSON to TypeScript Converter',
      ko: 'JSON to TypeScript 인터페이스 변환기',
      ja: 'JSON to TypeScript 型定義変換'
    },
    description: {
      en: 'Convert arbitrary JSON payloads into clean, typed TypeScript interfaces and types.',
      ko: '임의의 JSON 객체를 깔끔한 TypeScript 인터페이스 및 타입 정의로 즉시 변환합니다.',
      ja: '任意のJSONオブジェクトをクリーンなTypeScriptインターフェース・型定義に変換します。'
    },
    keywords: ['json to ts', 'typescript', 'types', 'interface', 'converter', '타입스크립트', '인터페이스', '型定義'],
    isPopular: true
  },
  {
    id: 'llm-optimizer',
    path: 'llm-optimizer',
    icon: Bot,
    category: 'ai',
    colorClass: 'bg-blue-600 text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    badgeText: 'AI Tool',
    name: {
      en: 'LLM Context Optimizer',
      ko: 'LLM 컨텍스트 압축 및 최적화기',
      ja: 'LLMコンテキストオプティマイザー'
    },
    description: {
      en: 'Compress codebases and text files into token-efficient Markdown representations for LLM prompts.',
      ko: '여러 소스코드 및 문서 파일을 토큰 효율적인 단일 마크다운 포맷으로 병합 및 압축합니다.',
      ja: '複数のコードファイルやテキストをトークン節約型のMarkdownに圧縮・整形します。'
    },
    keywords: ['llm optimizer', 'compress', 'context window', 'tokens', 'markdown', 'bundle', '최적화', '압축']
  },
  {
    id: 'prompt-wrapper',
    path: 'prompt-wrapper',
    icon: Braces,
    category: 'ai',
    colorClass: 'bg-indigo-600 text-white',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    badgeText: 'AI Tool',
    name: {
      en: 'Prompt Wrapper & XML Tag Formatter',
      ko: '프롬프트 래퍼 & XML 태그 포매터',
      ja: 'プロンプトラッパー & XMLタグ整形'
    },
    description: {
      en: 'Structure complex LLM instructions cleanly using XML tags to minimize hallucinations and confusion.',
      ko: 'Claude 및 LLM 프롬프트를 XML 태그로 구조화하여 모델의 환각을 방지하고 정확도를 높입니다.',
      ja: 'XMLタグを使用してプロンプトを構造化し、ハルシネーションを抑制します。'
    },
    keywords: ['prompt wrapper', 'xml tags', 'claude prompt', 'formatting', '프롬프트', '태그', 'プロンプト']
  },
  {
    id: 'chunking-simulator',
    path: 'chunking-simulator',
    icon: Layers,
    category: 'ai',
    colorClass: 'bg-rose-600 text-white',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    badgeText: 'AI Tool',
    name: {
      en: 'RAG Text Chunking Simulator',
      ko: 'RAG 텍스트 청킹 시뮬레이터',
      ja: 'RAG テキストチャンキングシミュレーター'
    },
    description: {
      en: 'Simulate vector embedding chunk sizes, overlaps, and token boundaries visually for RAG pipelines.',
      ko: 'RAG 파이프라인의 벡터 임베딩 청크 크기와 오버랩 경계를 시각적으로 테스트합니다.',
      ja: 'RAGパイプライン向けにテキスト分割（チャンクサイズ・オーバーラップ）を視覚化します。'
    },
    keywords: ['chunking', 'rag', 'vector', 'embedding', 'overlap', 'tokens', '청킹', '임베딩', 'チャンク']
  },
  {
    id: 'system-prompt',
    path: 'system-prompt',
    icon: Terminal,
    category: 'ai',
    colorClass: 'bg-amber-600 text-white',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    badgeText: 'AI Tool',
    name: {
      en: 'System Prompt Generator',
      ko: '시스템 프롬프트 생성기',
      ja: 'システムプロンプトジェネレーター'
    },
    description: {
      en: 'Generate battle-tested persona and role-based system prompts enforcing strict JSON output.',
      ko: '엄격한 JSON 응답과 특정 페르소나를 강제하는 신뢰성 높은 시스템 프롬프트를 생성합니다.',
      ja: '厳密なJSON出力やペルソナを設定するシステムプロンプトを自動生成します。'
    },
    keywords: ['system prompt', 'persona', 'instructions', 'json guard', '시스템 프롬프트', 'ペルソナ']
  },
  {
    id: 'prompt-variable-injector',
    path: 'prompt-variable-injector',
    icon: Terminal,
    category: 'ai',
    colorClass: 'bg-rose-500 text-white',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    badgeText: 'AI Tool',
    name: {
      en: 'Prompt Variable Injector',
      ko: '프롬프트 변수 주입기 (템플릿)',
      ja: 'プロンプト変数インジェクター'
    },
    description: {
      en: 'Inject variables into prompt templates dynamically using mustache-style {{variable}} syntax.',
      ko: '{{variable}} 문법을 사용하여 프롬프트 템플릿에 동적 파라미터를 손쉽게 치환합니다.',
      ja: '{{変数}}形式でプロンプトテンプレートに変数を動的注入・置換します。'
    },
    keywords: ['variable injector', 'prompt template', 'mustache', 'parameters', '변수 주입', '템플릿', '変数']
  },
  {
    id: 'prompt-token-splitter',
    path: 'prompt-token-splitter',
    icon: Layers,
    category: 'ai',
    colorClass: 'bg-purple-500 text-white',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    badgeText: 'AI Tool',
    name: {
      en: 'Prompt Token Splitter',
      ko: '프롬프트 토큰 분할기',
      ja: 'プロンプトトークン分割ツール'
    },
    description: {
      en: 'Split oversized documents into smaller token-budgeted chunks to fit within LLM context windows.',
      ko: 'LLM 컨텍스트 한도를 초과하는 긴 문서를 토큰 예산에 맞춰 여러 파트로 균등 분할합니다.',
      ja: 'LLMのコンテキスト制限内に収まるように長文をトークン数に応じて分割します。'
    },
    keywords: ['token splitter', 'chunk', 'split prompt', 'context window', '분할기', '토큰 분할', '分割']
  },
  {
    id: 'llm-parameter-playground',
    path: 'llm-parameter-playground',
    icon: Layers,
    category: 'ai',
    colorClass: 'bg-blue-500 text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    badgeText: 'AI Tool',
    name: {
      en: 'LLM Parameter Playground',
      ko: 'LLM 파라미터 플레이그라운드',
      ja: 'LLMパラメータプレイグラウンド'
    },
    description: {
      en: 'Interactive visual guide to Temperature, Top-P, Presence Penalty, and Frequency Penalty.',
      ko: 'Temperature, Top-P, Presence Penalty 등 LLM 생성 파라미터의 작동 원리를 시각적으로 체험합니다.',
      ja: 'Temperature、Top-PなどのLLMパラメーターの違いを視覚的に理解できるシミュレーター。'
    },
    keywords: ['parameter playground', 'temperature', 'top p', 'frequency penalty', '파라미터', '플레이그라운드', 'パラメータ']
  },
  {
    id: 'xml-guardrail-generator',
    path: 'xml-guardrail-generator',
    icon: Terminal,
    category: 'ai',
    colorClass: 'bg-teal-500 text-white',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    badgeText: 'AI Tool',
    name: {
      en: 'XML Guardrail Generator',
      ko: 'XML 가드레일 생성기',
      ja: 'XMLガードレールジェネレーター'
    },
    description: {
      en: 'Generate bulletproof XML guardrail constraints to prevent prompt injection and role leakage.',
      ko: '프롬프트 인젝션 및 역할 탈취를 방어하기 위한 강력한 XML 가드레일 지침을 생성합니다.',
      ja: 'プロンプトインジェクション防止のためのXMLガードレール制約文を生成します。'
    },
    keywords: ['guardrail', 'xml guardrail', 'prompt injection', 'security', '가드레일', '보안', 'ガードレール']
  },
  {
    id: 'few-shot-builder',
    path: 'few-shot-builder',
    icon: Layers,
    category: 'ai',
    colorClass: 'bg-orange-500 text-white',
    badgeBg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    badgeText: 'AI Tool',
    name: {
      en: 'Few-Shot Example Builder',
      ko: '퓨샷 예시 빌더 (Few-Shot Builder)',
      ja: 'Few-Shot 例文ビルダー'
    },
    description: {
      en: 'Construct formatted few-shot input/output examples in JSON or XML for in-context learning.',
      ko: 'In-Context 러닝을 위한 표준화된 Few-Shot 입출력 예시 쌍을 손쉽게 구성합니다.',
      ja: '高精度なLLM推論のためのFew-Shot入出力サンプルをフォーマット整形して作成します。'
    },
    keywords: ['few shot', 'in-context learning', 'examples', 'prompting', '퓨샷', '예시', 'ショット']
  },

  // --- Developer Tools ---
  {
    id: 'json-formatter',
    path: 'json-formatter',
    icon: Code2,
    category: 'developer',
    colorClass: 'bg-emerald-500 text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    badgeText: 'Developer',
    name: {
      en: 'JSON Formatter & Validator',
      ko: 'JSON 포매터 & 문법 검사기',
      ja: 'JSON整形・検証ツール'
    },
    description: {
      en: 'Beautify minified JSON, validate syntax with exact error line pointers, and minify payloads securely.',
      ko: '한 줄로 압축된 JSON을 들여쓰기 정렬하고 문법 오류 위치를 즉시 찾아주는 무료 웹 도구입니다.',
      ja: '圧縮されたJSONを瞬時にインデント整形し、構文エラー箇所をハイライトします。'
    },
    keywords: ['json', 'format', 'beautify', 'minify', 'validator', 'parse', 'prettify', 'syntax', '포맷', '정렬', '검사', '整形', '検証'],
    isPopular: true
  },
  {
    id: 'base64-converter',
    path: 'base64-converter',
    icon: Binary,
    category: 'developer',
    colorClass: 'bg-slate-800 dark:bg-slate-700 text-white',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    badgeText: 'Developer',
    name: {
      en: 'Base64 Encoder & Decoder',
      ko: 'Base64 인코더 & 디코더',
      ja: 'Base64エンコード・デコード'
    },
    description: {
      en: 'Encode plain text or binary data into Base64 and decode Base64 strings with UTF-8 support.',
      ko: '일반 텍스트와 바이너리를 Base64로 인코딩하거나 Base64 문자열을 UTF-8로 완벽하게 디코딩합니다.',
      ja: 'プレーンテキストやバイナリをBase64にエンコード、および相互デコードします。'
    },
    keywords: ['base64', 'encode', 'decode', 'utf-8', 'binary', 'ascii', '인코딩', '디코딩', 'エンコード', 'デコード'],
    isPopular: true
  },
  {
    id: 'url-encoder',
    path: 'url-encoder',
    icon: LinkIcon,
    category: 'developer',
    colorClass: 'bg-indigo-500 text-white',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    badgeText: 'Developer',
    name: {
      en: 'URL Encoder & Decoder',
      ko: 'URL 인코더 & 디코더',
      ja: 'URLエンコード・デコード'
    },
    description: {
      en: 'Percent-encode special characters in URLs or query strings, and decode encoded URLs instantly.',
      ko: 'URL 및 쿼리 파라미터의 특수문자를 퍼센트 인코딩하거나 역으로 디코딩합니다.',
      ja: 'URLやクエリパラメータの特殊文字をパーセントエンコード・デコードします。'
    },
    keywords: ['url', 'uri', 'percent encoding', 'query params', 'encode', 'decode', '인코더', '디코더', 'URLエンコード']
  },
  {
    id: 'jwt-decoder',
    path: 'jwt-decoder',
    icon: FileJson,
    category: 'developer',
    colorClass: 'bg-teal-500 text-white',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    badgeText: 'Developer',
    name: {
      en: 'JWT Decoder & Claims Inspector',
      ko: 'JWT 디코더 & 클레임 분석기',
      ja: 'JWTデコーダー・クレーム検証'
    },
    description: {
      en: 'Inspect JSON Web Token headers, payload claims, and expiration timestamps safely in your browser.',
      ko: 'JSON Web Token(JWT)의 Header, Payload 클레임과 토큰 만료 일시(exp)를 브라우저에서 안전하게 분석합니다.',
      ja: 'JWTトークンのヘッダー、ペイロード、有効期限を外部通信なしでローカル解析します。'
    },
    keywords: ['jwt', 'token', 'json web token', 'claims', 'auth', 'bearer', 'exp', '토큰', '디코더', '認証'],
    isPopular: true
  },
  {
    id: 'uuid-generator',
    path: 'uuid-generator',
    icon: Fingerprint,
    category: 'developer',
    colorClass: 'bg-indigo-600 text-white',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    badgeText: 'Developer',
    name: {
      en: 'UUID / GUID Generator',
      ko: 'UUID / GUID 생성기',
      ja: 'UUID / GUID 生成ツール'
    },
    description: {
      en: 'Generate cryptographically random UUID v4 / GUID strings in bulk with custom casing and hyphens.',
      ko: '암호학적으로 안전한 무작위 UUID v4 / GUID 문자열을 대량으로 즉시 생성합니다.',
      ja: 'RFC準拠の暗号学的に安全なUUID v4を一括生成します。'
    },
    keywords: ['uuid', 'guid', 'v4', 'random id', 'unique identifier', '생성기', '고유값', '生成']
  },
  {
    id: 'unix-timestamp',
    path: 'unix-timestamp',
    icon: Clock,
    category: 'developer',
    colorClass: 'bg-cyan-600 text-white',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    badgeText: 'Developer',
    name: {
      en: 'Unix Timestamp Converter',
      ko: '유닉스 타임스탬프 변환기',
      ja: 'UNIXタイムスタンプ変換'
    },
    description: {
      en: 'Convert Epoch timestamps (seconds/milliseconds) to human-readable dates and local timezone strings.',
      ko: '초/밀리초 단위 유닉스 에포크 타임스탬프를 사람이 읽을 수 있는 현지 일시로 양방향 변환합니다.',
      ja: 'UNIXエポック時刻（秒/ミリ秒）を人間が読める日時形式に相互変換します。'
    },
    keywords: ['unix', 'timestamp', 'epoch', 'time', 'date', 'utc', 'timezone', '타임스탬프', '에포크', '時間']
  },
  {
    id: 'regex-tester',
    path: 'regex-tester',
    icon: Search,
    category: 'developer',
    colorClass: 'bg-slate-800 dark:bg-slate-700 text-white',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    badgeText: 'Developer',
    name: {
      en: 'Regex Tester & Debugger',
      ko: '정규표현식 테스터 & 디버거',
      ja: '正規表現テスター・デバッガー'
    },
    description: {
      en: 'Test regular expressions in real-time with live capture group matching, match explanation, and flags.',
      ko: '정규표현식을 실시간으로 테스트하고 캡처 그룹 매칭 결과 및 플래그를 즉각 검증합니다.',
      ja: '正規表現をリアルタイムでテストし、キャプチャグループや一致箇所を可視化します。'
    },
    keywords: ['regex', 'regular expression', 'pattern', 'test', 'matcher', 'groups', '정규식', '정규표현식', '正規表現'],
    isPopular: true
  },
  {
    id: 'diff-checker',
    path: 'diff-checker',
    icon: FileDiff,
    category: 'developer',
    colorClass: 'bg-emerald-600 text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    badgeText: 'Developer',
    name: {
      en: 'Text & Code Diff Checker',
      ko: '텍스트 & 코드 차이 비교기 (Diff Checker)',
      ja: 'テキスト・コード差分チェッカー'
    },
    description: {
      en: 'Compare two text or code snippets line-by-line with inline additions, deletions, and side-by-side view.',
      ko: '두 개의 텍스트나 소스코드를 한 줄씩 비교하여 추가/삭제/변경 내역을 시각적으로 강조합니다.',
      ja: '2つのテキストやコードの差分を行単位・文字単位でハイライト比較します。'
    },
    keywords: ['diff', 'compare', 'difference', 'git diff', 'comparison', '코드 비교', '차이점', '差分', '比較']
  },

  // --- Text & Formatting ---
  {
    id: 'text-analyzer',
    path: 'text-analyzer',
    icon: Type,
    category: 'text',
    colorClass: 'bg-purple-500 text-white',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    badgeText: 'Text & Content',
    name: {
      en: 'Text Analyzer & Word Counter',
      ko: '글자수 세기 & 텍스트 분석기',
      ja: '文字数カウント・テキスト分析'
    },
    description: {
      en: 'Count characters (with/without spaces), words, sentences, reading time, and byte length instantly.',
      ko: '공백 포함/제외 글자 수, 단어 수, 문장 수, 예상 읽기 시간, 바이트(byte) 크기를 실시간 측정합니다.',
      ja: '文字数（空白あり/なし）、単語数、行数、バイト数、読了時間を瞬時に計算します。'
    },
    keywords: ['text', 'counter', 'character count', 'word count', 'bytes', 'reading time', '글자수', '단어수', '글자수 세기', '文字数']
  },
  {
    id: 'markdown-editor',
    path: 'markdown-editor',
    icon: FileText,
    category: 'text',
    colorClass: 'bg-slate-700 text-white',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    badgeText: 'Text & Content',
    name: {
      en: 'Markdown Live Editor & Previewer',
      ko: '마크다운 실시간 에디터 & 미리보기',
      ja: 'Markdown リアルタイムエディター'
    },
    description: {
      en: 'Write and preview GitHub-flavored Markdown (GFM) with live split-screen rendering and HTML export.',
      ko: 'GitHub 스타일 마크다운(GFM)을 실시간 분할 화면으로 작성하고 HTML로 내보낼 수 있습니다.',
      ja: 'GitHub Flavored Markdownをリアルタイムプレビューしながら編集できるツール。'
    },
    keywords: ['markdown', 'editor', 'gfm', 'preview', 'html', 'wysiwyg', '마크다운', '에디터', '미리보기', 'マークダウン']
  },

  // --- Design & Security ---
  {
    id: 'color-converter',
    path: 'color-converter',
    icon: Palette,
    category: 'design',
    colorClass: 'bg-pink-500 text-white',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    badgeText: 'Design',
    name: {
      en: 'Color Code Converter (HEX, RGB, HSL)',
      ko: '컬러 코드 변환기 (HEX, RGB, HSL)',
      ja: 'カラーコード変換ツール'
    },
    description: {
      en: 'Convert between HEX, RGB, HSL, and CSS color values with visual color preview and palette picking.',
      ko: 'HEX, RGB, HSL 등 다양한 색상 표기법을 상호 변환하고 CSS 컬러 코드를 복사합니다.',
      ja: 'HEX、RGB、HSLなどのカラーコードを相互変換し、CSS用コードをコピーします。'
    },
    keywords: ['color', 'hex', 'rgb', 'hsl', 'css', 'palette', 'picker', '색상', '컬러', 'カラーコード']
  },
  {
    id: 'qr-code',
    path: 'qr-code',
    icon: QrCode,
    category: 'design',
    colorClass: 'bg-yellow-500 text-white',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    badgeText: 'Design',
    name: {
      en: 'QR Code Generator',
      ko: 'QR 코드 생성기',
      ja: 'QRコード作成ツール'
    },
    description: {
      en: 'Generate high-resolution custom QR codes for URLs, text, Wi-Fi networks, and contact cards.',
      ko: 'URL, 일반 텍스트, Wi-Fi 접속 정보 등을 담은 고해상도 QR 코드를 손쉽게 생성하고 다운로드합니다.',
      ja: 'URLやテキスト、Wi-Fi接続用の高解像度QRコードを即座に作成・ダウンロードできます。'
    },
    keywords: ['qr', 'qr code', 'barcode', 'wifi qr', 'generator', 'scan', '큐알코드', 'QR코드', 'QRコード']
  },
  {
    id: 'image-compressor',
    path: 'image-compressor',
    icon: ImageIcon,
    category: 'design',
    colorClass: 'bg-rose-500 text-white',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    badgeText: 'Design',
    name: {
      en: 'Image Compressor & Optimizer',
      ko: '이미지 압축 & 용량 최적화기',
      ja: '画像圧縮・軽量化ツール'
    },
    description: {
      en: 'Compress and resize JPEG, PNG, and WebP images client-side without quality loss or server uploads.',
      ko: '브라우저에서 100% 로컬로 JPG, PNG, WebP 이미지 용량을 화질 저하 없이 압축합니다.',
      ja: 'ブラウザ上でサーバー通信なしで画像ファイルを軽量化・圧縮します。'
    },
    keywords: ['image', 'compress', 'optimize', 'png', 'jpg', 'webp', 'resize', '이미지 압축', '용량 줄이기', '画像圧縮']
  },
  {
    id: 'password-generator',
    path: 'password-generator',
    icon: Key,
    category: 'security',
    colorClass: 'bg-emerald-600 text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    badgeText: 'Security',
    name: {
      en: 'Strong Password Generator',
      ko: '안전한 비밀번호 생성기',
      ja: '強力なパスワード自動生成'
    },
    description: {
      en: 'Generate cryptographically strong, uncrackable passwords with customizable length and symbol rules.',
      ko: '길이와 문자 조합(대소문자, 숫자, 특수문자)을 자유롭게 조절하여 강력한 비밀번호를 생성합니다.',
      ja: '暗号学的に安全なランダムパスワードをワンクリックで生成します。'
    },
    keywords: ['password', 'security', 'generator', 'crypto', 'random', '비밀번호', '암호', 'パスワード']
  },
  {
    id: 'hash-generator',
    path: 'hash-generator',
    icon: Hash,
    category: 'security',
    colorClass: 'bg-red-500 text-white',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    badgeText: 'Security',
    name: {
      en: 'Hash Generator (MD5, SHA-256, SHA-512)',
      ko: '해시 생성기 (MD5, SHA-256, SHA-512)',
      ja: 'ハッシュ値生成 (MD5, SHA-256)'
    },
    description: {
      en: 'Compute cryptographic hashes including MD5, SHA-1, SHA-256, SHA-512 for text and checksums.',
      ko: '텍스트나 파일의 무결성 검증을 위한 MD5, SHA-1, SHA-256, SHA-512 암호화 해시값을 계산합니다.',
      ja: 'MD5、SHA-1、SHA-256、SHA-512などの暗号化ハッシュを瞬時に算出します。'
    },
    keywords: ['hash', 'md5', 'sha256', 'sha512', 'sha1', 'crypto', 'checksum', '해시', '체크섬', 'ハッシュ']
  },

  // --- Tech Blog & Guides ---
  {
    id: 'blog',
    path: 'blog',
    icon: BookOpen,
    category: 'blog',
    colorClass: 'bg-blue-600 text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    badgeText: 'Article & Guide',
    name: {
      en: 'Tech Blog & Developer Guides',
      ko: '기술 블로그 & 개발자 가이드',
      ja: '技術ブログ・開発者ガイド'
    },
    description: {
      en: 'In-depth articles, tutorials, and security best practices for web development and AI engineering.',
      ko: '웹 개발, API 설계, AI 엔지니어링 및 보안 모범 사례를 다룬 심층 기술 아티클 모음입니다.',
      ja: 'Web開発やAIエンジニアリング、セキュリティのベストプラクティスを解説した技術記事。'
    },
    keywords: ['blog', 'articles', 'guide', 'tutorial', 'docs', '블로그', '가이드', '튜토리얼', 'ブログ']
  }
];
