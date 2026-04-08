import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, Link as LinkIcon, Info, ArrowDownUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function UrlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleEncode = () => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      setOutput(encodeURIComponent(input));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDecode = () => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      setOutput(decodeURIComponent(input));
      setError(null);
    } catch (err) {
      setError("Invalid URL-encoded string");
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
        title={`${t('url.title')} - DevToolz`}
        description={t('url.desc')}
        url="/url-encoder"
        schema={[
          {
            "@type": "SoftwareApplication",
            "name": t('url.title'),
            "description": t('url.desc'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "HowTo",
            "name": t('url.help.title'),
            "step": [
              { "@type": "HowToStep", "text": t('url.help.1') },
              { "@type": "HowToStep", "text": t('url.help.2') },
              { "@type": "HowToStep", "text": t('url.help.3') }
            ]
          }
        ]}
      />

      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <LinkIcon className="mr-3 h-8 w-8 text-indigo-600" />
            {t('url.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('url.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('url.inputLabel')}</label>
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
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none"
              placeholder="Type or paste URL/text here..."
              spellCheck="false"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleEncode}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('url.encodeBtn')}
              </button>
              <button
                onClick={handleDecode}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('url.decodeBtn')}
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('url.outputLabel')}</label>
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
        <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('url.help.title')}
          </h3>
          <ul className="space-y-2 text-indigo-800 text-sm list-disc list-inside">
            <li>{t('url.help.1')}</li>
            <li>{t('url.help.2')}</li>
            <li>{t('url.help.3')}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
