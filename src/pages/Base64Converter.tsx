import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, Binary, Info, ArrowDownUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleEncode = () => {
    if (!input && !output) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const textToEncode = input || output;
      // Use encodeURIComponent to handle Unicode characters properly
      const encoded = btoa(encodeURIComponent(textToEncode).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
          return String.fromCharCode(Number('0x' + p1));
        }));
      if (!input && output) {
        setInput(output);
      }
      setOutput(encoded);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDecode = () => {
    if (!input && !output) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (!input) throw new Error("Empty input");
      // Decode properly handling Unicode
      const decoded = decodeURIComponent(atob(input).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      setOutput(decoded);
      setError(null);
    } catch (err) {
      // Auto-swap logic: if input is invalid but output is valid Base64
      if (output) {
        try {
          const decodedOutput = decodeURIComponent(atob(output).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          setInput(output);
          setOutput(decodedOutput);
          setError(null);
          return;
        } catch (e) {
          // Fall through to error
        }
      }
      setError("Invalid Base64 string");
    }
  };

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
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <>
      <SEO 
        title={`${t('base64.title')} - DevToolz`}
        description={t('base64.desc')}
        url="/base64-converter"
        schema={[
          {
            "@type": "SoftwareApplication",
            "name": t('base64.title'),
            "description": t('base64.desc'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "HowTo",
            "name": t('base64.help.title'),
            "step": [
              { "@type": "HowToStep", "text": t('base64.help.1') },
              { "@type": "HowToStep", "text": t('base64.help.2') },
              { "@type": "HowToStep", "text": t('base64.help.3') }
            ]
          }
        ]}
      />

      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Binary className="mr-3 h-8 w-8 text-orange-600" />
            {t('base64.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('base64.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
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
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm resize-none"
              placeholder="Type or paste text/Base64 here..."
              spellCheck="false"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleEncode}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('base64.encodeBtn')}
              </button>
              <button
                onClick={handleDecode}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('base64.decodeBtn')}
              </button>
            </div>
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
                className={`w-full h-full p-4 border rounded-lg font-mono text-sm resize-none focus:outline-none ${
                  error ? 'border-red-300 bg-red-50 text-red-900' : 'border-gray-300 bg-gray-50 text-gray-800'
                }`}
                placeholder=""
              />
              {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 text-red-700 p-3 text-sm rounded-b-lg font-mono overflow-x-auto">
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
            <li>{t('base64.help.1')}</li>
            <li>{t('base64.help.2')}</li>
            <li>{t('base64.help.3')}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
