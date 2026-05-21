import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useParams();
  const currentLang = lang || 'en';

  // Hardcode translations as they are simple and specific to this component,
  // or use i18n if we want to add keys, but for speed, let's just do a simple mapping.
  const translations = {
    en: {
      msg: 'This website uses cookies to ensure you get the best experience and to serve relevant advertisements via Google AdSense.',
      policy: 'Privacy Policy',
      accept: 'Got it!'
    },
    ko: {
      msg: '본 웹사이트는 최상의 사용자 경험을 제공하고 구글 애드센스를 통한 맞춤형 광고를 제공하기 위해 쿠키를 사용합니다.',
      policy: '개인정보처리방침',
      accept: '동의합니다'
    },
    ja: {
      msg: '当ウェブサイトは、最適なユーザーエクスペリエンスを提供し、広告を配信するためにCookieを使用しています。',
      policy: 'プライバシーポリシー',
      accept: '同意する'
    }
  };

  const t = translations[currentLang as keyof typeof translations] || translations.en;

  useEffect(() => {
    const consent = localStorage.getItem('devtoolz-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('devtoolz-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-blue-600 shadow-lg sm:p-3 relative overflow-hidden">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-blue-800">
                <svg className="h-6 w-6 text-white" 
                     xmlns="http://www.w3.org/2000/svg" 
                     fill="none" 
                     viewBox="0 0 24 24" 
                     stroke="currentColor" 
                     aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate text-sm sm:text-base whitespace-normal">
                <span>{t.msg}</span>
                <Link to={`/${currentLang}/privacy`} className="ml-2 underline hover:text-blue-100">
                  {t.policy}
                </Link>
              </p>
            </div>
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <button
                onClick={handleAccept}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white transition-colors"
                title={t.accept}
              >
                {t.accept}
              </button>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={handleAccept}
                title="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
