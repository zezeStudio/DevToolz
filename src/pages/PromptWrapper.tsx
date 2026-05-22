import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Braces, Copy, Check, Trash2, Wand2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function PromptWrapper() {
  const { t } = useTranslation();
  const [system, setSystem] = useState('');
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [format, setFormat] = useState<'xml' | 'markdown'>('xml');
  const [copied, setCopied] = useState(false);

  const handleSample = () => {
    setSystem('You are an expert React developer specializing in performance optimization.');
    setPrompt('Review the provided source code and suggest ways to reduce unnecessary re-renders. Outline the specific problems, then provide the refactored code.');
    setContext(`import React, { useState } from 'react';

export function UserList({ users }) {
  const [filter, setFilter] = useState('');
  
  // This causes unnecessary sorting on every re-render
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
  
  const filteredUsers = sortedUsers.filter(u => u.name.includes(filter));

  return (
    <div>
      <input 
        value={filter} 
        onChange={e => setFilter(e.target.value)} 
        placeholder="Filter users..." 
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}`);
  };

  const generateOutput = () => {
    let result = '';
    if (format === 'xml') {
      if (system) result += `<system>\n${system}\n</system>\n\n`;
      if (prompt) result += `<instructions>\n${prompt}\n</instructions>\n\n`;
      if (context) result += `<code>\n${context}\n</code>\n`;
    } else {
      if (system) result += `### System\n${system}\n\n`;
      if (prompt) result += `### Instructions\n${prompt}\n\n`;
      if (context) result += `### Code / Context\n\`\`\`\n${context}\n\`\`\`\n`;
    }
    return result.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateOutput()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setSystem('');
    setPrompt('');
    setContext('');
  };

  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <div className="max-w-7xl mx-auto">
      <SEO 
        title={t('promptWrapper.seoTitle') || 'AI Prompt Wrapper | DevToolz'}
        description="Wrap AI prompts and code in XML or Markdown formats easily." 
        url={`/${currentLang}/prompt-wrapper`}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <Braces className="mr-3 h-8 w-8 text-indigo-600" />
          {t('nav.promptWrapper') || 'Prompt Wrapper'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('promptWrapper.subtitle') || 'Structure your AI prompts perfectly using XML tags or Markdown to reduce hallucinations.'}
        </p>
        <button onClick={handleSample} className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-sm font-medium flex items-center transition-colors border border-emerald-200 dark:border-emerald-800/50 w-fit">
          <Wand2 className="w-4 h-4 mr-2" /> {t('common.sample') || 'Sample Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Format</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" checked={format === 'xml'} onChange={() => setFormat('xml')} />
                <span className="text-sm dark:text-slate-300">XML Tags (Recommended for Claude)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" checked={format === 'markdown'} onChange={() => setFormat('markdown')} />
                <span className="text-sm dark:text-slate-300">Markdown</span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">System Role (Optional)</label>
            <textarea value={system} onChange={e => setSystem(e.target.value)} rows={3} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="e.g. You are an expert software engineer..."></textarea>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Instructions / Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder="What should the AI do?"></textarea>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">Code / Context</label>
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={6} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm" placeholder="Paste your source code or reference data here..."></textarea>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[500px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Wrapped Output</h3>
            <div className="flex gap-2">
              <button onClick={handleClear} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-300 rounded text-sm font-medium flex items-center transition-colors">
                <Trash2 className="w-4 h-4 mr-1" /> {t('common.clear') || 'Clear'}
              </button>
              <button onClick={handleCopy} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 rounded text-sm font-medium flex items-center transition-colors">
                {copied ? <><Check className="w-4 h-4 mr-1" /> {t('common.copied') || 'Copied'}</> : <><Copy className="w-4 h-4 mr-1" /> {t('common.copy') || 'Copy'}</>}
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 relative">
            <textarea readOnly value={generateOutput()} className="absolute inset-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-700 dark:text-slate-300 outline-none resize-none" placeholder="Result will appear here..."></textarea>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('promptWrapper.howToUseTitle')}</h2>
        
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex items-start text-indigo-800 dark:text-indigo-300">
          <p className="text-sm leading-relaxed">{t('promptWrapper.howToUseSample')}</p>
        </div>

        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">1</span>
            <span>{t('promptWrapper.howToUse1')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">2</span>
            <span>{t('promptWrapper.howToUse2')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">3</span>
            <span>{t('promptWrapper.howToUse3')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">4</span>
            <span>{t('promptWrapper.howToUse4')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-sm">5</span>
            <span>{t('promptWrapper.howToUse5')}</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('promptWrapper.aboutTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('promptWrapper.about1')}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('promptWrapper.about2')}
        </p>
      </div>
    </div>
  );
}
