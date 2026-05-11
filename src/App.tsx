/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { useTranslation } from 'react-i18next';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const JsonFormatter = lazy(() => import('./pages/JsonFormatter').then(m => ({ default: m.JsonFormatter })));
const PasswordGenerator = lazy(() => import('./pages/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const TextAnalyzer = lazy(() => import('./pages/TextAnalyzer').then(m => ({ default: m.TextAnalyzer })));
const Base64Converter = lazy(() => import('./pages/Base64Converter').then(m => ({ default: m.Base64Converter })));
const UrlEncoder = lazy(() => import('./pages/UrlEncoder').then(m => ({ default: m.UrlEncoder })));
const JwtDecoder = lazy(() => import('./pages/JwtDecoder').then(m => ({ default: m.JwtDecoder })));
const ColorConverter = lazy(() => import('./pages/ColorConverter').then(m => ({ default: m.ColorConverter })));
const MarkdownEditor = lazy(() => import('./pages/MarkdownEditor').then(m => ({ default: m.MarkdownEditor })));
const UuidGenerator = lazy(() => import('./pages/UuidGenerator').then(m => ({ default: m.UuidGenerator })));
const HashGenerator = lazy(() => import('./pages/HashGenerator').then(m => ({ default: m.HashGenerator })));
const UnixTimestampConverter = lazy(() => import('./pages/UnixTimestampConverter').then(m => ({ default: m.UnixTimestampConverter })));
const QrCodeGenerator = lazy(() => import('./pages/QrCodeGenerator').then(m => ({ default: m.QrCodeGenerator })));
const RegexTester = lazy(() => import('./pages/RegexTester').then(m => ({ default: m.RegexTester })));
const DiffChecker = lazy(() => import('./pages/DiffChecker').then(m => ({ default: m.DiffChecker })));
const ImageCompressor = lazy(() => import('./pages/ImageCompressor').then(m => ({ default: m.ImageCompressor })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const AboutUs = lazy(() => import('./pages/AboutUs').then(m => ({ default: m.AboutUs })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
  </div>
);

function LanguageWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const supportedLangs = ['en', 'ko', 'ja'];
    if (lang && supportedLangs.includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
        document.documentElement.lang = lang;
      }
    }
  }, [lang, i18n]);

  const supportedLangs = ['en', 'ko', 'ja'];
  const basePath = location.pathname.split('/').slice(2).join('/');
  const trailingPath = basePath ? `/${basePath}` : '';

  return (
    <>
      <Helmet>
        {supportedLangs.map((l) => (
          <link 
            key={l}
            rel="alternate" 
            hrefLang={l} 
            href={`https://www.zezelab.xyz/${l}${trailingPath}`} 
          />
        ))}
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href={`https://www.zezelab.xyz/en${trailingPath}`} 
        />
      </Helmet>
      <Layout />
    </>
  );
}

function RootRedirect() {
  const location = useLocation();
  const path = location.pathname === '/' ? '' : location.pathname;
  return <Navigate to={`/en${path}`} replace />;
}

function PrerenderEvent() {
  useEffect(() => {
    // Small delay to ensure everything is rendered and i18n is applied
    const timer = setTimeout(() => {
      document.dispatchEvent(new Event('render-event'));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="devtoolz-theme">
        <BrowserRouter>
          <PrerenderEvent />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/:lang" element={<LanguageWrapper />}>
                <Route index element={<Home />} />
                <Route path="json-formatter" element={<JsonFormatter />} />
                <Route path="password-generator" element={<PasswordGenerator />} />
                <Route path="text-analyzer" element={<TextAnalyzer />} />
                <Route path="base64-converter" element={<Base64Converter />} />
                <Route path="url-encoder" element={<UrlEncoder />} />
                <Route path="jwt-decoder" element={<JwtDecoder />} />
                <Route path="color-converter" element={<ColorConverter />} />
                <Route path="markdown-editor" element={<MarkdownEditor />} />
                <Route path="uuid-generator" element={<UuidGenerator />} />
                <Route path="hash-generator" element={<HashGenerator />} />
                <Route path="unix-timestamp" element={<UnixTimestampConverter />} />
                <Route path="qr-code" element={<QrCodeGenerator />} />
                <Route path="regex-tester" element={<RegexTester />} />
                <Route path="diff-checker" element={<DiffChecker />} />
                <Route path="image-compressor" element={<ImageCompressor />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="contact" element={<Contact />} />
                <Route path="about" element={<AboutUs />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
