import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Scissors, Copy, CheckCircle2, ChevronDown, ListEnd } from 'lucide-react';
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
    </>
  );
}
