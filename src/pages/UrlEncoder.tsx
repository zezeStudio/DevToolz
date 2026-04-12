import React, { useState, useEffect, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, Link as LinkIcon, Info, ArrowDownUp, Globe, Hash, ListTree } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [encodeMode, setEncodeMode] = useState<'component' | 'uri'>('component');
  const [lastAction, setLastAction] = useState<'encode' | 'decode'>('encode');
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const handleEncode = (textToEncode: string = input) => {
    if (!textToEncode) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const encoded = encodeMode === 'component' 
        ? encodeURIComponent(textToEncode) 
        : encodeURI(textToEncode);
      setOutput(encoded);
      setError(null);
      setLastAction('encode');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDecode = (textToDecode: string = input) => {
    if (!textToDecode) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const decoded = encodeMode === 'component'
        ? decodeURIComponent(textToDecode)
        : decodeURI(textToDecode);
      setOutput(decoded);
      setError(null);
      setLastAction('decode');
    } catch (err) {
      setError("Invalid URL-encoded string");
    }
  };

  // Live Mode Effect
  useEffect(() => {
    if (isLiveMode) {
      if (lastAction === 'encode') {
        handleEncode(input);
      } else {
        handleDecode(input);
      }
    }
  }, [input, encodeMode, isLiveMode]);

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const swapInputOutput = () => {
    if (!output) return;
    setInput(output);
    setOutput('');
    setError(null);
    setLastAction(prev => prev === 'encode' ? 'decode' : 'encode');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  // URL Parser Logic
  const parsedUrl = useMemo(() => {
    if (!input.trim()) return null;
    try {
      // Add a dummy protocol if missing so URL parser doesn't throw for valid domains
      let urlString = input.trim();
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://') && urlString.includes('.')) {
        urlString = 'https://' + urlString;
      }
      const url = new URL(urlString);
      
      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      return {
        protocol: url.protocol,
        host: url.host,
        pathname: url.pathname,
        hash: url.hash,
        params,
        isValid: true
      };
    } catch (e) {
      return { isValid: false };
    }
  }, [input]);

  return (
    <>
      <SEO 
        title={t('url.seoTitle')}
        description={t('url.desc')}
        url={`/${currentLang}/url-encoder`}
      />

      <div className="max-w-6xl mx-auto h-full flex flex-col px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <LinkIcon className="mr-3 h-8 w-8 text-indigo-600" />
            {t('url.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('url.desc')}</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isLiveMode}
                  onChange={() => setIsLiveMode(!isLiveMode)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isLiveMode ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white dark:bg-gray-800 w-4 h-4 rounded-full transition-transform ${isLiveMode ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors">
                {t('url.liveMode')}
              </span>
            </label>

            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="encodeMode" 
                  value="component"
                  checked={encodeMode === 'component'}
                  onChange={() => setEncodeMode('component')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('url.encodeAll')}</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  name="encodeMode" 
                  value="uri"
                  checked={encodeMode === 'uri'}
                  onChange={() => setEncodeMode('uri')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('url.encodeUrl')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('url.inputLabel')}</label>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 flex items-center px-2 py-1 rounded hover:bg-red-50 dark:bg-red-900/30 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" /> {t('json.clear')}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none shadow-sm"
              placeholder="https://example.com/?q=hello world"
              spellCheck="false"
            />
            {!isLiveMode && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEncode(input)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  {t('url.encodeBtn')}
                </button>
                <button
                  onClick={() => handleDecode(input)}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  {t('url.decodeBtn')}
                </button>
              </div>
            )}
          </div>

          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('url.outputLabel')}</label>
              <div className="flex space-x-2">
                <button
                  onClick={swapInputOutput}
                  disabled={!output}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center px-2 py-1 rounded hover:bg-blue-50 dark:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Swap Input and Output"
                >
                  <ArrowDownUp className="h-4 w-4 mr-1" /> Swap
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t('json.copied') : t('json.copy')}
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <textarea
                value={output}
                readOnly
                className={`w-full h-full p-4 border rounded-xl font-mono text-sm resize-none focus:outline-none shadow-sm ${
                  error ? 'border-red-300 bg-red-50 dark:bg-red-900/30 text-red-900' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                }`}
                placeholder=""
              />
              {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 text-sm rounded-b-xl font-mono overflow-x-auto">
                  <strong>{t('json.error')}</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URL Parser Section */}
        {input && parsedUrl && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <ListTree className="h-5 w-5 mr-2 text-indigo-600" />
              {t('url.parserTitle')}
            </h3>
            
            {parsedUrl.isValid ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('url.protocol')}</div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate" title={parsedUrl.protocol}>{parsedUrl.protocol || '-'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('url.host')}</div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate" title={parsedUrl.host}>{parsedUrl.host || '-'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('url.path')}</div>
                    <div className="font-mono text-sm text-gray-900 dark:text-gray-100 truncate" title={parsedUrl.pathname}>{parsedUrl.pathname || '-'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b pb-2">{t('url.params')}</h4>
                  {parsedUrl.params && parsedUrl.params.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">Key</th>
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                          {parsedUrl.params.map((param, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900">
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 font-mono">
                                {param.key}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                                {param.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t('url.noParams')}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-500 italic">{t('url.invalidUrl')}</p>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('url.help.title')}
          </h3>
          <ul className="space-y-2 text-indigo-800 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`url.help.${num}`)}</li>
            ))}
          </ul>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('url.longDesc.title')}</h2>
          <div className="prose prose-indigo max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('url.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('url.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('url.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
