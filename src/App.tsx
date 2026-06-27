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
const JsonToTsConverter = lazy(() => import('./pages/JsonToTsConverter').then(m => ({ default: m.JsonToTsConverter })));
const TokenCounter = lazy(() => import('./pages/TokenCounter').then(m => ({ default: m.TokenCounter })));
const LlmOptimizer = lazy(() => import('./pages/LlmOptimizer').then(m => ({ default: m.LlmOptimizer })));
const PromptWrapper = lazy(() => import('./pages/PromptWrapper').then(m => ({ default: m.PromptWrapper })));
const ChunkingSimulator = lazy(() => import('./pages/ChunkingSimulator').then(m => ({ default: m.ChunkingSimulator })));
const SystemPromptGenerator = lazy(() => import('./pages/SystemPromptGenerator').then(m => ({ default: m.SystemPromptGenerator })));
const PromptVariableInjector = lazy(() => import('./pages/PromptVariableInjector').then(m => ({ default: m.PromptVariableInjector })));
const LlmParameterPlayground = lazy(() => import('./pages/LlmParameterPlayground').then(m => ({ default: m.LlmParameterPlayground })));
const XmlGuardrailGenerator = lazy(() => import('./pages/XmlGuardrailGenerator').then(m => ({ default: m.XmlGuardrailGenerator })));
const FewShotBuilder = lazy(() => import('./pages/FewShotBuilder').then(m => ({ default: m.FewShotBuilder })));
const PromptTokenSplitter = lazy(() => import('./pages/PromptTokenSplitter').then(m => ({ default: m.PromptTokenSplitter })));
const JsonSchemaGenerator = lazy(() => import('./pages/JsonSchemaGenerator').then(m => ({ default: m.JsonSchemaGenerator })));
const FunctionCallingBuilder = lazy(() => import('./pages/FunctionCallingBuilder').then(m => ({ default: m.FunctionCallingBuilder })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));
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
  const { lang = 'en' } = useParams();
  const { i18n } = useTranslation();
  const location = useLocation();

  if (location.pathname === '/en' || location.pathname.startsWith('/en/')) {
    return <Navigate to={location.pathname.replace(/^\/en/, '') || '/'} replace />;
  }

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
  
  // Extract path without lang prefix
  const pathParts = location.pathname.split('/').filter(Boolean);
  const hasLangPrefix = pathParts.length > 0 && supportedLangs.includes(pathParts[0]);
  const basePath = hasLangPrefix ? pathParts.slice(1).join('/') : pathParts.join('/');
  const trailingPath = basePath ? `/${basePath}` : '';

  return (
    <>
      <Helmet>
        {supportedLangs.map((l) => {
          const langPrefix = l === 'en' ? '' : `/${l}`;
          return (
            <link 
              key={l}
              rel="alternate" 
              hrefLang={l} 
              href={`https://www.zezelab.xyz${langPrefix}${trailingPath}`} 
            />
          );
        })}
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href={`https://www.zezelab.xyz${trailingPath}`} 
        />
        <link 
          rel="canonical" 
          href={`https://www.zezelab.xyz${lang === 'en' ? '' : `/${lang}`}${trailingPath}`} 
        />
      </Helmet>
      <Layout />
    </>
  );
}


function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).wcs && (window as any).wcs_do) {
      (window as any).wcs_do();
    }
  }, [location.pathname, location.search]);

  return null;
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
      <ThemeProvider defaultTheme="light" storageKey="devtoolz-theme">
        <BrowserRouter>
          <AnalyticsTracker />
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
              <Route path="json-schema-generator" element={<Suspense fallback={<PageLoader />}><JsonSchemaGenerator /></Suspense>} />
              <Route path="function-calling-builder" element={<Suspense fallback={<PageLoader />}><FunctionCallingBuilder /></Suspense>} />
              <Route path="json-to-ts" element={
                <Suspense fallback={<PageLoader />}>
                  <JsonToTsConverter />
                </Suspense>
              } />
              <Route path="token-counter" element={
                <Suspense fallback={<PageLoader />}>
                  <TokenCounter />
                </Suspense>
              } />
              <Route path="llm-optimizer" element={
                <Suspense fallback={<PageLoader />}>
                  <LlmOptimizer />
                </Suspense>
              } />
              <Route path="prompt-wrapper" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptWrapper />
                </Suspense>
              } />
              <Route path="chunking-simulator" element={
                <Suspense fallback={<PageLoader />}>
                  <ChunkingSimulator />
                </Suspense>
              } />
              <Route path="system-prompt" element={
                <Suspense fallback={<PageLoader />}>
                  <SystemPromptGenerator />
                </Suspense>
              } />
              <Route path="prompt-variable-injector" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptVariableInjector />
                </Suspense>
              } />
              <Route path="llm-parameter-playground" element={
                <Suspense fallback={<PageLoader />}>
                  <LlmParameterPlayground />
                </Suspense>
              } />
              <Route path="xml-guardrail-generator" element={
                <Suspense fallback={<PageLoader />}>
                  <XmlGuardrailGenerator />
                </Suspense>
              } />
              <Route path="few-shot-builder" element={
                <Suspense fallback={<PageLoader />}>
                  <FewShotBuilder />
                </Suspense>
              } />
              <Route path="prompt-token-splitter" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptTokenSplitter />
                </Suspense>
              } />
              <Route path="blog" element={
                <Suspense fallback={<PageLoader />}>
                  <Blog />
                </Suspense>
              } />
              <Route path="blog/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <BlogPost />
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
            <Route path="/" element={<LanguageWrapper />}>
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
              <Route path="json-schema-generator" element={<Suspense fallback={<PageLoader />}><JsonSchemaGenerator /></Suspense>} />
              <Route path="function-calling-builder" element={<Suspense fallback={<PageLoader />}><FunctionCallingBuilder /></Suspense>} />
              <Route path="json-to-ts" element={
                <Suspense fallback={<PageLoader />}>
                  <JsonToTsConverter />
                </Suspense>
              } />
              <Route path="token-counter" element={
                <Suspense fallback={<PageLoader />}>
                  <TokenCounter />
                </Suspense>
              } />
              <Route path="llm-optimizer" element={
                <Suspense fallback={<PageLoader />}>
                  <LlmOptimizer />
                </Suspense>
              } />
              <Route path="prompt-wrapper" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptWrapper />
                </Suspense>
              } />
              <Route path="chunking-simulator" element={
                <Suspense fallback={<PageLoader />}>
                  <ChunkingSimulator />
                </Suspense>
              } />
              <Route path="system-prompt" element={
                <Suspense fallback={<PageLoader />}>
                  <SystemPromptGenerator />
                </Suspense>
              } />
              <Route path="prompt-variable-injector" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptVariableInjector />
                </Suspense>
              } />
              <Route path="llm-parameter-playground" element={
                <Suspense fallback={<PageLoader />}>
                  <LlmParameterPlayground />
                </Suspense>
              } />
              <Route path="xml-guardrail-generator" element={
                <Suspense fallback={<PageLoader />}>
                  <XmlGuardrailGenerator />
                </Suspense>
              } />
              <Route path="few-shot-builder" element={
                <Suspense fallback={<PageLoader />}>
                  <FewShotBuilder />
                </Suspense>
              } />
              <Route path="prompt-token-splitter" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptTokenSplitter />
                </Suspense>
              } />
              <Route path="blog" element={
                <Suspense fallback={<PageLoader />}>
                  <Blog />
                </Suspense>
              } />
              <Route path="blog/:id" element={
                <Suspense fallback={<PageLoader />}>
                  <BlogPost />
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
                      </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
