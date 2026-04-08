import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <SEO 
        title={`${t('privacy.title')} - DevToolz`}
        description={t('privacy.desc')}
        url="/privacy"
      />

      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('privacy.title')}</h1>
          <p className="text-gray-500 mt-2">{t('privacy.desc')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 prose prose-blue max-w-none">
          {t('privacy.content').split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
