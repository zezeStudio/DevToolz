import React, { useState, useEffect, useRef } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, Binary, Info, ArrowDownUp, Upload, Download, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

  const handleEncode = (textToEncode: string = input) => {
    if (!textToEncode) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      // Use encodeURIComponent to handle Unicode characters properly
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
      
      // Handle URL-safe conversion back to standard base64
      base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64Str.length % 4) {
        base64Str += '=';
      }

      // Check if it's a Data URI
      if (base64Str.startsWith('data:')) {
        const parts = base64Str.split(',');
        if (parts.length === 2) {
          base64Str = parts[1];
        }
      }

      // Decode properly handling Unicode
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

  // Live Mode Effect
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
    // Automatically switch action type when swapping
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
        // If it's a file, we usually want to encode it to base64
        setLastAction('encode');
      }
    };
    // Read as Data URL to get the base64 representation directly
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!output) return;
    
    try {
      let dataUrl = output;
      
      // If the output is already a data URI, use it directly
      if (!dataUrl.startsWith('data:')) {
        // Otherwise, assume it's plain text and create a data URI
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
        url="/base64-converter"
      />

      <div className="max-w-6xl mx-auto h-full flex flex-col px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Binary className="mr-3 h-8 w-8 text-orange-600" />
            {t('base64.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('base64.desc')}</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isLiveMode}
                  onChange={() => setIsLiveMode(!isLiveMode)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isLiveMode ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isLiveMode ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
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
                <div className={`block w-10 h-6 rounded-full transition-colors ${isUrlSafe ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isUrlSafe ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                {t('base64.urlSafe')}
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('base64.uploadFile')}
            </button>
            <button
              onClick={handleDownload}
              disabled={!output}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('base64.downloadFile')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('base64.inputLabel')}</label>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" /> {t('json.clear')}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm resize-none shadow-sm"
              placeholder="Type or paste text/Base64 here..."
              spellCheck="false"
            />
            {!isLiveMode && (
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEncode(input)}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  {t('base64.encodeBtn')}
                </button>
                <button
                  onClick={() => handleDecode(input)}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-sm"
                >
                  {t('base64.decodeBtn')}
                </button>
              </div>
            )}
          </div>

          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('base64.outputLabel')}</label>
              <div className="flex space-x-2">
                <button
                  onClick={swapInputOutput}
                  disabled={!output}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center px-2 py-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Swap Input and Output"
                >
                  <ArrowDownUp className="h-4 w-4 mr-1" /> Swap
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  error ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-300 bg-gray-50 text-gray-800'
                }`}
                placeholder=""
              />
              {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 text-red-700 p-3 text-sm rounded-b-xl font-mono overflow-x-auto">
                  <strong>{t('json.error')}</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-orange-50 rounded-xl p-6 border border-orange-100">
          <h3 className="text-lg font-bold text-orange-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('base64.help.title')}
          </h3>
          <ul className="space-y-2 text-orange-800 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`base64.help.${num}`)}</li>
            ))}
          </ul>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('base64.longDesc.title')}</h2>
          <div className="prose prose-orange max-w-none text-gray-700 space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('base64.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('base64.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('base64.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900">{part}</strong> : part
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
