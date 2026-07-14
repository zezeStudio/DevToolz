const fs = require('fs');
const path = require('path');

const tools = [
  { id: 'Base64Converter', name: 'Base64 Converter', category: 'data', desc: 'Encode and decode Base64 strings' },
  { id: 'ChunkingSimulator', name: 'Chunking Simulator', category: 'ai', desc: 'Simulate text chunking for RAG' },
  { id: 'ColorConverter', name: 'Color Converter', category: 'utility', desc: 'Convert colors between HEX, RGB, HSL' },
  { id: 'DiffChecker', name: 'Diff Checker', category: 'text', desc: 'Compare text and code differences' },
  { id: 'FewShotBuilder', name: 'Few-Shot Builder', category: 'ai', desc: 'Build few-shot examples for LLMs' },
  { id: 'FunctionCallingBuilder', name: 'Function Calling Builder', category: 'ai', desc: 'Generate function tools for LLMs' },
  { id: 'HashGenerator', name: 'Hash Generator', category: 'data', desc: 'Generate MD5, SHA-1, SHA-256 hashes' },
  { id: 'ImageCompressor', name: 'Image Compressor', category: 'utility', desc: 'Compress and optimize images' },
  { id: 'JsonFormatter', name: 'JSON Formatter', category: 'utility', desc: 'Format and validate JSON' },
  { id: 'JsonSchemaGenerator', name: 'JSON Schema Generator', category: 'utility', desc: 'Generate JSON schemas' },
  { id: 'JsonToTsConverter', name: 'JSON to TS Converter', category: 'utility', desc: 'Convert JSON to TypeScript interfaces' },
  { id: 'JwtDecoder', name: 'JWT Decoder', category: 'data', desc: 'Decode JSON Web Tokens' },
  { id: 'LlmOptimizer', name: 'LLM Optimizer', category: 'ai', desc: 'Optimize prompts for LLMs' },
  { id: 'LlmParameterPlayground', name: 'LLM Parameter Playground', category: 'ai', desc: 'Experiment with LLM parameters' },
  { id: 'MarkdownEditor', name: 'Markdown Editor', category: 'text', desc: 'Edit and preview Markdown' },
  { id: 'PasswordGenerator', name: 'Password Generator', category: 'utility', desc: 'Generate secure passwords' },
  { id: 'PromptTokenSplitter', name: 'Prompt Token Splitter', category: 'ai', desc: 'Split prompts by tokens' },
  { id: 'PromptVariableInjector', name: 'Prompt Variable Injector', category: 'ai', desc: 'Inject variables into prompts' },
  { id: 'PromptWrapper', name: 'Prompt Wrapper', category: 'ai', desc: 'Wrap text in prompts' },
  { id: 'QrCodeGenerator', name: 'QR Code Generator', category: 'utility', desc: 'Generate QR codes' },
  { id: 'RegexTester', name: 'Regex Tester', category: 'text', desc: 'Test regular expressions' },
  { id: 'SystemPromptGenerator', name: 'System Prompt Generator', category: 'ai', desc: 'Generate system prompts for LLMs' },
  { id: 'TextAnalyzer', name: 'Text Analyzer', category: 'text', desc: 'Analyze text statistics' },
  { id: 'TokenCounter', name: 'Token Counter', category: 'ai', desc: 'Count tokens in text' },
  { id: 'UnixTimestampConverter', name: 'Unix Timestamp Converter', category: 'utility', desc: 'Convert Unix timestamps' },
  { id: 'UrlEncoder', name: 'URL Encoder', category: 'data', desc: 'Encode and decode URLs' },
  { id: 'UuidGenerator', name: 'UUID Generator', category: 'utility', desc: 'Generate UUIDs' },
  { id: 'XmlGuardrailGenerator', name: 'XML Guardrail Generator', category: 'ai', desc: 'Generate XML guardrails for LLMs' }
];

let seoHtml = '<div id="seo-content" style="display:none; visibility:hidden;">\n';
seoHtml += '<h1>DevToolz - Online Developer Utilities</h1>\n';

for (const tool of tools) {
  seoHtml += `<h2>${tool.name}</h2>\n`;
  seoHtml += `<p>${tool.desc}</p>\n`;
  seoHtml += `<h3>자주 묻는 질문 (FAQ)</h3>\n`;
  seoHtml += `<p>Q. ${tool.name} 도구는 어디에 사용되나요?</p>\n`;
  seoHtml += `<p>A. ${tool.name} 도구는 ${tool.desc.toLowerCase()} 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.</p>\n`;
  seoHtml += `<p>Q. ${tool.name} 사용 시 내 데이터는 안전한가요?</p>\n`;
  seoHtml += `<p>A. 네, 안전합니다! ${tool.name}의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.</p>\n`;
  seoHtml += `<h3>실무 활용 사례</h3>\n`;
  seoHtml += `<p>프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 ${tool.desc.toLowerCase()} 작업이 필요할 때 매우 유용합니다.</p>\n`;
  seoHtml += `<p>클라이언트의 민감한 데이터를 다루고 있어 서버 측 도구를 사용할 수 없을 때 안전하게 사용할 수 있습니다.</p>\n`;
}

seoHtml += '</div>\n';

const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

if (indexContent.includes('id="seo-content"')) {
  indexContent = indexContent.replace(/<div id="seo-content"[\s\S]*?<\/div>/, seoHtml);
} else {
  indexContent = indexContent.replace('<body>', '<body>\n    ' + seoHtml);
}

fs.writeFileSync(indexPath, indexContent);
console.log('Injected SEO text into index.html');
