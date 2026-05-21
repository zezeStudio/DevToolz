import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { MessageSquare, ExternalLink } from 'lucide-react';

export function Contact() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeTRGpcnf75QdJMVMtp3MQ0TlhKvPFCCVlX9pgolqlYxgVYSw/viewform?usp=publish-editor";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${t('contact.title')} - DevToolz`} 
        description={t('contact.desc')}
        url={`/${currentLang}/contact`}
      />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('contact.title')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {t('contact.desc')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <MessageSquare className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('contact.needHelp')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          {t('contact.formDesc')}
        </p>
        <a 
          href={GOOGLE_FORM_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <ExternalLink className="w-5 h-5 mr-3" />
          {t('contact.openForm')}
        </a>
      </div>
    </div>
  );
}
