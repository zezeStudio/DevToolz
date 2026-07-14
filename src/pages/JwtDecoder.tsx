import React, { useState, useMemo, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Trash2, Info, FileJson, AlertCircle, Copy, Check, ShieldCheck, ShieldAlert, Clock, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export function JwtDecoder() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  
  // Decode State
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeSecret, setDecodeSecret] = useState('');
  
  // Encode State
  const [encodeAlg, setEncodeAlg] = useState('HS256');
  const [encodeHeader, setEncodeHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [encodePayload, setEncodePayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [encodeSecret, setEncodeSecret] = useState('your-256-bit-secret');
  const [copied, setCopied] = useState(false);

  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  // --- Utility Functions ---
  const base64urlEncode = (str: string) => {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  };

  const decodeB64 = (str: string) => {
    try {
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const pad = b64.length % 4;
      const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
      return decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch (e) {
      return null;
    }
  };

  // --- Decode Logic ---
  const decoded = useMemo(() => {
    if (!decodeInput.trim()) return null;
    
    const parts = decodeInput.trim().split('.');
    if (parts.length !== 3) {
      return { error: t('jwt.invalid') };
    }

    const headerStr = decodeB64(parts[0]);
    const payloadStr = decodeB64(parts[1]);

    if (!headerStr || !payloadStr) {
      return { error: t('jwt.invalid') };
    }

    try {
      const header = JSON.parse(headerStr);
      const payload = JSON.parse(payloadStr);
      
      // Signature Verification
      let signatureValid: boolean | null = null;
      if (decodeSecret) {
        const signatureInput = `${parts[0]}.${parts[1]}`;
        const alg = header.alg;
        let hash;
        
        if (alg === 'HS256') hash = CryptoJS.HmacSHA256(signatureInput, decodeSecret);
        else if (alg === 'HS384') hash = CryptoJS.HmacSHA384(signatureInput, decodeSecret);
        else if (alg === 'HS512') hash = CryptoJS.HmacSHA512(signatureInput, decodeSecret);
        
        if (hash) {
          const expectedSig = CryptoJS.enc.Base64.stringify(hash).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
          signatureValid = expectedSig === parts[2];
        }
      }

      return { header, payload, signature: parts[2], signatureValid, error: null };
    } catch (e) {
      return { error: t('jwt.invalid') };
    }
  }, [decodeInput, decodeSecret, t]);

  // --- Encode Logic ---
  // Update header automatically when algorithm changes
  useEffect(() => {
    try {
      const headerObj = JSON.parse(encodeHeader);
      headerObj.alg = encodeAlg;
      setEncodeHeader(JSON.stringify(headerObj, null, 2));
    } catch (e) {
      // Ignore if JSON is currently invalid
    }
  }, [encodeAlg]);

  const encoded = useMemo(() => {
    try {
      JSON.parse(encodeHeader);
      JSON.parse(encodePayload);

      const headerB64 = base64urlEncode(encodeHeader);
      const payloadB64 = base64urlEncode(encodePayload);
      
      const signatureInput = `${headerB64}.${payloadB64}`;
      let hash;
      
      if (encodeAlg === 'HS256') hash = CryptoJS.HmacSHA256(signatureInput, encodeSecret);
      else if (encodeAlg === 'HS384') hash = CryptoJS.HmacSHA384(signatureInput, encodeSecret);
      else if (encodeAlg === 'HS512') hash = CryptoJS.HmacSHA512(signatureInput, encodeSecret);
      else hash = CryptoJS.HmacSHA256(signatureInput, encodeSecret); // Fallback

      const signatureB64 = CryptoJS.enc.Base64.stringify(hash)
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      return { token: `${signatureInput}.${signatureB64}`, error: null };
    } catch (e) {
      return { token: '', error: t('jwt.encodeError') };
    }
  }, [encodeHeader, encodePayload, encodeSecret, encodeAlg, t]);

  // --- UI Handlers ---
  const clearDecode = () => {
    setDecodeInput('');
    setDecodeSecret('');
  };
  
  const copyToClipboard = async () => {
    if (!encoded.token) return;
    try {
      await navigator.clipboard.writeText(encoded.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const formatJson = (obj: any) => JSON.stringify(obj, null, 2);

  const addOneHourToExp = () => {
    try {
      const payloadObj = JSON.parse(encodePayload);
      const now = Math.floor(Date.now() / 1000);
      payloadObj.exp = (payloadObj.exp && payloadObj.exp > now ? payloadObj.exp : now) + 3600;
      setEncodePayload(JSON.stringify(payloadObj, null, 2));
    } catch (e) {
      // Ignore if invalid JSON
    }
  };

  const updateIatToNow = () => {
    try {
      const payloadObj = JSON.parse(encodePayload);
      payloadObj.iat = Math.floor(Date.now() / 1000);
      setEncodePayload(JSON.stringify(payloadObj, null, 2));
    } catch (e) {
      // Ignore if invalid JSON
    }
  };

  const renderPayloadWithTimestamps = (payload: any) => {
    const formatted = formatJson(payload);
    const highlighted = formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'text-purple-600 dark:text-purple-400 font-medium'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-teal-600 dark:text-teal-400 font-semibold'; // key
          } else {
            cls = 'text-orange-600 dark:text-orange-400'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-emerald-600 dark:text-emerald-500 font-medium'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-slate-400 dark:text-slate-400 italic'; // null
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });

    return <div dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  const renderTimestamps = (payload: any) => {
    const timeClaims = ['exp', 'iat', 'nbf'];
    const foundClaims = timeClaims.filter(claim => payload && typeof payload[claim] === 'number');

    if (foundClaims.length === 0) return null;

    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Timestamps</h4>
        <div className="space-y-2">
          {foundClaims.map(claim => {
            const date = new Date(payload[claim] * 1000);
            const isExpired = claim === 'exp' && date < new Date();
            return (
              <div key={claim} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{claim}</span>
                  <span className="text-gray-500 dark:text-gray-400">{date.toLocaleString()}</span>
                </div>
                {claim === 'exp' && (
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${isExpired ? 'bg-red-100 text-red-700 dark:text-red-400' : 'bg-green-100 text-green-600 dark:text-green-400'}`}>
                    {isExpired ? 'Expired' : 'Valid'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <SEO 
        title={t('jwt.seoTitle')}
        description={t('jwt.desc')}
        url={`/${currentLang}/jwt-decoder`}
      />

      <div className="max-w-6xl mx-auto h-full flex flex-col px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FileJson className="mr-3 h-8 w-8 text-teal-600 dark:text-teal-400" />
            {t('jwt.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('jwt.desc')}</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl w-fit mb-6 border border-slate-200 dark:border-slate-800/50">
          <button
            onClick={() => setMode('decode')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'decode' 
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {t('jwt.modeDecode')}
          </button>
          <button
            onClick={() => setMode('encode')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'encode' 
                ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-400 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {t('jwt.modeEncode')}
          </button>
        </div>

        {mode === 'decode' ? (
          /* ================= DECODE MODE ================= */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
            {/* Input Area */}
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">{t('jwt.inputLabel')}</label>
                  <button
                    onClick={clearDecode}
                    className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-700 dark:text-red-400 flex items-center px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> {t('json.clear')}
                  </button>
                </div>
                <textarea
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm resize-none shadow-sm break-all bg-slate-50 dark:bg-black/20"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('jwt.verifyLabel')}</label>
                <input
                  type="text"
                  value={decodeSecret}
                  onChange={(e) => setDecodeSecret(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm shadow-sm bg-slate-50 dark:bg-black/20"
                  placeholder="Secret Key (Optional)"
                />
              </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full space-y-4">
              {decoded?.error ? (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 flex flex-col items-center justify-center h-full text-red-500">
                  <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
                  <p className="font-medium">{decoded.error}</p>
                </div>
              ) : decoded ? (
                <>
                  {/* Header (Red theme) */}
                  <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="bg-red-50 dark:bg-red-900/30 px-4 py-2 border-b border-red-10border-red-100 dark:border-red-900/50">
                      <label className="font-semibold text-red-900 dark:text-red-300 text-sm">{t('jwt.headerLabel')}</label>
                    </div>
                    <div className="p-4 overflow-auto max-h-48 text-red-900 dark:text-red-200">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {renderPayloadWithTimestamps(decoded.header)}
                      </pre>
                    </div>
                  </div>

                  {/* Payload (Purple theme) */}
                  <div className="bg-white dark:bg-gray-800 border border-purple-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
                    <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-2 border-b border-purple-10border-purple-100 dark:border-purple-900/50">
                      <label className="font-semibold text-purple-900 dark:text-purple-300 text-sm">{t('jwt.payloadLabel')}</label>
                    </div>
                    <div className="p-4 overflow-auto flex-1 text-purple-900 dark:text-purple-200">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {renderPayloadWithTimestamps(decoded.payload)}
                      </pre>
                      {renderTimestamps(decoded.payload)}
                    </div>
                  </div>

                  {/* Signature (Blue theme) */}
                  <div className="bg-white dark:bg-gray-800 border border-blue-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 border-b border-blue-10border-blue-100 dark:border-blue-900/50 flex justify-between items-center">
                      <label className="font-semibold text-blue-900 dark:text-blue-300 text-sm">{t('jwt.signatureLabel')}</label>
                      {decoded.signatureValid === true && (
                        <span className="flex items-center text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 px-2 py-1 rounded">
                          <ShieldCheck className="w-3 h-3 mr-1" /> {t('jwt.sigValid')}
                        </span>
                      )}
                      {decoded.signatureValid === false && (
                        <span className="flex items-center text-xs font-bold text-red-700 dark:text-red-400 bg-red-100 px-2 py-1 rounded">
                          <ShieldAlert className="w-3 h-3 mr-1" /> {t('jwt.sigInvalid')}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-sm text-blue-900 dark:text-blue-300 break-all">
                        {decoded.signature}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full space-y-4 opacity-70">
                  {/* Header Placeholder */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl flex flex-col overflow-hidden h-32">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 border-dashed">
                      <label className="font-semibold text-slate-400 dark:text-slate-400 text-sm">{t('jwt.headerLabel')}</label>
                    </div>
                    <div className="p-4 flex items-center justify-center h-full">
                       <span className="text-slate-300 dark:text-slate-600 font-mono text-sm">{"{ ... }"}</span>
                    </div>
                  </div>

                  {/* Payload Placeholder */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl flex flex-col flex-1 overflow-hidden min-h-[150px]">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 border-dashed">
                      <label className="font-semibold text-slate-400 dark:text-slate-400 text-sm">{t('jwt.payloadLabel')}</label>
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center flex-1">
                      <FileJson className="h-10 w-10 mb-3 text-slate-400 dark:text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">{t('jwt.pasteToDecode')}</p>
                    </div>
                  </div>

                  {/* Signature Placeholder */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl flex flex-col overflow-hidden h-24">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 border-dashed">
                      <label className="font-semibold text-slate-400 dark:text-slate-400 text-sm">{t('jwt.signatureLabel')}</label>
                    </div>
                    <div className="p-4 flex items-center justify-center h-full">
                       <span className="text-slate-300 dark:text-slate-600 font-mono text-xs truncate">********************</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= ENCODE MODE ================= */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
            {/* Input Area */}
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">{t('jwt.headerLabel')}</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('jwt.algorithm')}:</span>
                    <select
                      value={encodeAlg}
                      onChange={(e) => setEncodeAlg(e.target.value)}
                      className="text-xs border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-1 pl-2 pr-6"
                    >
                      <option value="HS256">HS256</option>
                      <option value="HS384">HS384</option>
                      <option value="HS512">HS512</option>
                    </select>
                  </div>
                </div>
                <textarea
                  value={encodeHeader}
                  onChange={(e) => setEncodeHeader(e.target.value)}
                  className="flex-1 w-full p-4 border border-red-200 dark:border-red-800 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm resize-none shadow-sm text-red-900 dark:bg-red-900/30 bg-slate-50 dark:bg-black/20"
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-700 dark:text-gray-300">{t('jwt.payloadLabel')}</label>
                  <div className="flex space-x-2">
                    <button onClick={updateIatToNow} className="text-xs flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/50 px-2 py-1 rounded border border-purple-100 dark:border-purple-800/50">
                      <Clock className="w-3 h-3 mr-1" /> {t('jwt.updateIat')}
                    </button>
                    <button onClick={addOneHourToExp} className="text-xs flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/50 px-2 py-1 rounded border border-purple-100 dark:border-purple-800/50">
                      <Clock className="w-3 h-3 mr-1" /> {t('jwt.add1h')}
                    </button>
                  </div>
                </div>
                <textarea
                  value={encodePayload}
                  onChange={(e) => setEncodePayload(e.target.value)}
                  className="flex-1 w-full p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm resize-none shadow-sm text-purple-900 dark:bg-purple-900/30 bg-slate-50 dark:bg-black/20"
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('jwt.secretLabel')}</label>
                <input
                  type="text"
                  value={encodeSecret}
                  onChange={(e) => setEncodeSecret(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm shadow-sm text-blue-900 dark:bg-blue-900/30 bg-slate-50 dark:bg-black/20"
                  placeholder="your-256-bit-secret"
                />
              </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700 dark:text-gray-300">{t('jwt.encodedOutput')}</label>
                <button
                  onClick={copyToClipboard}
                  disabled={!encoded.token}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t('json.copied') : t('json.copy')}
                </button>
              </div>
              <div className="relative flex-1">
                <textarea
                  value={encoded.token}
                  readOnly
                  className={`w-full h-full p-4 border rounded-xl font-mono text-sm resize-none focus:outline-none shadow-sm break-all ${
                    encoded.error ? 'border-red-300 bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-200' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                  }`}
                  placeholder=""
                />
                {encoded.error && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 text-sm rounded-b-xl font-mono overflow-x-auto">
                    <strong>{t('json.error')}</strong> {encoded.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-10border-teal-100 dark:border-teal-900/50">
          <h3 className="text-lg font-bold text-teal-900 dark:text-teal-300 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('jwt.help.title')}
          </h3>
          <ul className="space-y-2 text-teal-600 dark:text-teal-400 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`jwt.help.${num}`)}</li>
            ))}
          </ul>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('jwt.longDesc.title')}</h2>
          <div className="prose prose-teal dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('jwt.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('jwt.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('jwt.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('jwt.longDesc.p4')}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('jwt.longDesc.p5')}
              </p>
            </div>
          </div>
        </div>
      </div>
    
      
      {/* 하드코딩된 SEO 텍스트 콘텐츠 */}
      <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700 max-w-4xl mx-auto space-y-12 pb-12">
        
        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '자주 묻는 질문 (FAQ)' : i18n.language === 'ja' ? 'よくある質問 (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JWT Decoder 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                JWT Decoder 도구는 decode json web tokens 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JWT Decoder 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! JWT Decoder의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. JWT Decoder 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JWT Decoder ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                JWT Decoder ツールは、decode json web tokens するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JWT Decoder を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！JWT Decoder のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。JWT Decoder ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the JWT Decoder tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The JWT Decoder is a specialized utility designed to decode json web tokens. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the JWT Decoder?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the JWT Decoder happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The JWT Decoder is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
              </p>
            </div>
            </div>
          )}
        </section>

        {/* Use Cases Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '이 툴이 필요한 구체적인 실무 사례 3가지' : i18n.language === 'ja' ? 'このツールが必要な3つの具体的な実務ケース' : '3 Specific Practical Use Cases'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 decode json web tokens 작업이 필요할 때 매우 유용합니다.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                클라이언트의 민감한 데이터를 다루고 있어 서버 측 도구를 사용할 수 없을 때 안전하게 사용할 수 있습니다.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                교육적 목적으로 학생이나 초보자들이 관련 프로세스가 시각적으로 어떻게 작동하는지 이해하는 데 도움을 줍니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                プロジェクトの作業中に、開発環境を離れることなく迅速に decode json web tokens したい場合に非常に便利です。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                クライアントの機密データを扱っており、サーバー側のツールを使用して処理できない場合に安全に使用できます。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                教育目的で、学生や初心者が関連するプロセスが視覚的にどのように機能するかを理解するのに役立ちます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When you are working on a project and need to quickly decode json web tokens without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to decode json web tokens.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how decode processes work visually.
              </p>
            </div>
            </div>
          )}
        </section>

        {/* Precautions Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '사용 시 주의사항 및 에러 해결법' : i18n.language === 'ja' ? '使用上の注意とエラー解決策' : 'Precautions & Error Resolution'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">대용량 데이터를 처리할 때 성능 저하를 방지하려면 브라우저를 최신 버전으로 업데이트하여 사용하시기 바랍니다.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">입력 데이터가 너무 커서 브라우저 메모리 한계를 초과하면 도구가 응답하지 않을 수 있습니다. 이 경우 데이터를 더 작은 크기로 나누어 시도하세요.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">다른 도구로 전환할 때 예기치 않은 서식 문제나 레이아웃 버그가 발생하면 브라우저 캐시를 삭제해 보세요.</span>
              </li>
              </ul>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">大量のデータを処理する際のパフォーマンス低下を防ぐため、ブラウザを最新バージョンにアップデートしてご使用ください。</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">入力データが大きすぎてブラウザのメモリ制限を超えると、ツールが応答しなくなる可能性があります。その場合は、データを小さく分割してお試しください。</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">別のツールに切り替える際に予期しないフォーマットの問題やレイアウトのバグが発生した場合は、ブラウザのキャッシュをクリアしてみてください。</span>
              </li>
              </ul>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">Ensure your browser is updated to the latest version to avoid performance issues while processing large inputs.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">If the tool becomes unresponsive, check if the input size exceeds typical browser memory limits. Try splitting your data into smaller chunks.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">Clear your browser cache if you experience unexpected formatting or layout bugs when switching between different tools.</span>
              </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </>
  );
}