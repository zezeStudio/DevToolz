import React from 'react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { Info, Code2, Globe, Shield } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function AboutUs() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <>
      <SEO 
        title={`${t('about.title')} - DevToolz`}
        description={t('about.desc')}
        url={`/${currentLang}/about`}
      />

      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
            <Info className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('about.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg leading-relaxed">{t('about.desc')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8 prose prose-blue dark:prose-invert max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-4 not-prose">
            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Code2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('about.mission.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('about.mission.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('about.privacy.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('about.privacy.desc')}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('about.global.title')}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('about.global.desc')}</p>
            </div>
          </div>

          <hr className="my-8 border-gray-200 dark:border-gray-700" />

          {t('about.content').split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
            }
            return (
              <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
