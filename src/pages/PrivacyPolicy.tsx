import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function PrivacyPolicy() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <>
      <SEO 
        title={`${t('privacy.title')} - DevToolz`}
        description={t('privacy.desc')}
        url={`/${currentLang}/privacy`}
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('privacy.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('privacy.desc')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 prose prose-blue dark:prose-invert max-w-none">
          {t('privacy.content').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
