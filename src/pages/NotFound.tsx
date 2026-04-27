import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function NotFound() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <>
      <SEO 
        title={`${t('notfound.title')} - DevToolz`}
        description={t('notfound.desc')}
        url={`/${currentLang}/404`}
      />

      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-3xl mb-8">
          <FileQuestion className="h-16 w-16 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t('notfound.title')}
        </h2>
        
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
          {t('notfound.desc')}
        </p>

        <Link 
          to={`/${currentLang}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('notfound.back')}
        </Link>
      </div>
    </>
  );
}
