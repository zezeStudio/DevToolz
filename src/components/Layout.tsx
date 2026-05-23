import React from 'react';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Code2, Key, Type, Home, Menu, X, Globe, Binary, Link as LinkIcon, FileJson, Palette, FileText, Fingerprint, Hash, Clock, QrCode, Search, Sun, Moon, FileDiff, Image as ImageIcon, Bot, Braces, Layers, Terminal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeProvider';
import { CookieConsent } from './CookieConsent';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const currentLang = lang || 'en';

  const navGroups = [
    {
      group: t('home.category.home') || 'Home',
      items: [
        { name: t('nav.home'), path: `/${currentLang}`, icon: Home }
      ]
    },
    {
      group: t('home.category.ai') || 'AI Tools',
      items: [
        { name: t('nav.jsonTs') || 'JSON to TS', path: `/${currentLang}/json-to-ts`, icon: Bot },
        { name: t('nav.tokenCounter') || 'Token Counter', path: `/${currentLang}/token-counter`, icon: Terminal },
        { name: t('nav.llmOptimizer'), path: `/${currentLang}/llm-optimizer`, icon: Bot },
        { name: t('nav.promptWrapper'), path: `/${currentLang}/prompt-wrapper`, icon: Braces },
        { name: t('nav.chunkingSimulator'), path: `/${currentLang}/chunking-simulator`, icon: Layers },
        { name: t('nav.systemPrompt'), path: `/${currentLang}/system-prompt`, icon: Terminal },
        { name: t('nav.promptInjector') || 'Prompt Injector', path: `/${currentLang}/prompt-variable-injector`, icon: Terminal },
        { name: t('nav.promptSplitter') || 'Prompt Splitter', path: `/${currentLang}/prompt-token-splitter`, icon: Layers },
        { name: t('nav.llmPlayground') || 'LLM Playground', path: `/${currentLang}/llm-parameter-playground`, icon: Terminal },
        { name: t('nav.xmlGuardrail') || 'XML Guardrail', path: `/${currentLang}/xml-guardrail-generator`, icon: Terminal },
        { name: t('nav.fewShotBuilder') || 'Few-Shot Builder', path: `/${currentLang}/few-shot-builder`, icon: Terminal },
      ]
    },
    {
      group: t('home.category.developer') || 'Developer Tools',
      items: [
        { name: t('nav.json'), path: `/${currentLang}/json-formatter`, icon: Code2 },
        { name: t('nav.base64'), path: `/${currentLang}/base64-converter`, icon: Binary },
        { name: t('nav.url'), path: `/${currentLang}/url-encoder`, icon: LinkIcon },
        { name: t('nav.jwt'), path: `/${currentLang}/jwt-decoder`, icon: FileJson },
        { name: t('nav.uuid'), path: `/${currentLang}/uuid-generator`, icon: Fingerprint },
        { name: t('nav.unix'), path: `/${currentLang}/unix-timestamp`, icon: Clock },
        { name: t('nav.regex'), path: `/${currentLang}/regex-tester`, icon: Search },
        { name: t('nav.diff'), path: `/${currentLang}/diff-checker`, icon: FileDiff },
      ]
    },
    {
      group: t('home.category.text') || 'Text & Formatting',
      items: [
        { name: t('nav.text'), path: `/${currentLang}/text-analyzer`, icon: Type },
        { name: t('nav.markdown'), path: `/${currentLang}/markdown-editor`, icon: FileText },
      ]
    },
    {
      group: t('home.category.design') || 'Design & Security',
      items: [
        { name: t('nav.color'), path: `/${currentLang}/color-converter`, icon: Palette },
        { name: t('nav.qr'), path: `/${currentLang}/qr-code`, icon: QrCode },
        { name: t('nav.imageCompressor'), path: `/${currentLang}/image-compressor`, icon: ImageIcon },
        { name: t('nav.password'), path: `/${currentLang}/password-generator`, icon: Key },
        { name: t('nav.hash'), path: `/${currentLang}/hash-generator`, icon: Hash },
      ]
    }
  ];

  const handleLanguageChange = (newLang: string) => {
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // If the first segment is a language code, replace it
    if (pathSegments.length > 0 && ['en', 'ko', 'ja'].includes(pathSegments[0])) {
      pathSegments[0] = newLang;
    } else {
      pathSegments.unshift(newLang);
    }
    
    navigate(`/${pathSegments.join('/')}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to={`/${currentLang}`} className="flex items-center">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white tracking-tight">DevToolz</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline-block mr-2">{t('header.subtitle')}</span>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 py-1 pl-2 pr-6 transition-colors"
              >
                <option value="en">English</option>
                <option value="ko">한국어</option>
                <option value="ja">日本語</option>
              </select>

              <button
                type="button"
                className="md:hidden ml-2 p-2 rounded-md text-slate-400 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "fixed top-16 left-0 z-20 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out md:relative md:top-0 md:h-fit md:min-h-[calc(100vh-4rem)] md:rounded-xl md:shadow-sm md:border md:mr-6 flex flex-col",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto md:overflow-y-visible">
            {navGroups.map((group) => (
              <div key={group.group}>
                {group.group !== 'Home' && group.group !== t('home.category.home') && (
                  <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {group.group}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path === `/${currentLang}` && (location.pathname === '/' || location.pathname === `/${currentLang}/`));
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={cn(
                          "group flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all",
                          isActive
                            ? "bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-bold ring-1 ring-emerald-300 dark:ring-emerald-600 shadow-sm scale-[1.02]"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                            isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* AdSense Auto Ads will inject here if needed. */}

          {/* Page Content */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
            <Outlet />
          </div>

          {/* Bottom Ad Slot */}
          <div className="mt-6">
            {/* Removed bottom ad placeholder */}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &copy; {new Date().getFullYear()} DevToolz. {t('footer.rights')}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xl">
              {t('footer.disclaimer')}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-6">
              <Link to={`/${currentLang}/about`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">{t('footer.about')}</Link>
              <a href="/privacy.html" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">{t('footer.privacy')}</a>
              <a href="/terms-of-service.html" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">{t('footer.terms')}</a>
              <Link to={`/${currentLang}/contact`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">{t('footer.contact')}</Link>
            </div>
            <div className="flex space-x-4 text-xs text-slate-400 dark:text-slate-500">
              <Link to={`/en${location.pathname.replace(/^\/(en|ko|ja)/, '')}`} className={cn("transition-colors", currentLang === 'en' ? "text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400")}>English</Link>
              <span>•</span>
              <Link to={`/ko${location.pathname.replace(/^\/(en|ko|ja)/, '')}`} className={cn("transition-colors", currentLang === 'ko' ? "text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400")}>한국어</Link>
              <span>•</span>
              <Link to={`/ja${location.pathname.replace(/^\/(en|ko|ja)/, '')}`} className={cn("transition-colors", currentLang === 'ja' ? "text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-blue-400")}>日本語</Link>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}
