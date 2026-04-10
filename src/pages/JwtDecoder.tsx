import React, { useState, useMemo, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Trash2, Info, FileJson, AlertCircle, Copy, Check, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

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
        let cls = 'text-blue-600'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-gray-900 font-bold'; // key
          } else {
            cls = 'text-green-600'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-orange-600'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-500'; // null
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
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Timestamps</h4>
        <div className="space-y-2">
          {foundClaims.map(claim => {
            const date = new Date(payload[claim] * 1000);
            const isExpired = claim === 'exp' && date < new Date();
            return (
              <div key={claim} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-gray-700">{claim}</span>
                  <span className="text-gray-500">{date.toLocaleString()}</span>
                </div>
                {claim === 'exp' && (
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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
        title={`${t('jwt.title')} - DevToolz`}
        description={t('jwt.desc')}
        url="/jwt-decoder"
      />

      <div className="max-w-6xl mx-auto h-full flex flex-col px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileJson className="mr-3 h-8 w-8 text-teal-600" />
            {t('jwt.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('jwt.desc')}</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-6 border border-gray-200">
          <button
            onClick={() => setMode('decode')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'decode' 
                ? 'bg-white text-teal-700 shadow-sm border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('jwt.modeDecode')}
          </button>
          <button
            onClick={() => setMode('encode')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === 'encode' 
                ? 'bg-white text-teal-700 shadow-sm border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
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
                  <label className="font-semibold text-gray-700">{t('jwt.inputLabel')}</label>
                  <button
                    onClick={clearDecode}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> {t('json.clear')}
                  </button>
                </div>
                <textarea
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  className="flex-1 w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm resize-none shadow-sm break-all"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">{t('jwt.verifyLabel')}</label>
                <input
                  type="text"
                  value={decodeSecret}
                  onChange={(e) => setDecodeSecret(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm shadow-sm"
                  placeholder="Secret Key (Optional)"
                />
              </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full space-y-4">
              {decoded?.error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center h-full text-red-500">
                  <AlertCircle className="h-12 w-12 mb-4 text-red-400" />
                  <p className="font-medium">{decoded.error}</p>
                </div>
              ) : decoded ? (
                <>
                  {/* Header (Red theme) */}
                  <div className="bg-white border border-red-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="bg-red-50 px-4 py-2 border-b border-red-100">
                      <label className="font-semibold text-red-800 text-sm">{t('jwt.headerLabel')}</label>
                    </div>
                    <div className="p-4 overflow-auto max-h-48 text-red-900">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {renderPayloadWithTimestamps(decoded.header)}
                      </pre>
                    </div>
                  </div>

                  {/* Payload (Purple theme) */}
                  <div className="bg-white border border-purple-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
                    <div className="bg-purple-50 px-4 py-2 border-b border-purple-100">
                      <label className="font-semibold text-purple-800 text-sm">{t('jwt.payloadLabel')}</label>
                    </div>
                    <div className="p-4 overflow-auto flex-1 text-purple-900">
                      <pre className="font-mono text-sm whitespace-pre-wrap">
                        {renderPayloadWithTimestamps(decoded.payload)}
                      </pre>
                      {renderTimestamps(decoded.payload)}
                    </div>
                  </div>

                  {/* Signature (Blue theme) */}
                  <div className="bg-white border border-blue-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex justify-between items-center">
                      <label className="font-semibold text-blue-800 text-sm">{t('jwt.signatureLabel')}</label>
                      {decoded.signatureValid === true && (
                        <span className="flex items-center text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                          <ShieldCheck className="w-3 h-3 mr-1" /> {t('jwt.sigValid')}
                        </span>
                      )}
                      {decoded.signatureValid === false && (
                        <span className="flex items-center text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                          <ShieldAlert className="w-3 h-3 mr-1" /> {t('jwt.sigInvalid')}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-sm text-blue-800 break-all">
                        {decoded.signature}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center h-full text-gray-400">
                  <FileJson className="h-12 w-12 mb-4 text-gray-300" />
                  <p>Paste a JWT to decode it</p>
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
                  <label className="font-semibold text-gray-700">{t('jwt.headerLabel')}</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 font-medium">{t('jwt.algorithm')}:</span>
                    <select
                      value={encodeAlg}
                      onChange={(e) => setEncodeAlg(e.target.value)}
                      className="text-xs border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 py-1 pl-2 pr-6"
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
                  className="flex-1 w-full p-4 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm resize-none shadow-sm text-red-900 bg-red-50/30"
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-700">{t('jwt.payloadLabel')}</label>
                  <div className="flex space-x-2">
                    <button onClick={updateIatToNow} className="text-xs flex items-center text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                      <Clock className="w-3 h-3 mr-1" /> {t('jwt.updateIat')}
                    </button>
                    <button onClick={addOneHourToExp} className="text-xs flex items-center text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                      <Clock className="w-3 h-3 mr-1" /> {t('jwt.add1h')}
                    </button>
                  </div>
                </div>
                <textarea
                  value={encodePayload}
                  onChange={(e) => setEncodePayload(e.target.value)}
                  className="flex-1 w-full p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm resize-none shadow-sm text-purple-900 bg-purple-50/30"
                  spellCheck="false"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">{t('jwt.secretLabel')}</label>
                <input
                  type="text"
                  value={encodeSecret}
                  onChange={(e) => setEncodeSecret(e.target.value)}
                  className="w-full p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm shadow-sm text-blue-900 bg-blue-50/30"
                  placeholder="your-256-bit-secret"
                />
              </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-gray-700">{t('jwt.encodedOutput')}</label>
                <button
                  onClick={copyToClipboard}
                  disabled={!encoded.token}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t('json.copied') : t('json.copy')}
                </button>
              </div>
              <div className="relative flex-1">
                <textarea
                  value={encoded.token}
                  readOnly
                  className={`w-full h-full p-4 border rounded-xl font-mono text-sm resize-none focus:outline-none shadow-sm break-all ${
                    encoded.error ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-300 bg-gray-50 text-gray-800'
                  }`}
                  placeholder=""
                />
                {encoded.error && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 text-red-700 p-3 text-sm rounded-b-xl font-mono overflow-x-auto">
                    <strong>{t('json.error')}</strong> {encoded.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-teal-50 rounded-xl p-6 border border-teal-100">
          <h3 className="text-lg font-bold text-teal-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('jwt.help.title')}
          </h3>
          <ul className="space-y-2 text-teal-800 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`jwt.help.${num}`)}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
