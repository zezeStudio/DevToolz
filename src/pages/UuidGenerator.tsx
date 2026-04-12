import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fingerprint, Copy, Check, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useParams } from 'react-router-dom';
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, v7 as uuidv7, validate as uuidValidate, version as uuidVersion } from 'uuid';

export function UuidGenerator() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<'v1' | 'v3' | 'v4' | 'v5' | 'v7'>('v4');
  const [namespace, setNamespace] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8'); // Default DNS namespace
  const [name, setName] = useState('');
  const [hyphens, setHyphens] = useState(true);
  const [uppercase, setUppercase] = useState(false);
  const [quotes, setQuotes] = useState<'none' | 'single' | 'double'>('none');
  const [separator, setSeparator] = useState<'newline' | 'comma' | 'space'>('newline');
  
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Decoding state
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeResult, setDecodeResult] = useState<{ valid: boolean; version?: number; error?: string } | null>(null);

  const generateUuids = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      let uuid = '';
      try {
        if (version === 'v1') uuid = uuidv1();
        else if (version === 'v3') uuid = uuidv3(name || 'example', namespace);
        else if (version === 'v4') uuid = uuidv4();
        else if (version === 'v5') uuid = uuidv5(name || 'example', namespace);
        else if (version === 'v7') uuid = uuidv7();
      } catch (e) {
        console.error(e);
        uuid = 'Error: Invalid namespace UUID';
      }
      
      if (!uuid.startsWith('Error')) {
        if (!hyphens) {
          uuid = uuid.replace(/-/g, '');
        }
        if (uppercase) {
          uuid = uuid.toUpperCase();
        }
        if (quotes === 'single') {
          uuid = `'${uuid}'`;
        } else if (quotes === 'double') {
          uuid = `"${uuid}"`;
        }
      }
      
      newUuids.push(uuid);
    }
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const decodeUuid = (input: string) => {
    const cleanInput = input.trim();
    if (!cleanInput) {
      setDecodeResult(null);
      return;
    }
    
    if (uuidValidate(cleanInput)) {
      setDecodeResult({ valid: true, version: uuidVersion(cleanInput) });
    } else {
      setDecodeResult({ valid: false, error: 'Invalid UUID format' });
    }
  };

  const getJoinedUuids = () => {
    if (separator === 'comma') return uuids.join(',');
    if (separator === 'space') return uuids.join(' ');
    return uuids.join('\n');
  };

  const copyToClipboard = async (text: string, index: number | null = null) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index === null) {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      } else {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <SEO 
        title={t('uuid.seoTitle')}
        description={t('uuid.desc')}
        url={`/${currentLang}/uuid-generator`}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl mb-4">
            <Fingerprint className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('uuid.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('uuid.desc')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('uuid.countLabel') || 'Count'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('uuid.version') || 'Version'}
                </label>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value as 'v1' | 'v3' | 'v4' | 'v5' | 'v7')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
                >
                  <option value="v1">{t('uuid.v1') || 'v1 (Time-based)'}</option>
                  <option value="v3">{t('uuid.v3') || 'v3 (MD5 Namespace)'}</option>
                  <option value="v4">{t('uuid.v4') || 'v4 (Random)'}</option>
                  <option value="v5">{t('uuid.v5') || 'v5 (SHA-1 Namespace)'}</option>
                  <option value="v7">{t('uuid.v7') || 'v7 (Time-ordered)'}</option>
                </select>
              </div>

              {(version === 'v3' || version === 'v5') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Namespace (UUID)
                    </label>
                    <input
                      type="text"
                      value={namespace}
                      onChange={(e) => setNamespace(e.target.value)}
                      placeholder="e.g., 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., example.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('uuid.separator') || 'Separator'}
                </label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value as 'newline' | 'comma' | 'space')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
                >
                  <option value="newline">{t('uuid.newline') || 'New Line'}</option>
                  <option value="comma">{t('uuid.comma') || 'Comma (,)'}</option>
                  <option value="space">{t('uuid.space') || 'Space'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('uuid.quotes') || 'Quotes'}
                </label>
                <select
                  value={quotes}
                  onChange={(e) => setQuotes(e.target.value as 'none' | 'single' | 'double')}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
                >
                  <option value="none">{t('uuid.none') || 'None'}</option>
                  <option value="single">{t('uuid.single') || "Single ('')"}</option>
                  <option value="double">{t('uuid.double') || 'Double ("")'}</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 mt-6 lg:mt-8">
                <input
                  type="checkbox"
                  id="hyphens"
                  checked={hyphens}
                  onChange={(e) => setHyphens(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="hyphens" className="text-sm text-gray-700 dark:text-gray-300">
                  {t('uuid.hyphens') || 'Include Hyphens'}
                </label>
              </div>
              
              <div className="flex items-center space-x-3 mt-6 lg:mt-8">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="uppercase" className="text-sm text-gray-700 dark:text-gray-300">
                  {t('uuid.uppercase') || 'Uppercase'}
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={generateUuids}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                {t('uuid.generateBtn')}
              </button>
            </div>
          </div>

          {uuids.length > 0 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Results ({uuids.length})</h3>
                <button
                  onClick={() => copyToClipboard(getJoinedUuids())}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {copiedAll ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copiedAll ? t('uuid.copied') : t('uuid.copyAll')}
                </button>
              </div>
              
              {separator === 'newline' ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-96 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {uuids.map((uuid, index) => (
                      <li key={index} className="px-4 py-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors">
                        <span className="font-mono text-sm text-gray-800 dark:text-gray-200">{uuid}</span>
                        <button
                          onClick={() => copyToClipboard(uuid, index)}
                          className="text-gray-400 hover:text-indigo-600 focus:outline-none ml-4"
                          title="Copy"
                        >
                          {copiedIndex === index ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto font-mono text-sm text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap">
                  {getJoinedUuids()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decode Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('uuid.decodeTitle') || 'Decode UUID'}</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('uuid.decodeInput') || 'Enter UUID to decode'}
              </label>
              <input
                type="text"
                value={decodeInput}
                onChange={(e) => {
                  setDecodeInput(e.target.value);
                  decodeUuid(e.target.value);
                }}
                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              />
            </div>
            
            {decodeResult && (
              <div className={`mt-4 p-4 rounded-lg ${decodeResult.valid ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
                {decodeResult.valid ? (
                  <div>
                    <div className="flex items-center text-green-800 dark:text-green-300 font-medium mb-2">
                      <Check className="h-5 w-5 mr-2" />
                      {t('uuid.decodeResult') || 'Valid UUID'}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-400">
                      <strong>{t('uuid.version') || 'Version'}:</strong> {decodeResult.version}
                    </div>
                  </div>
                ) : (
                  <div className="text-red-700 dark:text-red-400 text-sm">
                    {decodeResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('uuid.longDesc.title')}</h2>
          <div className="prose prose-blue dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
            <p dangerouslySetInnerHTML={{ __html: t('uuid.longDesc.p1') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('uuid.longDesc.p2') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('uuid.longDesc.p3') }}></p>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">{t('uuid.help.title')}</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('uuid.help.1')}</li>
              <li>{t('uuid.help.2')}</li>
              <li>{t('uuid.help.3')}</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
