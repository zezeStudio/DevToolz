import React, { useState, useEffect, useRef } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, Binary, Info, ArrowDownUp, Upload, Download, ToggleLeft, ToggleRight, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [lastAction, setLastAction] = useState<'encode' | 'decode'>('encode');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      let encoded = btoa(encodeURIComponent(textToEncode).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(Number('0x' + p1));
        }));
      
      if (isUrlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      
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
      let base64Str = textToDecode;
      
      base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64Str.length % 4) {
        base64Str += '=';
      }

      if (base64Str.startsWith('data:')) {
        const parts = base64Str.split(',');
        if (parts.length === 2) {
          base64Str = parts[1];
        }
      }

      const decoded = decodeURIComponent(atob(base64Str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      setOutput(decoded);
      setError(null);
      setLastAction('decode');
    } catch (err) {
      setError("Invalid Base64 string");
    }
  };

  useEffect(() => {
    if (isLiveMode) {
      if (lastAction === 'encode') {
        handleEncode(input);
      } else {
        handleDecode(input);
      }
    }
  }, [input, isUrlSafe, isLiveMode]);

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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setInput(result);
      if (isLiveMode) {
        setLastAction('encode');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!output) return;
    
    try {
      let dataUrl = output;
      
      if (!dataUrl.startsWith('data:')) {
        dataUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(output)}`;
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'downloaded_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to download file.");
    }
  };

  return (
    <>
      <SEO 
        title={t('base64.seoTitle')}
        description={t('base64.desc')}
        url={`/${currentLang}/base64-converter`}
      />

      <div className="max-w-7xl mx-auto h-full flex flex-col px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Binary className="mr-3 h-7 w-7 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            {t('base64.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">{t('base64.desc')}</p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 bg-white dark:bg-gray-800 py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm w-full md:w-auto justify-center md:justify-start">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isLiveMode}
                  onChange={() => setIsLiveMode(!isLiveMode)}
                />
                <div className={`block w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${isLiveMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white dark:bg-gray-800 w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-transform ${isLiveMode ? 'transform translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-2.5 sm:ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors">
                {t('base64.liveMode')}
              </span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isUrlSafe}
                  onChange={() => {
                    setIsUrlSafe(!isUrlSafe);
                    if (isLiveMode && input) {
                      lastAction === 'encode' ? handleEncode(input) : handleDecode(input);
                    }
                  }}
                />
                <div className={`block w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${isUrlSafe ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white dark:bg-gray-800 w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-transform ${isUrlSafe ? 'transform translate-x-5' : ''}`}></div>
              </div>
              <span className="ml-2.5 sm:ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors">
                {t('base64.urlSafe')}
              </span>
            </label>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900" 
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-1 min-h-[400px]">
          {/* Input Area */}
          <div className="flex flex-col h-full flex-1 min-w-0">
            <div className="flex justify-between items-center mb-2 px-1 min-h-[36px]">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('base64.inputLabel')}</label>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 flex items-center px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                  title="Upload File"
                >
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> {t('base64.uploadFile')}
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                <button
                  onClick={clearAll}
                  className="text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-300 flex items-center px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> {t('json.clear')}
                </button>
              </div>
            </div>
            <div className="flex flex-col flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm resize-none shadow-sm min-h-[200px] lg:min-h-0 dark:bg-gray-800 text-gray-800 dark:text-gray-200 leading-relaxed bg-slate-50 dark:bg-black/20"
                placeholder="Type or paste text/Base64 here..."
                spellCheck="false"
              />
            </div>
            
            {!isLiveMode && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => handleEncode(input)}
                  className="flex flex-1 items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2 sm:py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  <ArrowRight className="w-4 h-4 mr-1.5 hidden sm:block" />
                  {t('base64.encodeBtn')}
                </button>
                <button
                  onClick={() => handleDecode(input)}
                  className="flex flex-1 items-center justify-center bg-white dark:bg-gray-800 border border-emerald-600 dark:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium text-sm py-2 sm:py-2.5 px-4 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  {t('base64.decodeBtn')}
                  <ArrowLeft className="w-4 h-4 ml-1.5 hidden sm:block" />
                </button>
              </div>
            )}
          </div>

          {/* Output Area */}
          <div className="flex flex-col h-full flex-1 min-w-0">
            <div className="flex justify-between items-center mb-2 px-1 min-h-[36px]">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('base64.outputLabel')}</label>
              <div className="flex space-x-1.5">
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 flex items-center px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download File"
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> {t('base64.downloadFile')}
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1 mt-1.5"></div>
                <button
                  onClick={swapInputOutput}
                  disabled={!output}
                  className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 flex items-center px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Swap Input and Output"
                >
                  <ArrowDownUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" /> {t('base64.swap')}
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 flex items-center justify-center">
                    {copied ? <Check className="h-full w-full text-green-600 dark:text-green-400" /> : <Copy className="h-full w-full" />}
                  </div>
                  {copied ? t('json.copied') : t('json.copy')}
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <textarea
                value={output}
                readOnly
                className={`w-full h-full min-h-[200px] lg:min-h-0 p-4 border rounded-xl font-mono text-sm resize-none focus:outline-none shadow-sm leading-relaxed ${
                  error ? 'border-red-300 bg-red-50 dark:bg-red-900/10 text-red-900 dark:text-red-300' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200'
                }`}
                placeholder=""
              />
              {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 dark:bg-red-900/40 border-t border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3.5 text-sm rounded-b-xl font-mono overflow-x-auto">
                  <strong>{t('json.error')}</strong> {error}
                </div>
              )}
            </div>
            
            {/* Empty space block to match the height of the action buttons if they exist on the left side */}
            {!isLiveMode && (
              <div className="hidden lg:block h-[36px] sm:h-[40px] mt-4 opacity-0 pointer-events-none"></div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 lg:mt-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800/50 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2 text-emerald-500" />
            {t('base64.help.title')}
          </h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`base64.help.${num}`)}</li>
            ))}
          </ul>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-8 lg:mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('base64.longDesc.title')}</h2>
          <div className="prose prose-emerald dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 sm:space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('base64.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('base64.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('base64.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('base64.longDesc.p4')}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('base64.longDesc.p5')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

