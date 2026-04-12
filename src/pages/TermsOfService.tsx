import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function TermsOfService() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <>
      <SEO 
        title={`${t('terms.title')} - DevToolz`}
        description={t('terms.desc')}
        url={`/${currentLang}/terms`}
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('terms.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('terms.desc')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 prose prose-gray max-w-none">
          {t('terms.content').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
