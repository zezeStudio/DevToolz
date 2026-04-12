/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JsonFormatter } from './pages/JsonFormatter';
import { PasswordGenerator } from './pages/PasswordGenerator';
import { TextAnalyzer } from './pages/TextAnalyzer';
import { Base64Converter } from './pages/Base64Converter';
import { UrlEncoder } from './pages/UrlEncoder';
import { JwtDecoder } from './pages/JwtDecoder';
import { ColorConverter } from './pages/ColorConverter';
import { MarkdownEditor } from './pages/MarkdownEditor';
import { UuidGenerator } from './pages/UuidGenerator';
import { HashGenerator } from './pages/HashGenerator';
import { UnixTimestampConverter } from './pages/UnixTimestampConverter';
import { QrCodeGenerator } from './pages/QrCodeGenerator';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Contact } from './pages/Contact';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageWrapper() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && ['en', 'ko', 'ja'].includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <Layout />;
}

function RootRedirect() {
  const location = useLocation();
  const path = location.pathname === '/' ? '' : location.pathname;
  return <Navigate to={`/en${path}`} replace />;
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="devtoolz-theme">
        <BrowserRouter>
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
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="contact" element={<Contact />} />
            </Route>
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
