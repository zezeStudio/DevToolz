import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { FileCode2, Copy, CheckCircle2, AlertTriangle, Lightbulb, Info, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function XmlGuardrailGenerator() {
  const { t, i18n } = useTranslation();
  const [taskDescription, setTaskDescription] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [exampleInput, setExampleInput] = useState('');
  const [exampleOutput, setExampleOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const loadSample = () => {
    const lang = i18n.language.startsWith('ko') ? 'ko' : i18n.language.startsWith('ja') ? 'ja' : 'en';
    
    if (lang === 'ko') {
      setTaskDescription('당신은 자연어를 SQL 쿼리로 번역하는 유용한 SQL 어시스턴트입니다.');
      setConstraints('1. SQL 쿼리로만 응답하십시오.\n2. 필요한 경우가 아니면 마크다운 형식을 사용하지 마십시오.\n3. PostgreSQL 규칙을 가정합니다.');
      setOutputFormat('SELECT * FROM users WHERE...');
      setExampleInput('2023년에 가입하고 뉴욕에 거주하는 모든 사용자를 찾아주세요.');
      setExampleOutput("SELECT id, name, email FROM users \nWHERE signup_year = 2023 \nAND city = 'New York';");
    } else if (lang === 'ja') {
      setTaskDescription('あなたは自然言語をSQLクエリに翻訳する便利なSQLアシスタントです。');
      setConstraints('1. SQLクエリでのみ応答してください。\n2. 必要ない限りマークダウン形式を使用しないでください。\n3. PostgreSQLの方言を想定してください。');
      setOutputFormat('SELECT * FROM users WHERE...');
      setExampleInput('2023年にサインアップしてニューヨークに住んでいるすべてのユーザーを見つけてください。');
      setExampleOutput("SELECT id, name, email FROM users \nWHERE signup_year = 2023 \nAND city = 'New York';");
    } else {
      setTaskDescription('You are a helpful SQL assistant that translates natural language to SQL queries.');
      setConstraints('1. Only reply with the SQL query.\n2. Do not use Markdown formatting unless necessary.\n3. Assume PostgreSQL dialect.');
      setOutputFormat('SELECT * FROM users WHERE...');
      setExampleInput('Find all users who signed up in 2023 and live in New York.');
      setExampleOutput("SELECT id, name, email FROM users \nWHERE signup_year = 2023 \nAND city = 'New York';");
    }
  };

  const clearAll = () => {
    setTaskDescription('');
    setConstraints('');
    setOutputFormat('');
    setExampleInput('');
    setExampleOutput('');
  };

  const generateXml = () => {
    return `<system_prompt>
${taskDescription.trim() ? `  <task>
    ${taskDescription}
  </task>
` : ''}
${constraints.trim() ? `  <rules>
${constraints.split('\n').filter(r => r.trim() !== '').map(r => `    <rule>${r}</rule>`).join('\n')}
  </rules>
` : ''}
${outputFormat.trim() ? `  <output_format>
    Please provide the output matching the structure below:
    <![CDATA[
${outputFormat}
    ]]>
  </output_format>
` : ''}
${(exampleInput.trim() || exampleOutput.trim()) ? `  <example>
${exampleInput.trim() ? `    <input>
      <![CDATA[
${exampleInput}
      ]]>
    </input>` : ''}
${exampleOutput.trim() ? `    <output>
      <![CDATA[
${exampleOutput}
      ]]>
    </output>` : ''}
  </example>
` : ''}</system_prompt>`.replace(/\n\n+/g, '\n\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateXml());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const guideText = {
    ko: {
      title: 'XML 가드레일 작성 가이드 및 팁',
      items: [
        { title: "대칭형 Few-Shot 구조 생성", desc: "정교한 지시 제어를 위해 Input과 Output 태그가 대칭으로 생성됩니다. 이 완벽한 대칭 페어링을 통해 모델은 답변의 포맷과 톤앤매너를 훨씬 더 강력하게 모방합니다." },
        { title: "왜 JSON이나 일반 텍스트 대신 XML인가요?", desc: "Claude XML prompt structure는 모델이 지시사항의 경계를 완벽하게 인식하게 합니다. <system_prompt> 나 <rules> 처럼 명확한 태그를 사용하면 프롬프트 주입(Prompt Injection) 공격 방어에 탁월한 효과를 보입니다." },
        { title: "CDATA 섹션의 중요성", desc: "<![CDATA[ ... ]]> 스코프는 입력 데이터 내부에 예기치 않은 JSON escape character strings나 꺾쇠(<, >)가 포함되어 있더라도 XML 파싱 에러를 일으키지 않고 원시 데이터(Raw Data)로 안전하게 보호해 줍니다." },
      ]
    },
    en: {
      title: 'XML Guardrail Best Practices & Tips',
      items: [
        { title: "Symmetric Few-Shot Generation", desc: "For precise instruction control, the Input and Output tags are generated symmetrically. This perfect symmetric pairing strongly encourages the model to mimic the formatting and tone of the expected output." },
        { title: "Why use Claude XML prompt structure?", desc: "Modern LLMs, especially Claude, are heavily trained on XML structures. Using clear tags like <system_prompt> establishes strict boundaries for instructions and defends against prompt injection attacks." },
        { title: "The Importance of CDATA", desc: "The <![CDATA[ ... ]]> scope ensures that even if your input contains unescaped JSON escape character strings or brackets (<, >), they won't break the XML parsing. It safely treats the content as raw string data." },
      ]
    },
    ja: {
      title: 'XMLガードレール作成ガイドとヒント',
      items: [
        { title: "対称的なFew-Shot構造の生成", desc: "精巧な指示制御のために、InputタグとOutputタグが対称に生成されます。この完全な対称ペアリングにより、モデルは回答のフォーマットとトーンをより強力に模倣します。" },
        { title: "なぜJSONではなくClaude XML prompt structureなのか？", desc: "Claudeなどの最新LLMはXMLタグ構造に深く晒されており、<system_prompt>のような明確なタグを使用すると、モデルにIn-Context Learningの効果を最大化させ、プロンプトインジェクション(Prompt Injection)攻撃を防御します。" },
        { title: "CDATAセクションの重要性", desc: "<![CDATA[ ... ]]> スコープは、入力データ内にJSON escape character stringsや特殊文字（<, >）が含まれていても、XML解析エラーを引き起こすことなく生データ（Raw Data）として安全に保護します。" },
      ]
    }
  };

  const lang = i18n.language.startsWith('ko') ? 'ko' : i18n.language.startsWith('ja') ? 'ja' : 'en';
  const currentGuide = guideText[lang as 'ko'|'en'|'ja'];

  return (
    <>
      <SEO 
        title={t('xmlGuardrail.pageTitle') || 'XML Guardrail Generator | DevToolz'}
        description={t('xmlGuardrail.subtitle') || 'Instantly generate Claude/GPT-optimized XML system prompts.'}
        url={`/${i18n.language}/xml-guardrail-generator`}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-teal-500/10 dark:bg-teal-400/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 mb-4 relative">
            <div className="p-3 bg-teal-500/10 dark:bg-teal-400/10 rounded-xl flex-shrink-0">
              <FileCode2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('xmlGuardrail.title') || 'XML Guardrail Generator'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 mb-4 text-lg">
                {t('xmlGuardrail.subtitle') || 'Instantly generate Claude/GPT-optimized XML system prompts.'}
              </p>
              <div className="flex items-center space-x-2">
                <button onClick={loadSample} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-200 dark:border-slate-800">
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('xmlGuardrail.loadSample') || 'Load Sample'}</span>
                </button>
                <button onClick={clearAll} className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg transition-colors text-sm font-medium border border-rose-100 dark:border-rose-500/20">
                  <Trash2 className="w-4 h-4" />
                  <span>{t('xmlGuardrail.clearAll') || 'Clear All'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('xmlGuardrail.descLabel') || 'Task / Role Description'}
                </label>
                <textarea 
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={2}
                  className="w-full dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white leading-relaxed bg-slate-50 dark:bg-slate-900"
                  placeholder={t('xmlGuardrail.descPlaceholder') || "e.g. You are a senior software engineer reviewing code."}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{t('xmlGuardrail.constraintsLabel') || 'Constraints / Rules (One per line)'}</span>
                </label>
                <textarea 
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={4}
                  className="w-full dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white font-mono leading-relaxed bg-slate-50 dark:bg-slate-900"
                  placeholder={t('xmlGuardrail.constraintsPlaceholder') || "1. Do not hallucinate.\n2. Return only JSON."}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('xmlGuardrail.outputLabel') || 'Expected Output Format (JSON, XML, Text)'}
                </label>
                <textarea 
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  rows={5}
                  className="w-full dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white font-mono leading-relaxed bg-slate-50 dark:bg-slate-900"
                  placeholder={t('xmlGuardrail.outputPlaceholder') || '{\n  "key": "value"\n}'}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>{t('xmlGuardrail.exampleLabel') || 'Example Input (Context)'}</span>
                </label>
                <textarea 
                  value={exampleInput}
                  onChange={(e) => setExampleInput(e.target.value)}
                  rows={3}
                  className="w-full dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white font-mono leading-relaxed bg-slate-50 dark:bg-slate-900"
                  placeholder={t('xmlGuardrail.examplePlaceholder') || "Insert sample user context here"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('xmlGuardrail.exampleOutputLabel') || 'Example Output (Expected)'}
                </label>
                <textarea 
                  value={exampleOutput}
                  onChange={(e) => setExampleOutput(e.target.value)}
                  rows={3}
                  className="w-full dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white font-mono leading-relaxed bg-slate-50 dark:bg-slate-900"
                  placeholder={t('xmlGuardrail.exampleOutputPlaceholder') || "e.g., { \"status\": \"error\", \"message\": \"Hardware issue\" }"}
                />
              </div>

            </div>
          </div>

          {/* Output XML */}
          <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden h-[600px] lg:h-auto">
            <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-slate-200 flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-teal-400" />
                <span>Generated Guardrail XML</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded-lg transition-colors text-sm font-medium"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy XML'}</span>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <pre className="text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre" style={{ tabSize: 2 }}>
                <code>
                  {generateXml()}
                </code>
              </pre>
            </div>
          </div>

        </div>
        
        <section className="mt-8 bg-teal-50 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800/50 rounded-xl p-6">
          <h2 className="flex items-center space-x-2 font-bold text-teal-800 dark:text-teal-400 mb-4 text-lg">
            <Info className="w-6 h-6" />
            <span>{currentGuide.title}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentGuide.items.map((item, idx) => (
              <article key={idx} className="bg-white/60 dark:bg-slate-800/50 border border-teal-100 dark:border-teal-900/30 rounded-lg p-4">
                <h3 className="font-semibold text-teal-900 dark:text-teal-300 mb-2">{item.title}</h3>
                <p className="text-sm text-teal-800/80 dark:text-teal-200/70 leading-relaxed">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
