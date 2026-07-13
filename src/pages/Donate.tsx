import React from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Heart, AlertTriangle } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function Donate() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <>
      <SEO 
        title={t('donate.title') || "Donate to DevToolz"} 
        description={t('donate.description') || "Support DevToolz. Please note that donations are currently only available within South Korea."} 
        url={`/${currentLang}/donate`} 
      />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            {t('donate.heading') || "Support DevToolz"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('donate.subheading') || "Your support helps us keep these tools free and running."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start space-x-3 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  Notice for International Visitors
                </h3>
                <p className="text-sm opacity-90">
                  Currently, we can only accept donations from within South Korea via the KakaoPay QR code below. Unfortunately, international donations are not supported at this time. However, we sincerely thank you for visiting this page and wanting to support us!
                </p>
                <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-800/50">
                  <h3 className="font-semibold mb-1">
                    해외 후원 관련 안내
                  </h3>
                  <p className="text-sm opacity-90">
                    현재 후원은 아래 카카오페이 QR 코드를 통한 국내(대한민국) 결제만 가능하며, 해외 결제는 지원하지 않습니다. 후원하고자 하는 마음으로 방문해주셔서 진심으로 감사드립니다!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              KakaoPay / 카카오페이 송금
            </h2>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <img 
                src="/donate-qr.png" 
                alt="KakaoPay Donation QR Code" 
                className="w-64 h-64 object-contain rounded-lg"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
              {t('donate.scanInstruction') || "Open the KakaoTalk app and scan this QR code to send a donation."}
              <br/>
              <span className="text-sm">카카오톡 앱을 열고 QR 코드를 스캔하여 후원해주세요.</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
