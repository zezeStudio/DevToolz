import React from 'react';
import { Outlet, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Code2, Key, Type, Home, Menu, X, Globe, Binary, Link as LinkIcon, FileJson, Palette, FileText, Fingerprint, Hash, Clock, QrCode, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdPlaceholder } from './AdPlaceholder';
import { cn } from '../lib/utils';
import { useTheme } from './ThemeProvider';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const currentLang = lang || 'en';

  const navItems = [
    { name: t('nav.home'), path: `/${currentLang}`, icon: Home },
    { name: t('nav.json'), path: `/${currentLang}/json-formatter`, icon: Code2 },
    { name: t('nav.password'), path: `/${currentLang}/password-generator`, icon: Key },
    { name: t('nav.text'), path: `/${currentLang}/text-analyzer`, icon: Type },
    { name: t('nav.base64'), path: `/${currentLang}/base64-converter`, icon: Binary },
    { name: t('nav.url'), path: `/${currentLang}/url-encoder`, icon: LinkIcon },
    { name: t('nav.jwt'), path: `/${currentLang}/jwt-decoder`, icon: FileJson },
    { name: t('nav.color'), path: `/${currentLang}/color-converter`, icon: Palette },
    { name: t('nav.markdown'), path: `/${currentLang}/markdown-editor`, icon: FileText },
    { name: t('nav.uuid'), path: `/${currentLang}/uuid-generator`, icon: Fingerprint },
    { name: t('nav.hash'), path: `/${currentLang}/hash-generator`, icon: Hash },
    { name: t('nav.unix'), path: `/${currentLang}/unix-timestamp`, icon: Clock },
    { name: t('nav.qr'), path: `/${currentLang}/qr-code`, icon: QrCode },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to={`/${currentLang}`} className="flex items-center ml-2 md:ml-0">
                <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white tracking-tight">DevToolz</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">{t('header.subtitle')}</span>
              
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 pl-2 pr-6 transition-colors"
              >
                <option value="en">English</option>
                <option value="ko">한국어</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar Navigation */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:h-[1020px] md:rounded-xl md:shadow-sm md:border md:mr-6 flex flex-col",
            isSidebarOpen ? "translate-x-0 mt-16" : "-translate-x-full mt-16 md:mt-0"
          )}
        >
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 dark:text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <AdPlaceholder format="square" className="mx-auto" />
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Top Ad Slot */}
          <div className="mb-6">
            <AdPlaceholder format="horizontal" />
          </div>

          {/* Page Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
            <Outlet />
          </div>

          {/* Bottom Ad Slot */}
          <div className="mt-6">
            <AdPlaceholder format="horizontal" />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} DevToolz. {t('footer.rights')}
          </p>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-6">
              <Link to={`/${currentLang}/privacy`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">{t('footer.privacy')}</Link>
              <Link to={`/${currentLang}/terms`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">{t('footer.terms')}</Link>
              <Link to={`/${currentLang}/contact`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">{t('footer.contact')}</Link>
            </div>
            <div className="flex space-x-4 text-xs text-gray-400 dark:text-gray-500">
              <Link to={`/en${location.pathname.replace(/^\/(en|ko|ja)/, '')}`} className="hover:text-blue-600 transition-colors">English</Link>
              <span>•</span>
              <Link to={`/ko${location.pathname.replace(/^\/(en|ko|ja)/, '')}`} className="hover:text-blue-600 transition-colors">한국어</Link>
              <span>•</span>
              <Link to={`/ja${location.pathname.replace(/^\/(en|ko|ja)/, '')}`} className="hover:text-blue-600 transition-colors">日本語</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
