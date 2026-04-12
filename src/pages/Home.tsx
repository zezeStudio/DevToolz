import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Code2, Key, Type, ArrowRight, Binary, Link as LinkIcon, Search, Shield, Terminal, FileText, FileJson, Palette, Fingerprint, Hash, Clock, QrCode } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const currentLang = lang || 'en';

  const tools = [
    {
      name: t('home.tools.json.name'),
      description: t('home.tools.json.desc'),
      icon: Code2,
      path: `/${currentLang}/json-formatter`,
      color: 'bg-blue-500',
      category: 'developer'
    },
    {
      name: t('home.tools.base64.name'),
      description: t('home.tools.base64.desc'),
      icon: Binary,
      path: `/${currentLang}/base64-converter`,
      color: 'bg-orange-500',
      category: 'developer'
    },
    {
      name: t('home.tools.url.name'),
      description: t('home.tools.url.desc'),
      icon: LinkIcon,
      path: `/${currentLang}/url-encoder`,
      color: 'bg-indigo-500',
      category: 'developer'
    },
    {
      name: t('home.tools.jwt.name'),
      description: t('home.tools.jwt.desc'),
      icon: FileJson,
      path: `/${currentLang}/jwt-decoder`,
      color: 'bg-teal-500',
      category: 'developer'
    },
    {
      name: t('home.tools.color.name'),
      description: t('home.tools.color.desc'),
      icon: Palette,
      path: `/${currentLang}/color-converter`,
      color: 'bg-pink-500',
      category: 'design'
    },
    {
      name: t('home.tools.text.name'),
      description: t('home.tools.text.desc'),
      icon: Type,
      path: `/${currentLang}/text-analyzer`,
      color: 'bg-purple-500',
      category: 'text'
    },
    {
      name: t('home.tools.markdown.name'),
      description: t('home.tools.markdown.desc'),
      icon: FileText,
      path: `/${currentLang}/markdown-editor`,
      color: 'bg-slate-700',
      category: 'text'
    },
    {
      name: t('home.tools.password.name'),
      description: t('home.tools.password.desc'),
      icon: Key,
      path: `/${currentLang}/password-generator`,
      color: 'bg-green-500',
      category: 'security'
    },
    {
      name: t('home.tools.uuid.name'),
      description: t('home.tools.uuid.desc'),
      icon: Fingerprint,
      path: `/${currentLang}/uuid-generator`,
      color: 'bg-indigo-600',
      category: 'developer'
    },
    {
      name: t('home.tools.hash.name'),
      description: t('home.tools.hash.desc'),
      icon: Hash,
      path: `/${currentLang}/hash-generator`,
      color: 'bg-red-500',
      category: 'security'
    },
    {
      name: t('home.tools.unix.name'),
      description: t('home.tools.unix.desc'),
      icon: Clock,
      path: `/${currentLang}/unix-timestamp`,
      color: 'bg-cyan-600',
      category: 'developer'
    },
    {
      name: t('home.tools.qr.name'),
      description: t('home.tools.qr.desc'),
      icon: QrCode,
      path: `/${currentLang}/qr-code`,
      color: 'bg-yellow-500',
      category: 'design'
    },
  ];

  const categories = [
    { id: 'developer', name: t('home.category.developer'), icon: Terminal },
    { id: 'design', name: t('home.category.design'), icon: Palette },
    { id: 'text', name: t('home.category.text'), icon: FileText },
    { id: 'security', name: t('home.category.security'), icon: Shield },
  ];

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tools;
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(query) || 
      tool.description.toLowerCase().includes(query)
    );
  }, [searchQuery, tools]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof tools> = {};
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  }, [filteredTools]);

  return (
    <>
      <SEO 
        title={`${t('home.title1')} ${t('home.title2')} - DevToolz`}
        description={t('home.subtitle')}
        url={`/${currentLang}`}
        schema={[
          {
            "@type": "WebApplication",
            "name": "DevToolz",
            "description": t('home.subtitle'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-6">
            {t('home.title1')} <span className="text-blue-600">{t('home.title2')}</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            {t('home.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-0 sm:text-lg transition-colors shadow-sm"
              placeholder={t('home.searchPlaceholder')}
            />
          </div>
        </div>

        {/* Tools Grid by Category */}
        {filteredTools.length > 0 ? (
          <div className="space-y-16">
            {categories.map(category => {
              const categoryTools = toolsByCategory[category.id];
              if (!categoryTools || categoryTools.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-center mb-6">
                    <category.icon className="h-6 w-6 text-gray-400 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.name}
                        to={tool.path}
                        className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                      >
                        <div className={`inline-flex p-3 rounded-xl ${tool.color} text-white mb-5 w-fit shadow-sm`}>
                          <tool.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 flex-1 mb-6 leading-relaxed">
                          {tool.description}
                        </p>
                        <div className="flex items-center text-blue-600 font-bold mt-auto">
                          {t('home.useTool')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">{t('home.noResults')}</h3>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Why Choose Us Section */}
        <div className="mt-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12">{t('home.why.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t('home.why.free.title')}</h4>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{t('home.why.free.desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t('home.why.privacy.title')}</h4>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{t('home.why.privacy.desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t('home.why.fast.title')}</h4>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{t('home.why.fast.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
