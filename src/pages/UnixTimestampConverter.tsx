import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Copy, Check, ArrowDown, ArrowUp, List, FileText } from 'lucide-react';
import { SEO } from '../components/SEO';

type Mode = 'single' | 'batch';

export function UnixTimestampConverter() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('single');
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [currentIso, setCurrentIso] = useState(new Date().toISOString());
  
  const [inputTimestamp, setInputTimestamp] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [batchResults, setBatchResults] = useState<string>('');
  
  const [convertedDate, setConvertedDate] = useState<{ local: string; utc: string; iso: string; relative: string } | null>(null);
  const [convertedTimestamp, setConvertedTimestamp] = useState<{ s: number; ms: number } | null>(null);
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTimestamp(Math.floor(now.getTime() / 1000));
      setCurrentIso(now.toISOString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize inputDate with current date
  useEffect(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
    setInputDate(localISOTime);
  }, []);

  const handleTimestampToDate = () => {
    if (!inputTimestamp) return;
    
    let date: Date;
    
    // Check if it's an ISO string
    if (isNaN(Number(inputTimestamp)) && inputTimestamp.includes('T')) {
      date = new Date(inputTimestamp);
    } else {
      let ts = parseInt(inputTimestamp, 10);
      if (isNaN(ts)) return;

      if (inputTimestamp.length > 11) {
        // It's likely in milliseconds
      } else {
        ts = ts * 1000;
      }
      date = new Date(ts);
    }

    if (date.toString() === 'Invalid Date') return;

    setConvertedDate({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
      relative: getRelativeTime(date)
    });
  };

  const handleDateToTimestamp = () => {
    if (!inputDate) return;
    const date = new Date(inputDate);
    if (date.toString() === 'Invalid Date') return;
    
    setConvertedTimestamp({
      s: Math.floor(date.getTime() / 1000),
      ms: date.getTime()
    });
  };

  const handleBatchConvert = () => {
    if (!batchInput.trim()) return;
    
    const lines = batchInput.split('\n');
    const results = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      
      let date: Date;
      if (isNaN(Number(trimmed)) && trimmed.includes('T')) {
        date = new Date(trimmed);
      } else {
        let ts = parseInt(trimmed, 10);
        if (isNaN(ts)) {
          date = new Date(trimmed); // Try standard date parsing
        } else {
          if (trimmed.length > 11) {
            date = new Date(ts);
          } else {
            date = new Date(ts * 1000);
          }
        }
      }

      if (date.toString() === 'Invalid Date') {
        return `${trimmed} -> Invalid Date`;
      }

      return `${trimmed} -> ${date.toISOString()} | ${Math.floor(date.getTime() / 1000)}`;
    });

    setBatchResults(results.join('\n'));
  };

  const getRelativeTime = (date: Date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (Math.abs(daysDifference) < 1) {
      const hoursDifference = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
      if (Math.abs(hoursDifference) < 1) {
        const minutesDifference = Math.round((date.getTime() - Date.now()) / (1000 * 60));
        return rtf.format(minutesDifference, 'minute');
      }
      return rtf.format(hoursDifference, 'hour');
    }
    return rtf.format(daysDifference, 'day');
  };

  const copyToClipboard = async (text: string, key: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
      <SEO 
        title={t('unix.seoTitle')}
        description={t('unix.desc')}
        url="/unix-timestamp"
      />

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-100 rounded-2xl mb-4">
            <Clock className="h-8 w-8 text-cyan-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('unix.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('unix.desc')}
          </p>
        </div>

        {/* Current Timestamp Quick Actions */}
        <div className="bg-cyan-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-cyan-100 mb-1 text-sm font-medium">{t('unix.quickCurrent') || 'Quick Copy Current:'}</p>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-mono font-bold tracking-wider">{currentTimestamp}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => copyToClipboard(currentTimestamp.toString(), 'current_s')}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                {copiedKey === 'current_s' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {t('unix.copySeconds') || 'Seconds'}
              </button>
              <button
                onClick={() => copyToClipboard((currentTimestamp * 1000).toString(), 'current_ms')}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                {copiedKey === 'current_ms' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {t('unix.copyMs') || 'Milliseconds'}
              </button>
              <button
                onClick={() => copyToClipboard(currentIso, 'current_iso')}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                {copiedKey === 'current_iso' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {t('unix.copyIso') || 'ISO 8601'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                mode === 'single' 
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('unix.singleMode') || 'Single Mode'}
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                mode === 'batch' 
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              {t('unix.batchMode') || 'Batch Mode'}
            </button>
          </div>

          <div className="p-6">
            {mode === 'single' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timestamp to Date */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('unix.timestampLabel')} / {t('unix.isoLabel') || 'ISO 8601'}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputTimestamp}
                        onChange={(e) => setInputTimestamp(e.target.value)}
                        placeholder="e.g. 1713000000 or 2024-04-13T00:00:00Z"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm"
                      />
                      <button
                        onClick={handleTimestampToDate}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
                      >
                        <ArrowDown className="h-4 w-4 mr-1" />
                        {t('unix.toDateBtn')}
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 bg-white space-y-4">
                    {convertedDate ? (
                      <>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">{t('unix.localTime')}</span>
                            <button onClick={() => copyToClipboard(convertedDate.local, 'local')} className="text-cyan-600 hover:text-cyan-800">
                              {copiedKey === 'local' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-800">
                            {convertedDate.local}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">{t('unix.utcTime')}</span>
                            <button onClick={() => copyToClipboard(convertedDate.utc, 'utc')} className="text-cyan-600 hover:text-cyan-800">
                              {copiedKey === 'utc' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-800">
                            {convertedDate.utc}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">{t('unix.isoLabel') || 'ISO 8601'}</span>
                            <button onClick={() => copyToClipboard(convertedDate.iso, 'iso')} className="text-cyan-600 hover:text-cyan-800">
                              {copiedKey === 'iso' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 font-mono">
                            {convertedDate.iso}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">{t('unix.relative')}</span>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm font-medium text-gray-800">
                            {convertedDate.relative}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 italic text-sm">
                        Enter a timestamp to see the date
                      </div>
                    )}
                  </div>
                </div>

                {/* Date to Timestamp */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col">
                  <div className="p-5 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('unix.dateLabel')}
                    </label>
                    <div className="flex flex-col space-y-3">
                      <input
                        type="datetime-local"
                        step="1"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <button
                        onClick={handleDateToTimestamp}
                        className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center"
                      >
                        <ArrowUp className="h-4 w-4 mr-1" />
                        {t('unix.toTimestampBtn')}
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 bg-white flex flex-col justify-center space-y-6">
                    {convertedTimestamp ? (
                      <>
                        <div className="text-center">
                          <span className="text-xs font-bold text-gray-500 uppercase block mb-2">{t('unix.copySeconds') || 'Seconds'}</span>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-3xl font-mono font-bold text-gray-900">{convertedTimestamp.s}</span>
                            <button
                              onClick={() => copyToClipboard(convertedTimestamp.s.toString(), 'convertedTsS')}
                              className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                              title="Copy"
                            >
                              {copiedKey === 'convertedTsS' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-gray-500 uppercase block mb-2">{t('unix.copyMs') || 'Milliseconds'}</span>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-2xl font-mono font-bold text-gray-700">{convertedTimestamp.ms}</span>
                            <button
                              onClick={() => copyToClipboard(convertedTimestamp.ms.toString(), 'convertedTsMs')}
                              className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                              title="Copy"
                            >
                              {copiedKey === 'convertedTsMs' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-gray-400 italic text-sm">
                        Select a date to see the timestamp
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('unix.batchInputPlaceholder') || 'Enter multiple timestamps or dates (one per line)...'}
                  </label>
                  <textarea
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm resize-y"
                    placeholder="1713000000&#10;2024-04-13T00:00:00Z&#10;1713000000000"
                  />
                </div>
                <button
                  onClick={handleBatchConvert}
                  className="w-full px-4 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium"
                >
                  {t('unix.batchConvertBtn') || 'Convert All'}
                </button>
                
                {batchResults && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('unix.batchOutputLabel') || 'Batch Results'}
                      </label>
                      <button
                        onClick={() => copyToClipboard(batchResults, 'batchResults')}
                        className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center"
                      >
                        {copiedKey === 'batchResults' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {t('unix.copy')}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={batchResults}
                      className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm resize-y text-gray-800"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('unix.longDesc.title')}</h2>
          <div className="prose prose-cyan max-w-none text-gray-600">
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p1') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p2') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p3') }}></p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">{t('unix.help.title')}</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('unix.help.1')}</li>
              <li>{t('unix.help.2')}</li>
              <li>{t('unix.help.3')}</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
