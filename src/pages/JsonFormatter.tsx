import React, { useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, FileJson, Info, ListTree, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JsonViewer } from '../components/JsonViewer';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text');
  const { t } = useTranslation();

  const parsedJson = useMemo(() => {
    if (!output) return null;
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  }, [output]);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
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

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <>
      <SEO 
        title={`${t('json.title')} - DevToolz`}
        description={t('json.desc')}
        url="/json-formatter"
        schema={[
          {
            "@type": "SoftwareApplication",
            "name": t('json.title'),
            "description": t('json.desc'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "HowTo",
            "name": t('json.help.title'),
            "step": [
              { "@type": "HowToStep", "text": t('json.help.1') },
              { "@type": "HowToStep", "text": t('json.help.2') },
              { "@type": "HowToStep", "text": t('json.help.3') }
            ]
          }
        ]}
      />

      <div className="max-w-5xl mx-auto h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileJson className="mr-3 h-8 w-8 text-blue-600" />
            {t('json.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('json.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('json.inputLabel')}</label>
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
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-none"
              placeholder='{"example": "Paste your JSON here"}'
              spellCheck="false"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={formatJson}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('json.formatBtn')}
              </button>
              <button
                onClick={minifyJson}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-300"
              >
                {t('json.minifyBtn')}
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 flex items-center">
                {t('json.outputLabel')}
                {output && !error && (
                  <div className="ml-4 flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('text')}
                      className={`px-3 py-1 text-xs font-medium rounded-md flex items-center transition-colors ${
                        viewMode === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Code className="w-3 h-3 mr-1" /> Code
                    </button>
                    <button
                      onClick={() => setViewMode('tree')}
                      className={`px-3 py-1 text-xs font-medium rounded-md flex items-center transition-colors ${
                        viewMode === 'tree' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ListTree className="w-3 h-3 mr-1" /> Tree
                    </button>
                  </div>
                )}
              </label>
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? t('json.copied') : t('json.copy')}
              </button>
            </div>
            <div className="relative flex-1 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
              {viewMode === 'text' || error || !parsedJson ? (
                <textarea
                  value={output}
                  readOnly
                  className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none ${
                    error ? 'bg-red-50 text-red-900 border-red-300' : 'bg-transparent text-gray-800'
                  }`}
                  placeholder=""
                />
              ) : (
                <div className="w-full h-full p-4 overflow-auto bg-white">
                  <JsonViewer data={parsedJson} />
                </div>
              )}
              {error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 text-red-700 p-3 text-sm font-mono overflow-x-auto">
                  <strong>{t('json.error')}</strong> {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('json.help.title')}
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm list-disc list-inside">
            <li>{t('json.help.1')}</li>
            <li>{t('json.help.2')}</li>
            <li>{t('json.help.3')}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
