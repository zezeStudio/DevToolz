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

import { Home } from './pages/Home';
// Lazy loaded pages
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
  <div className="flex h-[60vh] w-full items-center justify-center">
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
          <Routes>
            <Route path="/:lang" element={<LanguageWrapper />}>
              <Route index element={<Home />} />
              <Route path="json-formatter" element={
                <Suspense fallback={<PageLoader />}>
                  <JsonFormatter />
                </Suspense>
              } />
              <Route path="password-generator" element={
                <Suspense fallback={<PageLoader />}>
                  <PasswordGenerator />
                </Suspense>
              } />
              <Route path="text-analyzer" element={
                <Suspense fallback={<PageLoader />}>
                  <TextAnalyzer />
                </Suspense>
              } />
              <Route path="base64-converter" element={
                <Suspense fallback={<PageLoader />}>
                  <Base64Converter />
                </Suspense>
              } />
              <Route path="url-encoder" element={
                <Suspense fallback={<PageLoader />}>
                  <UrlEncoder />
                </Suspense>
              } />
              <Route path="jwt-decoder" element={
                <Suspense fallback={<PageLoader />}>
                  <JwtDecoder />
                </Suspense>
              } />
              <Route path="color-converter" element={
                <Suspense fallback={<PageLoader />}>
                  <ColorConverter />
                </Suspense>
              } />
              <Route path="markdown-editor" element={
                <Suspense fallback={<PageLoader />}>
                  <MarkdownEditor />
                </Suspense>
              } />
              <Route path="uuid-generator" element={
                <Suspense fallback={<PageLoader />}>
                  <UuidGenerator />
                </Suspense>
              } />
              <Route path="hash-generator" element={
                <Suspense fallback={<PageLoader />}>
                  <HashGenerator />
                </Suspense>
              } />
              <Route path="unix-timestamp" element={
                <Suspense fallback={<PageLoader />}>
                  <UnixTimestampConverter />
                </Suspense>
              } />
              <Route path="qr-code" element={
                <Suspense fallback={<PageLoader />}>
                  <QrCodeGenerator />
                </Suspense>
              } />
              <Route path="regex-tester" element={
                <Suspense fallback={<PageLoader />}>
                  <RegexTester />
                </Suspense>
              } />
              <Route path="diff-checker" element={
                <Suspense fallback={<PageLoader />}>
                  <DiffChecker />
                </Suspense>
              } />
              <Route path="image-compressor" element={
                <Suspense fallback={<PageLoader />}>
                  <ImageCompressor />
                </Suspense>
              } />
              <Route path="privacy" element={
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicy />
                </Suspense>
              } />
              <Route path="terms" element={
                <Suspense fallback={<PageLoader />}>
                  <TermsOfService />
                </Suspense>
              } />
              <Route path="contact" element={
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
              } />
              <Route path="about" element={
                <Suspense fallback={<PageLoader />}>
                  <AboutUs />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<PageLoader />}>
                  <NotFound />
                </Suspense>
              } />
            </Route>
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
