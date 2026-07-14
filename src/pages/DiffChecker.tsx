import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Trash2, Columns, Rows, Type, AlignLeft, Baseline, Info, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { useTheme } from '../components/ThemeProvider';

export function DiffChecker() {
  const { t, i18n } = useTranslation();
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
                Diff Checker 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Diff Checker 도구는 compare text and code differences 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Diff Checker 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Diff Checker의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Diff Checker 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Diff Checker ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Diff Checker ツールは、compare text and code differences するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Diff Checker を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Diff Checker のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Diff Checker ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Diff Checker tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Diff Checker is a specialized utility designed to compare text and code differences. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Diff Checker?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Diff Checker happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Diff Checker is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 compare text and code differences 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に compare text and code differences したい場合に非常に便利です。
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
                When you are working on a project and need to quickly compare text and code differences without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to compare text and code differences.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how compare processes work visually.
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
    </div>
  );
}