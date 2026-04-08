import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';

export function Contact() {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={`${t('contact.title')} - DevToolz`}
        description={t('contact.desc')}
        url="/contact"
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <Mail className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('contact.title')}</h1>
          <p className="text-gray-500 mt-2">{t('contact.desc')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-700 leading-relaxed mb-6 text-lg">
            {t('contact.content')}
          </p>
          <div className="inline-flex flex-col items-center p-6 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-500 mb-2">{t('contact.email')}</span>
            <a 
              href="mailto:zezeteam2026@gmail.com" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              zezeteam2026@gmail.com
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
