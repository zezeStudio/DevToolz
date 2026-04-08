import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Key, Type, ArrowRight, Binary, Link as LinkIcon } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();

  const tools = [
    {
      name: t('home.tools.json.name'),
      description: t('home.tools.json.desc'),
      icon: Code2,
      path: '/json-formatter',
      color: 'bg-blue-500',
    },
    {
      name: t('home.tools.password.name'),
      description: t('home.tools.password.desc'),
      icon: Key,
      path: '/password-generator',
      color: 'bg-green-500',
    },
    {
      name: t('home.tools.text.name'),
      description: t('home.tools.text.desc'),
      icon: Type,
      path: '/text-analyzer',
      color: 'bg-purple-500',
    },
    {
      name: t('home.tools.base64.name'),
      description: t('home.tools.base64.desc'),
      icon: Binary,
      path: '/base64-converter',
      color: 'bg-orange-500',
    },
    {
      name: t('home.tools.url.name'),
      description: t('home.tools.url.desc'),
      icon: LinkIcon,
      path: '/url-encoder',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <>
      <SEO 
        title={`${t('home.title1')} ${t('home.title2')} - DevToolz`}
        description={t('home.subtitle')}
        url="/"
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

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            {t('home.title1')} <span className="text-blue-600">{t('home.title2')}</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              to={tool.path}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-200 flex flex-col h-full"
            >
              <div className={`inline-flex p-3 rounded-xl ${tool.color} text-white mb-4 w-fit`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-gray-500 flex-1 mb-6">
                {tool.description}
              </p>
              <div className="flex items-center text-blue-600 font-medium mt-auto">
                {t('home.useTool')} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('home.why.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('home.why.free.title')}</h4>
              <p className="text-sm text-gray-500">{t('home.why.free.desc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('home.why.privacy.title')}</h4>
              <p className="text-sm text-gray-500">{t('home.why.privacy.desc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('home.why.fast.title')}</h4>
              <p className="text-sm text-gray-500">{t('home.why.fast.desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
