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
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-3xl mb-8">
          <FileQuestion className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
        </div>
        
        <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          {t('notfound.title')}
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
          {t('notfound.desc')}
        </p>

        <Link 
          to={`/${currentLang}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('notfound.back')}
        </Link>
      </div>
    </>
  );
}
