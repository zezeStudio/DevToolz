import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Calculator, Trash2, Wand2 } from 'lucide-react';
import { encode } from 'gpt-tokenizer';
import { useParams } from 'react-router-dom';

const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', inputPrice: 5.0, outputPrice: 15.0 },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', inputPrice: 10.0, outputPrice: 30.0 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', inputPrice: 0.5, outputPrice: 1.5 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus (approx)', inputPrice: 15.0, outputPrice: 75.0 },
  { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet (approx)', inputPrice: 3.0, outputPrice: 15.0 },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', inputPrice: 3.5, outputPrice: 10.5 },
];

export function TokenCounter() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const stats = useMemo(() => {
    if (!text) return { characters: 0, words: 0, tokens: 0 };
    const tokens = encode(text).length;
    return {
      characters: text.length,
      words: text.trim().split(/\s+/).filter(Boolean).length,
      tokens: tokens,
    };
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  const handleSampleData = () => {
    setText(`You are a helpful coding assistant.

Please review the following code and provide feedback on:
1. Potential bugs or edge cases
2. Performance optimizations
3. Readability and best practices

Code to review:
\`\`\`typescript
function calculateTotal(items: any[]) {
  let total = 0;
  for(let i=0; i<items.length; i++) {
    total += items[i].price;
  }
  return total;
}
\`\`\`

Return the feedback in a structured JSON format.`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEO 
        title={t('tokenCounter.seoTitle') || 'Token Counter & Price Estimator | DevToolz'}
        description={t('tokenCounter.desc') || 'Calculate API tokens for your AI prompts and estimate costs.'}
        url={`/${currentLang}/token-counter`}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <Calculator className="mr-3 h-8 w-8 text-teal-600" />
          {t('nav.tokenCounter') || 'Token Counter'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('tokenCounter.desc') || 'Calculate API tokens for your AI prompts and estimate costs for various models.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden h-[400px] flex flex-col">
            <div className="flex-1 relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-full p-4 resize-none bg-transparent focus:outline-none focus:ring-0 dark:text-slate-200 text-base"
                placeholder={t('tokenCounter.placeholder') || "Paste your prompt or text here..."}
              />
            </div>
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <div className="flex space-x-6 text-sm">
                <div className="flex items-center">
                  <span className="text-slate-500 dark:text-slate-500 mr-2">Tokens:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">{stats.tokens.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 dark:text-slate-500 mr-2">Characters:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.characters.toLocaleString()}</span>
                </div>
                <div className="flex items-center hidden sm:flex">
                  <span className="text-slate-500 dark:text-slate-500 mr-2">Words:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{stats.words.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleSampleData}
                  className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center px-2 py-1"
                >
                  <Wand2 className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">{t('common.sampleData') || 'Sample Data'}</span>
                </button>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
                <button 
                  onClick={handleClear}
                  className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors flex items-center px-2 py-1"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">{t('common.clear') || 'Clear'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Cost Estimation (USD)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on Input Token pricing for 1,000 requests</p>
          </div>
          <div className="flex-1 p-0 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-2 font-medium">Model</th>
                  <th className="px-4 py-2 font-medium text-right">Cost (1k calls)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {MODELS.map(model => {
                  // Cost = (tokens / 1,000,000) * inputPrice * 1000 calls
                  const costFor1kRequests = (stats.tokens / 1000000) * model.inputPrice * 1000;
                  return (
                    <tr key={model.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">{model.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                        ${costFor1kRequests.toFixed(4)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Long Description for SEO and Guide */}
      <div className="prose dark:prose-invert max-w-none mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4">{t('tokenCounter.longDesc.title') || 'About Token Counter & Price Estimator'}</h2>
        
        <p>{t('tokenCounter.longDesc.p1') || 'The Token Counter & Price Estimator is a specialized local tool designed to help developers and AI enthusiasts estimate the exact token count and cost of their API requests before sending them.'}</p>
        
        <p>{t('tokenCounter.longDesc.p2') || 'Our implementation uses standard parsing algorithms (Byte Pair Encoding) locally in your browser. This means your private prompts, proprietary algorithms, and codebase snippets are never transmitted to a server for token counting—ensuring absolute data privacy and rapid feedback.'}</p>
        
        <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-5 rounded-lg my-6">
          <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-200">{t('tokenCounter.help.title') || 'How to use this tool'}</h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Step 1:</strong> {t('tokenCounter.help.1') || 'Paste your prompt, system instructions, or context string into the editor.'}</li>
            <li><strong>Step 2:</strong> {t('tokenCounter.help.2') || 'The tool will automatically calculate the characters, words, and exact token count in real-time.'}</li>
            <li><strong>Step 3:</strong> {t('tokenCounter.help.3') || 'The Cost Estimation table automatically updates, showing how much it would cost to run this context size 1,000 times against popular LLMs like GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro.'}</li>
            <li><strong>Tip:</strong> {t('tokenCounter.help.4') || 'Click "Sample Data" to see a typical prompt example and verify the estimation features in action.'}</li>
          </ul>
        </div>
        
        <p>{t('tokenCounter.longDesc.p3') || 'We aim to keep our model rates up to date, but prices serve merely as an approximate estimation based on the input payload schemas provided by OpenAI, Anthropic, and Google. We calculate the baseline estimation as: (Input Tokens / 1,000,000) × Provider Input Rate (Per 1M tokens) × 1,000 Requests.'}</p>
      </div>
    </div>
  );
}
