import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

export function TermsOfService() {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={`${t('terms.title')} - DevToolz`}
        description={t('terms.desc')}
        url="/terms"
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('terms.title')}</h1>
          <p className="text-gray-500 mt-2">{t('terms.desc')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 prose prose-gray max-w-none">
          {t('terms.content').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
