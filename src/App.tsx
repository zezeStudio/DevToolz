/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JsonFormatter } from './pages/JsonFormatter';
import { PasswordGenerator } from './pages/PasswordGenerator';
import { TextAnalyzer } from './pages/TextAnalyzer';
import { Base64Converter } from './pages/Base64Converter';
import { UrlEncoder } from './pages/UrlEncoder';
import { JwtDecoder } from './pages/JwtDecoder';
import { ColorConverter } from './pages/ColorConverter';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Contact } from './pages/Contact';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="json-formatter" element={<JsonFormatter />} />
            <Route path="password-generator" element={<PasswordGenerator />} />
            <Route path="text-analyzer" element={<TextAnalyzer />} />
            <Route path="base64-converter" element={<Base64Converter />} />
            <Route path="url-encoder" element={<UrlEncoder />} />
            <Route path="jwt-decoder" element={<JwtDecoder />} />
            <Route path="color-converter" element={<ColorConverter />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
