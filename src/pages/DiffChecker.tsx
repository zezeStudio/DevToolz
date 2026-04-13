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
    <div className="max-w-7xl mx-auto">
      <SEO 
        title={t('diff.seoTitle')}
        description={t('diff.desc')}
        url={`/${currentLang}/diff-checker`}
      />

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('diff.title')}</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{t('diff.desc')}</p>
      </div>

      {/* Professional Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        
        {/* Settings Group */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Compare Method */}
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-full sm:w-auto">
            <button 
              onClick={() => setCompareMethod(DiffMethod.LINES)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${compareMethod === DiffMethod.LINES ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title={t('diff.modeLines')}
            >
              <AlignLeft className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
              {t('diff.modeLines')}
            </button>
            <button 
              onClick={() => setCompareMethod(DiffMethod.WORDS)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${compareMethod === DiffMethod.WORDS ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title={t('diff.modeWords')}
            >
              <Baseline className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
              {t('diff.modeWords')}
            </button>
            <button 
              onClick={() => setCompareMethod(DiffMethod.CHARS)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${compareMethod === DiffMethod.CHARS ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              title={t('diff.modeChars')}
            >
              <Type className="w-3.5 h-3.5 mr-1.5 hidden sm:block" />
              {t('diff.modeChars')}
            </button>
          </div>

          {/* View Mode */}
          <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg w-full sm:w-auto">
            <button 
              onClick={() => setSplitView(true)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${splitView ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Columns className="w-3.5 h-3.5 mr-1.5" />
              {t('diff.splitView')}
            </button>
            <button 
              onClick={() => setSplitView(false)} 
              className={`flex-1 sm:flex-none flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${!splitView ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Rows className="w-3.5 h-3.5 mr-1.5" />
              {t('diff.unifiedView')}
            </button>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={handleSwap}
            className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 mr-2" />
            {t('diff.swap')}
          </button>
          <button
            onClick={handleClear}
            className="flex-1 lg:flex-none flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 mr-2" />
            {t('diff.clear')}
          </button>
        </div>
      </div>

      {/* Input Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider ml-1">
            {t('diff.original')}
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={8}
            className="block w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-y shadow-sm custom-scrollbar"
            spellCheck={false}
            placeholder="Paste original text here..."
          />
        </div>

        <div className="flex flex-col">
          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider ml-1">
            {t('diff.modified')}
          </label>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            rows={8}
            className="block w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-y shadow-sm custom-scrollbar"
            spellCheck={false}
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      {/* Professional Diff Viewer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
            {t('diff.results')}
          </span>
          <div className="flex gap-4 text-[10px] sm:text-xs font-medium">
            <span className="flex items-center text-green-700 dark:text-green-400">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 dark:bg-green-500 mr-1.5"></span>
              {t('diff.added')}
            </span>
            <span className="flex items-center text-red-700 dark:text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 dark:bg-red-500 mr-1.5"></span>
              {t('diff.removed')}
            </span>
          </div>
        </div>
        
        <div className="overflow-auto custom-scrollbar text-sm min-h-[400px] max-h-[80vh]">
          {(!originalText && !modifiedText) ? (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center h-full min-h-[400px]">
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
                    diffViewerBackground: '#1f2937', // Tailwind gray-800
                    diffViewerColor: '#e5e7eb', // Tailwind gray-200
                    addedBackground: '#064e3b', // Tailwind emerald-900
                    addedColor: '#34d399', // Tailwind emerald-400
                    removedBackground: '#7f1d1d', // Tailwind red-900
                    removedColor: '#f87171', // Tailwind red-400
                    wordAddedBackground: '#047857', // Tailwind emerald-700
                    wordRemovedBackground: '#991b1b', // Tailwind red-800
                    addedGutterBackground: '#064e3b',
                    removedGutterBackground: '#7f1d1d',
                    gutterBackground: '#111827', // Tailwind gray-900
                    gutterBackgroundDark: '#111827',
                    highlightBackground: '#374151', // Tailwind gray-700
                    highlightGutterBackground: '#374151',
                    emptyLineBackground: '#1f2937',
                  },
                  light: {
                    diffViewerBackground: '#ffffff',
                    diffViewerColor: '#111827',
                    addedBackground: '#ecfdf5', // Tailwind emerald-50
                    addedColor: '#065f46', // Tailwind emerald-800
                    removedBackground: '#fef2f2', // Tailwind red-50
                    removedColor: '#991b1b', // Tailwind red-800
                    wordAddedBackground: '#a7f3d0', // Tailwind emerald-200
                    wordRemovedBackground: '#fecaca', // Tailwind red-200
                    addedGutterBackground: '#d1fae5', // Tailwind emerald-100
                    removedGutterBackground: '#fee2e2', // Tailwind red-100
                    gutterBackground: '#f9fafb', // Tailwind gray-50
                    gutterBackgroundDark: '#f3f4f6', // Tailwind gray-100
                    highlightBackground: '#f3f4f6',
                    highlightGutterBackground: '#e5e7eb',
                    emptyLineBackground: '#ffffff',
                  }
                },
                line: {
                  wordBreak: 'break-all',
                }
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
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            {t('diff.help.1')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            {t('diff.help.2')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            {t('diff.help.3')}
          </li>
        </ul>
      </div>

      {/* Long Description for SEO */}
      <div className="prose dark:prose-invert max-w-none p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">{t('diff.longDesc.title')}</h2>
        <p>{t('diff.longDesc.p1')}</p>
        <p>{t('diff.longDesc.p2')}</p>
        <p>{t('diff.longDesc.p3')}</p>
      </div>
    </div>
  );
}
