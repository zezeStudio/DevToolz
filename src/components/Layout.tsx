import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Code2, Key, Type, Home, Menu, X, Globe, Binary, Link as LinkIcon, FileJson, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdPlaceholder } from './AdPlaceholder';
import { cn } from '../lib/utils';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Home },
    { name: t('nav.json'), path: '/json-formatter', icon: Code2 },
    { name: t('nav.password'), path: '/password-generator', icon: Key },
    { name: t('nav.text'), path: '/text-analyzer', icon: Type },
    { name: t('nav.base64'), path: '/base64-converter', icon: Binary },
    { name: t('nav.url'), path: '/url-encoder', icon: LinkIcon },
    { name: t('nav.jwt'), path: '/jwt-decoder', icon: FileJson },
    { name: t('nav.color'), path: '/color-converter', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link to="/" className="flex items-center ml-2 md:ml-0">
                <Globe className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">DevToolz</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 hidden sm:inline-block">{t('header.subtitle')}</span>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1 pl-2 pr-6"
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
            "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:h-[calc(100vh-6rem)] md:rounded-xl md:shadow-sm md:border md:mr-6 flex flex-col",
            isSidebarOpen ? "translate-x-0 mt-16" : "-translate-x-full mt-16 md:mt-0"
          )}
        >
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
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
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
            
            <div className="mt-8 pt-8 border-t border-gray-200">
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
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>

          {/* Bottom Ad Slot */}
          <div className="mt-6">
            <AdPlaceholder format="horizontal" />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DevToolz. {t('footer.rights')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">{t('footer.privacy')}</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">{t('footer.terms')}</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">{t('footer.contact')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
