import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { ListPlus, Copy, CheckCircle2, Plus, Trash2, ArrowRight, RefreshCw, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface Example {
  input: string;
  output: string;
}

export function FewShotBuilder() {
  const { t, i18n } = useTranslation();
  const [examples, setExamples] = useState<Example[]>([
    { input: '', output: '' }
  ]);
  const [format, setFormat] = useState<'markdown' | 'xml' | 'json'>('markdown');
  const [copied, setCopied] = useState(false);

  const loadSample = () => {
    setExamples([
      { input: "I'm feeling really sad today.", output: "Emotion: Sadness\nConfidence: High" },
      { input: "Yay, I won the lottery!", output: "Emotion: Joy\nConfidence: High" }
    ]);
  };

  const clearAll = () => {
    setExamples([{ input: '', output: '' }]);
  };

  const addExample = () => {
    setExamples([...examples, { input: '', output: '' }]);
  };

  const removeExample = (index: number) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index));
    }
  };

  const updateExample = (index: number, field: 'input' | 'output', value: string) => {
    const newExamples = [...examples];
    newExamples[index][field] = value;
    setExamples(newExamples);
  };

  const generateFewShot = () => {
    const validExamples = examples.filter(ex => ex.input.trim() || ex.output.trim());
    if (validExamples.length === 0) return '';
    
    if (format === 'markdown') {
      return validExamples.map((ex, i) => `### Example ${i + 1}\n**User:**\n${ex.input}\n\n**Assistant:**\n${ex.output}\n`).join('\n');
    } 
    
    if (format === 'xml') {
      return `<examples>\n` + validExamples.map(ex => `  <example>\n    <input>\n<![CDATA[\n${ex.input}\n]]>\n    </input>\n    <output>\n<![CDATA[\n${ex.output}\n]]>\n    </output>\n  </example>`).join('\n\n') + `\n</examples>`;
    }
    
    if (format === 'json') {
      return JSON.stringify({ examples: validExamples }, null, 2);
    }
    
    return '';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateFewShot());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const guideText = {
    ko: {
      title: 'Few-Shot 프롬프팅 가이드 및 주의사항',
      items: [
        { title: "왜 Few-Shot이 강력한가?", desc: "LLM은 단순히 제로샷(Zero-Shot) 규칙을 나열하는 것보다 실제 입출력 패턴(In-Context Learning)을 직접 보여줄 때 훨씬 높은 정확도와 일관성을 보입니다." },
        { title: "다양한 엣지 케이스 포함", desc: "단순히 전반적인 성공 사례(Happy Path)만 나열하지 말고, 특이한 입력이나 거절/오류를 반환해야 하는 실패 케이스에 대한 퓨샷 프롬프트(Few-Shot Prompt)도 함께 구성하세요." },
        { title: "출력 포맷의 절대적인 일관성", desc: "출력 결과가 JSON 데이터일 경우 JSON escape character strings 규칙이나 대소문자, 띄어쓰기 규격을 완벽히 유지하세요. 미세한 변동이 챗봇 응답의 파싱을 깨뜨릴 수 있습니다." },
      ]
    },
    en: {
      title: 'Few-Shot Prompting Best Practices & Tips',
      items: [
        { title: "Why is Few-Shot so powerful?", desc: "LLMs perform significantly better with explicit input-output patterns (In-Context Learning) rather than just abstract zero-shot instructions or lengthy prompt engineering rules." },
        { title: "Include diverse edge cases", desc: "Don't just provide 'happy path' examples. Crucially include edge cases, tricky prompts, or examples showing how the model should cleanly reject an invalid query." },
        { title: "Absolute output consistency", desc: "Ensure absolute consistency in JSON escape character strings, capitalization, and formatting. AI models mimic variations, which can easily break JSON parsers." },
      ]
    },
    ja: {
      title: 'Few-Shot プロンプティングガイドとヒント',
      items: [
        { title: "なぜFew-Shotプロンプトは強力なのか？", desc: "LLMは、単にゼロショット(Zero-Shot)のルールを羅列するよりも、実際の入出力パターン(In-Context Learning)を直接見せる方が、はるかに高いプロンプトエンジニアリング効果を示します。" },
        { title: "多様なエッジケースを含める", desc: "典型的な成功例（Happy Path）だけでなく、特殊な入力や、拒否・エラーを返すべき失敗パターンのフューショット(Few-Shot)例も含めて構成してください。" },
        { title: "出力フォーマットの絶対的な一貫性", desc: "JSONデータの場合は JSON escape character strings の規則や大文字/小文字、スペースを完全に一致させる必要があります。わずかな違いがJSONパーサーを破壊する可能性があります。" },
      ]
    }
  };

  const lang = i18n.language.startsWith('ko') ? 'ko' : i18n.language.startsWith('ja') ? 'ja' : 'en';
  const currentGuide = guideText[lang as 'ko'|'en'|'ja'];

  return (
    <>
      <SEO 
        title={t('fewShotBuilder.pageTitle') || 'Few-Shot Example Builder | DevToolz'}
        description={t('fewShotBuilder.subtitle') || 'Construct optimized few-shot examples in Markdown, XML, or JSON formats.'}
        url={`/${i18n.language}/few-shot-builder`}
      />
      
      <div className="max-w-7xl mx-auto pb-12">
        <div className="mb-8 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-orange-500/10 dark:bg-orange-400/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 mb-4 relative">
            <div className="p-3 bg-orange-500/10 dark:bg-orange-400/10 rounded-xl flex-shrink-0">
              <ListPlus className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {t('fewShotBuilder.title') || 'Few-Shot Example Builder'}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-lg">
                    {t('fewShotBuilder.subtitle') || 'Provide better context to AI models by formatting input-output pairs.'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={loadSample} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-200 dark:border-slate-700">
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden lg:inline">{t('fewShotBuilder.loadSample') || 'Load Sample'}</span>
                  </button>
                  <button onClick={clearAll} className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg transition-colors text-sm font-medium border border-rose-100 dark:border-rose-500/20">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden lg:inline">{t('fewShotBuilder.clearAll') || 'Clear All'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Examples Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t('fewShotBuilder.examplePairs') || 'Example Pairs'}</h3>
              <button 
                onClick={addExample}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t('fewShotBuilder.addExample') || 'Add Example'}</span>
              </button>
            </div>
            
            <div className="space-y-4 pb-4">
              {examples.map((example, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm relative group">
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => removeExample(i)}
                      disabled={examples.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Example {i + 1}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t('fewShotBuilder.userInput') || 'User Input (Context)'}</label>
                      <textarea
                        value={example.input}
                        onChange={(e) => updateExample(i, 'input', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white resize-y"
                        rows={2}
                        placeholder={t('fewShotBuilder.userInputPlaceholder') || "e.g. Analyze sentiment for: 'I'm sad'"}
                      />
                    </div>
                    
                    <div className="flex justify-center -my-1">
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 rotate-90 sm:rotate-0 hidden sm:block" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t('fewShotBuilder.expectedOutput') || 'Expected Output (AI Response)'}</label>
                      <textarea
                        value={example.output}
                        onChange={(e) => updateExample(i, 'output', e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white resize-y"
                        rows={3}
                        placeholder={t('fewShotBuilder.expectedOutputPlaceholder') || "e.g. Sentiment: Negative"}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compiled Output */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t('fewShotBuilder.compiledResult') || 'Compiled Result'}</h3>
            </div>
            
            <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden min-h-[600px] h-full">
              <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex justify-between items-center flex-wrap gap-3">
                <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                  <button
                    onClick={() => setFormat('markdown')}
                    className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", format === 'markdown' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200")}
                  >
                    Markdown
                  </button>
                  <button
                    onClick={() => setFormat('xml')}
                    className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", format === 'xml' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200")}
                  >
                    XML
                  </button>
                  <button
                    onClick={() => setFormat('json')}
                    className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", format === 'json' ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200")}
                  >
                    JSON
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors text-sm font-medium ml-auto"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t('fewShotBuilder.copied') || 'Copied' : t('fewShotBuilder.copyPrompt') || 'Copy Prompt'}</span>
                </button>
              </div>

              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
                  <code>
                    {generateFewShot()}
                  </code>
                </pre>
              </div>
            </div>
          </div>
          
        </div>

        {/* Guidelines section */}
        <section className="mt-8 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 rounded-xl p-6">
          <h2 className="flex items-center space-x-2 font-bold text-orange-800 dark:text-orange-400 mb-4 text-lg">
            <Info className="w-6 h-6" />
            <span>{currentGuide.title}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentGuide.items.map((item, idx) => (
              <article key={idx} className="bg-white/60 dark:bg-slate-800/50 border border-orange-100 dark:border-orange-900/30 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">{item.title}</h3>
                <p className="text-sm text-orange-800/80 dark:text-orange-200/70 leading-relaxed">
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
