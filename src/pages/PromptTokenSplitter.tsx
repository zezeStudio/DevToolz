import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Scissors, Copy, CheckCircle2, ChevronDown, ListEnd, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { encode, decode } from 'gpt-tokenizer';
import { cn } from '../lib/utils';

export function PromptTokenSplitter() {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [tokenLimit, setTokenLimit] = useState<number>(4000);
  const [addPrompts, setAddPrompts] = useState<boolean>(true);
  const [chunks, setChunks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [splitStatus, setSplitStatus] = useState<"not_started" | "split" | "single_part">("not_started");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const currentTokenCount = useMemo(() => encode(inputText).length, [inputText]);

  // Split text based on token limit
  const splitTextIntelligently = (text: string, maxTokens: number): string[] => {
    if (!text.trim()) return [];
    
    const paragraphs = text.split('\n\n');
    const resultChunks: string[] = [];
    let currentChunk = '';
    let currentTokens = 0;

    for (const para of paragraphs) {
      const paraTokens = encode(para).length;
      const separatorTokens = currentChunk ? encode('\n\n').length : 0;
      
      if (currentTokens + paraTokens + separatorTokens > maxTokens && currentChunk) {
        resultChunks.push(currentChunk.trim());
        currentChunk = '';
        currentTokens = 0;
      }

      if (paraTokens > maxTokens) {
        // Fallback to strict token split for this huge para
        if (currentChunk) {
          resultChunks.push(currentChunk.trim());
          currentChunk = '';
          currentTokens = 0;
        }
        const tokens = encode(para);
        let idx = 0;
        while (idx < tokens.length) {
          const slice = tokens.slice(idx, idx + maxTokens);
          resultChunks.push(decode(slice));
          idx += maxTokens;
        }
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + para;
        currentTokens += paraTokens + (currentChunk ? separatorTokens : 0);
      }
    }
    
    if (currentChunk) {
      resultChunks.push(currentChunk.trim());
    }
    
    return resultChunks;
  };

  const handleSplit = () => {
    const rawChunks = splitTextIntelligently(inputText, tokenLimit);
    const total = rawChunks.length;
    
    if (total <= 1) {
      setChunks(rawChunks);
      setSplitStatus("single_part");
      
      let msg = t('promptSplitter.toast.singlePart', { 
        current: currentTokenCount.toLocaleString(), 
        limit: tokenLimit.toLocaleString() 
      }) || `💡 The input text (${currentTokenCount.toLocaleString()} tokens) is smaller than the limit (${tokenLimit.toLocaleString()} tokens). Outputted as a single part.`;
      
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      return;
    }
    
    setSplitStatus("split");
    
    if (!addPrompts) {
      setChunks(rawChunks);
      return;
    }
    
    const finalChunks = rawChunks.map((chunk, i) => {
      const current = i + 1;
      let promptText = '';
      
      if (current === 1) {
        let instruction = i18n.language === 'ko' 
          ? `[Part 1/${total}] 다음 메시지들은 내가 아주 긴 글을 나눠서 보내는 것이니, 내가 "마지막 부분입니다" 혹은 "끝"이라고 말할 때까지 아무 응답이나 생성을 하지 말고 오직 "파트 1 확인"이라고만 대답해줘.\n\n`
          : `[Part 1/${total}] I will provide a long text in multiple parts. Please just read and reply "Acknowledge part 1". Do not start answering until I say "End of text".\n\nHere is part 1:\n\n`;
        promptText = `${instruction}${chunk}`;
      } else if (current === total) {
        let instruction = i18n.language === 'ko'
          ? `[Part ${total}/${total}] 다음은 마지막 부분이야. 이 텍스트를 읽고 나서 내 질문에 대답해줘:\n\n`
          : `[Part ${total}/${total}] Here is the final part:\n\n`;
        let ending = i18n.language === 'ko'
          ? `\n\n이것으로 긴 내용 전달이 끝났어. 이제 모든 파트를 종합해서 처리해줘.`
          : `\n\nEnd of text. Now you can process all the parts and answer my request.`;
        promptText = `${instruction}${chunk}${ending}`;
      } else {
        let instruction = i18n.language === 'ko'
          ? `[Part ${current}/${total}] 내용을 계속 이어서 보낼게. 아직 답하지 말고 "파트 ${current} 확인"이라고만 대답하고 기다려줘:\n\n`
          : `[Part ${current}/${total}] Here is part ${current}. Reply "Acknowledge part ${current}" and wait for the rest:\n\n`;
        if (i18n.language === 'ja') {
          if (current === 1) instruction = `[Part 1/${total}] これから非常に長いテキストを複数に分けて送信します。「最後です」と言うまで回答を生成せず、「パート1を確認した」とだけ返答してください。\n\nパート1:\n\n`;
          else if (current === total) instruction = `[Part ${total}/${total}] これが最後のパートです。すべて読んでから処理をお願いします:\n\n`;
          else instruction = `[Part ${current}/${total}] 続きを送信します。まだ回答せず、「パート${current}を確認した」とだけ返答し、次を待ってください:\n\n`;
        }
        promptText = `${instruction}${chunk}`;
      }
      // Ja override for start and end
      if (i18n.language === 'ja' && current === 1) {
        let instruction = `[Part 1/${total}] これから非常に長いテキストを複数に分けて送信します。「テキストの終わりです」と言うまで回答を生成せず、「パート1を確認した」とだけ返答してください。\n\nパート1:\n\n`;
        promptText = `${instruction}${chunk}`;
      } else if (i18n.language === 'ja' && current === total) {
        let instruction = `[Part ${total}/${total}] これが最後のパートです。テキストを読んでリクエストに答えてください:\n\n`;
        let ending = `\n\nテキストの終わりです。すべてのパートを統合して処理してください。`;
        promptText = `${instruction}${chunk}${ending}`;
      }
      return promptText;
    });

    setChunks(finalChunks);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <>
      <SEO 
        title={t('promptSplitter.pageTitle') || 'AI Prompt Token Splitter | DevToolz'}
        description={t('promptSplitter.subtitle') || 'Split long texts into smaller LLM-friendly chunks.'}
        url={`/${i18n.language}/prompt-token-splitter`}
      />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 mb-4 relative">
            <div className="p-3 bg-purple-500/10 dark:bg-purple-400/10 rounded-xl">
              <Scissors className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('promptSplitter.title') || 'Prompt Token Splitter'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-lg">
                {t('promptSplitter.subtitle') || 'Split long texts into smaller LLM-friendly chunks.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <div className="flex flex-col h-full space-y-6">
            <div className="flex flex-col flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Input Text
                </span>
                <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span>Tokens:</span>
                  <span className={cn("px-2 py-0.5 rounded", currentTokenCount > 0 ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "")}>
                    {currentTokenCount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex-1 relative min-h-[300px]">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="absolute inset-0 w-full h-full p-4 resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 text-sm leading-relaxed bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.06]"
                  placeholder="Paste your long text or code here..."
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('promptSplitter.tokenLimit') || 'Max Tokens per Chunk'}
                </label>
                <div className="relative">
                  <select
                    value={tokenLimit}
                    onChange={(e) => setTokenLimit(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 dark:text-white"
                  >
                    <option value={2000}>2,000 Tokens (Safe for most models)</option>
                    <option value={4000}>4,000 Tokens (Standard)</option>
                    <option value={8000}>8,000 Tokens (Large)</option>
                    <option value={15000}>15,000 Tokens (Extra Large)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                </div>
                {currentTokenCount > 0 && currentTokenCount <= tokenLimit && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {t('promptSplitter.toast.singlePart', { current: currentTokenCount.toLocaleString(), limit: tokenLimit.toLocaleString() }) || `Currently few tokens inputted (${currentTokenCount} < ${tokenLimit}), it'll be a single part. To test splitting, lower the limit or add more text.`}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="addPrompts"
                  checked={addPrompts}
                  onChange={(e) => setAddPrompts(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-700"
                />
                <label htmlFor="addPrompts" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  {t('promptSplitter.addPrompts') || 'Add continuation instructions'}
                  <span className="block text-xs font-normal text-slate-500 dark:text-slate-400 mt-0.5">
                    {i18n.language === 'ko' ? '[Part 1/3] 같은 가이드라인을 자동 주입하여 복붙하기 좋게 만듭니다.' : (i18n.language === 'ja' ? '[Part 1/3] のようなガイドラインを自動注入し、コピペしやすくします。' : 'Automatically injects [Part 1/3] guidelines for easy copy-pasting to ChatGPT/Claude.')}
                  </span>
                </label>
              </div>

              <button
                onClick={handleSplit}
                disabled={!inputText.trim()}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white shadow-sm transition-colors rounded-lg py-2.5 font-medium"
              >
                <Scissors className="w-5 h-5" />
                <span>{t('promptSplitter.splitBtn') || 'Split Text'}</span>
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col space-y-4 pb-12">
            {chunks.length > 1 && splitStatus === "split" && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const allText = chunks.join('\n\n\n');
                    navigator.clipboard.writeText(allText);
                    setToastMessage(t('promptSplitter.toast.copyAllReady') || 'All parts copied to clipboard!');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-800"
                >
                  <Copy className="w-4 h-4" />
                  <span>{t('promptSplitter.copyAll') || 'Copy All Parts'}</span>
                </button>
              </div>
            )}
            {chunks.length > 0 ? (
              chunks.map((chunk, index) => (
                <div key={index} className={cn(
                  "bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col",
                  splitStatus === "single_part" 
                    ? "border-2 border-emerald-500 dark:border-emerald-500/50" 
                    : "border border-slate-200 dark:border-slate-800"
                )}>
                  {splitStatus === "single_part" && (
                    <div className="bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2.5 text-emerald-700 dark:text-emerald-400 font-semibold text-sm border-b border-emerald-100 dark:border-emerald-900/30 flex items-center space-x-2">
                       <CheckCircle2 className="w-4 h-4" />
                       <span>{t('promptSplitter.singlePartTitle') || 'Ready as a Single Part (No split needed)'}</span>
                    </div>
                  )}
                  <div className={cn(
                    "px-4 py-3 border-b flex justify-between items-center",
                    splitStatus === "single_part"
                      ? "bg-slate-50 dark:bg-slate-900/50 border-emerald-100 dark:border-emerald-900/30"
                      : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                  )}>
                    <span className={cn(
                      "font-medium text-sm",
                      splitStatus === "single_part" ? "text-emerald-700 dark:text-emerald-400" : "text-purple-700 dark:text-purple-400"
                    )}>
                      {splitStatus === "single_part" ? (t('promptSplitter.fullText') || 'Full Text') : `Part ${index + 1} of ${chunks.length}`} <span className="opacity-50 mx-1">|</span> {encode(chunk).length.toLocaleString()} Tokens
                    </span>
                    <button
                      onClick={() => handleCopy(chunk, index)}
                      className={cn(
                        "flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
                        copiedIndex === index 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {copiedIndex === index ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>
                        {copiedIndex === index 
                          ? (t('promptSplitter.copiedToast', { part: index + 1 }) || `Part ${index + 1} copied!`) 
                          : (t('promptSplitter.copyBtn', { part: index + 1 }) || `Copy Part ${index + 1}`)}
                      </span>
                    </button>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/30 max-h-[300px] overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-300 leading-relaxed">
                      {chunk}
                    </pre>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center p-12 text-center text-slate-500 dark:text-slate-400">
                <ListEnd className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-2">No chunks generated yet</p>
                <p className="text-sm">Paste your text and configure the model to split it into easy-to-copy parts.</p>
              </div>
            )}
          </div>
        </div>

        {/* User Guide Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 p-2 rounded-lg mr-3">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            {t('promptSplitter.guide.title') || 'How to Use & Tips'}
          </h2>
          <div className="space-y-6 text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed">
            <p>
              {t('promptSplitter.guide.desc') || 'This tool chunks extremely long source code or text that exceeds the context limits of LLMs (like Claude, GPT) into smaller, more easily digestible sizes.'}
            </p>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400">1.</span>
                  <span>{t('promptSplitter.guide.1.title') || 'Token-based Intelligent Splitting'}</span>
                </h3>
                <p className="pl-6">
                  {t('promptSplitter.guide.1.desc') || 'Text is accurately cut based on GPT token encoding rather than raw character counts, intelligently preserving paragraph breaks to maintain your context.'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400">2.</span>
                  <span>{t('promptSplitter.guide.2.title') || 'Automatic Guideline Injection'}</span>
                </h3>
                <p className="pl-6">
                  {t('promptSplitter.guide.2.desc') || 'Simply splitting text may cause the AI to reply prematurely. We automatically wrap your chunks with context instructions like "Please wait until the final part before responding."'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800/50">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center space-x-2">
                  <span className="text-purple-600 dark:text-purple-400">3.</span>
                  <span>{t('promptSplitter.guide.3.title') || 'Smart UX and Copying'}</span>
                </h3>
                <p className="pl-6">
                  {t('promptSplitter.guide.3.desc') || 'If short text is entered, it smartly bypasses splitting and marks it as a "Single Part" for your clarity. If properly chunked, you can use the "Copy All" facility to copy everything instantly.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-6 right-6 max-w-sm z-50 bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-lg border border-slate-700/50 dark:border-slate-700 font-medium text-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    
      
      {/* 하드코딩된 SEO 텍스트 콘텐츠 */}
      <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700 max-w-4xl mx-auto space-y-12 pb-12">
        
        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '자주 묻는 질문 (FAQ)' : i18n.language === 'ja' ? 'よくある質問 (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Prompt Token Splitter 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Prompt Token Splitter 도구는 split prompts by tokens 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Prompt Token Splitter 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Prompt Token Splitter의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Prompt Token Splitter 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Prompt Token Splitter ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Prompt Token Splitter ツールは、split prompts by tokens するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Prompt Token Splitter を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Prompt Token Splitter のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Prompt Token Splitter ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Prompt Token Splitter tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Prompt Token Splitter is a specialized utility designed to split prompts by tokens. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Prompt Token Splitter?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Prompt Token Splitter happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Prompt Token Splitter is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
              </p>
            </div>
            </div>
          )}
        </section>

        {/* Use Cases Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '이 툴이 필요한 구체적인 실무 사례 3가지' : i18n.language === 'ja' ? 'このツールが必要な3つの具体的な実務ケース' : '3 Specific Practical Use Cases'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 split prompts by tokens 작업이 필요할 때 매우 유용합니다.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                클라이언트의 민감한 데이터를 다루고 있어 서버 측 도구를 사용할 수 없을 때 안전하게 사용할 수 있습니다.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                교육적 목적으로 학생이나 초보자들이 관련 프로세스가 시각적으로 어떻게 작동하는지 이해하는 데 도움을 줍니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                プロジェクトの作業中に、開発環境を離れることなく迅速に split prompts by tokens したい場合に非常に便利です。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                クライアントの機密データを扱っており、サーバー側のツールを使用して処理できない場合に安全に使用できます。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                教育目的で、学生や初心者が関連するプロセスが視覚的にどのように機能するかを理解するのに役立ちます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When you are working on a project and need to quickly split prompts by tokens without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to split prompts by tokens.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how split processes work visually.
              </p>
            </div>
            </div>
          )}
        </section>

        {/* Precautions Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '사용 시 주의사항 및 에러 해결법' : i18n.language === 'ja' ? '使用上の注意とエラー解決策' : 'Precautions & Error Resolution'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">대용량 데이터를 처리할 때 성능 저하를 방지하려면 브라우저를 최신 버전으로 업데이트하여 사용하시기 바랍니다.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">입력 데이터가 너무 커서 브라우저 메모리 한계를 초과하면 도구가 응답하지 않을 수 있습니다. 이 경우 데이터를 더 작은 크기로 나누어 시도하세요.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">다른 도구로 전환할 때 예기치 않은 서식 문제나 레이아웃 버그가 발생하면 브라우저 캐시를 삭제해 보세요.</span>
              </li>
              </ul>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">大量のデータを処理する際のパフォーマンス低下を防ぐため、ブラウザを最新バージョンにアップデートしてご使用ください。</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">入力データが大きすぎてブラウザのメモリ制限を超えると、ツールが応答しなくなる可能性があります。その場合は、データを小さく分割してお試しください。</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">別のツールに切り替える際に予期しないフォーマットの問題やレイアウトのバグが発生した場合は、ブラウザのキャッシュをクリアしてみてください。</span>
              </li>
              </ul>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">Ensure your browser is updated to the latest version to avoid performance issues while processing large inputs.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">If the tool becomes unresponsive, check if the input size exceeds typical browser memory limits. Try splitting your data into smaller chunks.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">Clear your browser cache if you experience unexpected formatting or layout bugs when switching between different tools.</span>
              </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}