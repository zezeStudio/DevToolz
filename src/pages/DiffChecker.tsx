import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Trash2, Columns, Rows, Type, AlignLeft, Baseline, Info } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useTheme } from '../components/ThemeProvider';

export function DiffChecker() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';
  const { theme } = useTheme();

  const [originalText, setOriginalText] = useState('function calculateSum(a, b) {\n  return a + b;\n}\n\nconsole.log(calculateSum(5, 10));');
  const [modifiedText, setModifiedText] = useState('function calculateSum(a, b, c = 0) {\n  return a + b + c;\n}\n\nconsole.log(calculateSum(5, 10, 15));');
  
  const [compareMethod, setCompareMethod] = useState<DiffMethod>(DiffMethod.WORDS);
  const [splitView, setSplitView] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Handle system theme resolution
  useEffect(() => {
    const checkTheme = () => {
      if (theme === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };
    
    checkTheme();
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  const handleSwap = () => {
    setOriginalText(modifiedText);
    setModifiedText(originalText);
  };

  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
  };

  return (
    <div className="max-w-7xl mx-auto w-full min-w-0">
      <SEO 
        title={t('diff.seoTitle')}
        description={t('diff.desc')}
        url={`/${currentLang}/diff-checker`}
      />

      <div className="mb-6 md:mb-8 break-words">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('diff.title')}</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">{t('diff.desc')}</p>
      </div>

      {/* Professional Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Settings Group */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
          {/* Compare Method */}
          <div className="flex flex-wrap sm:flex-nowrap bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full sm:w-auto">
            <button 
              onClick={() => setCompareMethod(DiffMethod.LINES)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${compareMethod === DiffMethod.LINES ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              title={t('diff.modeLines')}
            >
              <AlignLeft className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
              <span className="truncate whitespace-nowrap">{t('diff.modeLines')}</span>
            </button>
            <button 
              onClick={() => setCompareMethod(DiffMethod.WORDS)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${compareMethod === DiffMethod.WORDS ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              title={t('diff.modeWords')}
            >
              <Baseline className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
              <span className="truncate whitespace-nowrap">{t('diff.modeWords')}</span>
            </button>
            <button 
              onClick={() => setCompareMethod(DiffMethod.CHARS)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${compareMethod === DiffMethod.CHARS ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
              title={t('diff.modeChars')}
            >
              <Type className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
              <span className="truncate whitespace-nowrap">{t('diff.modeChars')}</span>
            </button>
          </div>

          {/* View Mode */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full sm:w-auto">
            <button 
              onClick={() => setSplitView(true)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${splitView ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Columns className="w-3.5 h-3.5 mr-1.5" />
              <span className="truncate whitespace-nowrap">{t('diff.splitView')}</span>
            </button>
            <button 
              onClick={() => setSplitView(false)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!splitView ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              <Rows className="w-3.5 h-3.5 mr-1.5" />
              <span className="truncate whitespace-nowrap">{t('diff.unifiedView')}</span>
            </button>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <button
            onClick={handleSwap}
            className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 mr-2" />
            {t('diff.swap')}
          </button>
          <button
            onClick={handleClear}
            className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            {t('diff.clear')}
          </button>
        </div>
      </div>

      {/* Input Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider ml-1">
            {t('diff.original')}
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={8}
            className="block w-full p-4 border border-slate-200 dark:border-white/[0.06] rounded-xl font-mono text-sm dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-y shadow-sm custom-scrollbar bg-slate-50 dark:bg-black/20"
            spellCheck={false}
            placeholder="Paste original text here..."
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider ml-1">
            {t('diff.modified')}
          </label>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            rows={8}
            className="block w-full p-4 border border-slate-200 dark:border-white/[0.06] rounded-xl font-mono text-sm dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-y shadow-sm custom-scrollbar bg-slate-50 dark:bg-black/20"
            spellCheck={false}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      {/* Professional Diff Viewer */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 p-3 flex flex-wrap items-center justify-between gap-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">
            {t('diff.results')}
          </span>
          <div className="flex flex-wrap gap-3 sm:gap-4 text-[10px] sm:text-xs font-medium">
            <span className="flex items-center text-green-600 dark:text-green-400 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500 mr-1.5 flex-shrink-0"></span>
              {t('diff.added')}
            </span>
            <span className="flex items-center text-red-700 dark:text-red-400 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500 mr-1.5 flex-shrink-0"></span>
              {t('diff.removed')}
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto w-full custom-scrollbar text-sm min-h-[400px] max-h-[80vh]
          [&_table]:w-full [&_table]:min-w-[500px] lg:[&_table]:min-w-[800px] 
          dark:[&_td]:!border-slate-700/30 dark:[&_th]:!border-slate-700/30 dark:[&_tr]:!border-slate-700/30
          [&_td]:!border-slate-200/60 [&_th]:!border-slate-200/60 [&_tr]:!border-slate-200/60
          [&_td]:!break-all
          [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!overflow-wrap-anywhere [&_pre]:!break-all
        " style={{ WebkitOverflowScrolling: 'touch' }}>
          {(!originalText && !modifiedText) ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-400 flex flex-col items-center justify-center h-full min-h-[400px]">
              <Columns className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Enter text above to see the differences.</p>
            </div>
          ) : (
            <ReactDiffViewer
              oldValue={originalText}
              newValue={modifiedText}
              splitView={splitView}
              compareMethod={compareMethod}
              useDarkTheme={isDark}
              hideLineNumbers={false}
              showDiffOnly={false}
              styles={{
                variables: {
                  dark: {
                    diffViewerBackground: '#0f172a', // Tailwind slate-900 (gives it a deeper native feel)
                    diffViewerColor: '#e2e8f0', // Tailwind slate-200
                    addedBackground: '#064e3b', // Tailwind emerald-900
                    addedColor: '#34d399', // Tailwind emerald-400
                    removedBackground: '#7f1d1d', // Tailwind red-900
                    removedColor: '#f87171', // Tailwind red-400
                    wordAddedBackground: '#047857', // Tailwind emerald-700
                    wordRemovedBackground: '#991b1b', // Tailwind red-800
                    addedGutterBackground: '#022c22', // emerald-950
                    removedGutterBackground: '#450a0a', // red-950
                    gutterBackground: '#0f172a', // Tailwind slate-900
                    gutterBackgroundDark: '#0f172a',
                    highlightBackground: '#334155', // Tailwind slate-700
                    highlightGutterBackground: '#334155',
                    emptyLineBackground: '#0f172a',
                  },
                  light: {
                    diffViewerBackground: '#ffffff',
                    diffViewerColor: '#0f172a',
                    addedBackground: '#ecfdf5', // Tailwind emerald-50
                    addedColor: '#065f46', // Tailwind emerald-800
                    removedBackground: '#fef2f2', // Tailwind red-50
                    removedColor: '#991b1b', // Tailwind red-800
                    wordAddedBackground: '#a7f3d0', // Tailwind emerald-200
                    wordRemovedBackground: '#fecaca', // Tailwind red-200
                    addedGutterBackground: '#d1fae5', // Tailwind emerald-100
                    removedGutterBackground: '#fee2e2', // Tailwind red-100
                    gutterBackground: '#f8fafc', // Tailwind slate-50
                    gutterBackgroundDark: '#f1f5f9', // Tailwind slate-100
                    highlightBackground: '#f1f5f9',
                    highlightGutterBackground: '#e2e8f0',
                    emptyLineBackground: '#ffffff',
                  }
                },
                line: {
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                },
                contentText: {
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 mb-8">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">{t('diff.help.title')}</h2>
        </div>
        <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            {t('diff.help.1')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            {t('diff.help.2')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            {t('diff.help.3')}
          </li>
        </ul>
      </div>

      {/* Long Description for SEO */}
      <div className="prose dark:prose-invert max-w-none p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4">{t('diff.longDesc.title')}</h2>
        <p>{t('diff.longDesc.p1')}</p>
        <p>{t('diff.longDesc.p2')}</p>
        <p>{t('diff.longDesc.p3')}</p>
          <p className="mt-4 leading-relaxed">{t('diff.longDesc.p4')}</p>
          <p className="mt-4 leading-relaxed">{t('diff.longDesc.p5')}</p>
      </div>
    </div>
  );
}
