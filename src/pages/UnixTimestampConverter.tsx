import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Copy, Check, ArrowDown, ArrowUp, List, FileText, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useParams } from 'react-router-dom';

type Mode = 'single' | 'batch';

export function UnixTimestampConverter() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';
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
        url={`/${currentLang}/unix-timestamp`}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl mb-4">
            <Clock className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('unix.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('unix.desc')}
          </p>
        </div>

        {/* Current Timestamp Quick Actions */}
        <div className="bg-emerald-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="text-center md:text-left shrink-0">
              <p className="text-emerald-100 mb-1 text-sm font-medium">{t('unix.quickCurrent') || 'Quick Copy Current:'}</p>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-mono font-bold tracking-wider">{currentTimestamp}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <button
                onClick={() => copyToClipboard(currentTimestamp.toString(), 'current_s')}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 rounded-md transition-colors text-sm font-medium flex items-center"
              >
                {copiedKey === 'current_s' ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {t('unix.copySeconds') || 'Seconds'}
              </button>
              <button
                onClick={() => copyToClipboard((currentTimestamp * 1000).toString(), 'current_ms')}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 rounded-md transition-colors text-sm font-medium flex items-center"
              >
                {copiedKey === 'current_ms' ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {t('unix.copyMs') || 'Milliseconds'}
              </button>
              <button
                onClick={() => copyToClipboard(currentIso, 'current_iso')}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 rounded-md transition-colors text-sm font-medium flex items-center"
              >
                {copiedKey === 'current_iso' ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
                {t('unix.copyIso') || 'ISO 8601'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                mode === 'single' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('unix.singleMode') || 'Single Mode'}
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                mode === 'batch' 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900'
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
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 min-h-[174px] flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 truncate">
                       {t('unix.timestampLabel')} / {t('unix.isoLabel') || 'ISO 8601'}
                    </label>
                    <div className="flex flex-col space-y-3">
                      <input
                        type="text"
                        value={inputTimestamp}
                        onChange={(e) => setInputTimestamp(e.target.value)}
                        placeholder="e.g. 1713000000 or 2024-04-13T00:00:00Z"
                        className="w-full h-11 px-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-1 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 font-mono bg-slate-50 dark:bg-black/20"
                      />
                      <button
                        onClick={handleTimestampToDate}
                        className="w-full h-11 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 hover:shadow-md transition-all duration-200 flex items-center justify-center font-medium shadow-sm text-sm sm:text-base"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        {t('unix.toDateBtn')}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 bg-white dark:bg-gray-800 space-y-4">
                    {convertedDate ? (
                      <>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('unix.localTime')}</span>
                            <button onClick={() => copyToClipboard(convertedDate.local, 'local')} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                              {copiedKey === 'local' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {convertedDate.local}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('unix.utcTime')}</span>
                            <button onClick={() => copyToClipboard(convertedDate.utc, 'utc')} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                              {copiedKey === 'utc' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {convertedDate.utc}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('unix.isoLabel') || 'ISO 8601'}</span>
                            <button onClick={() => copyToClipboard(convertedDate.iso, 'iso')} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                              {copiedKey === 'iso' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200 font-mono">
                            {convertedDate.iso}
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('unix.relative')}</span>
                          </div>
                          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-200">
                            {convertedDate.relative}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 italic text-sm">
                        Enter a timestamp to see the date
                      </div>
                    )}
                  </div>
                </div>

                {/* Date to Timestamp */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 min-h-[174px] flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 truncate">
                      {t('unix.dateLabel')}
                    </label>
                    <div className="flex flex-col space-y-3">
                      <input
                        type="datetime-local"
                        step="1"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full h-11 px-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-1 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 dark:bg-black/20"
                      />
                      <button
                        onClick={handleDateToTimestamp}
                        className="w-full h-11 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 hover:shadow-md transition-all duration-200 flex items-center justify-center font-medium shadow-sm text-sm sm:text-base"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        {t('unix.toTimestampBtn')}
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex-1 bg-white dark:bg-gray-800 flex flex-col justify-center space-y-6">
                    {convertedTimestamp ? (
                      <>
                        <div className="text-center">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-2">{t('unix.copySeconds') || 'Seconds'}</span>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">{convertedTimestamp.s}</span>
                            <button
                              onClick={() => copyToClipboard(convertedTimestamp.s.toString(), 'convertedTsS')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="Copy"
                            >
                              {copiedKey === 'convertedTsS' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-2">{t('unix.copyMs') || 'Milliseconds'}</span>
                          <div className="flex items-center justify-center space-x-3">
                            <span className="text-2xl font-mono font-bold text-gray-700 dark:text-gray-300">{convertedTimestamp.ms}</span>
                            <button
                              onClick={() => copyToClipboard(convertedTimestamp.ms.toString(), 'convertedTsMs')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                              title="Copy"
                            >
                              {copiedKey === 'convertedTsMs' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 italic text-sm">
                        Select a date to see the timestamp
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('unix.batchInputPlaceholder') || 'Enter multiple timestamps or dates (one per line)...'}
                  </label>
                  <textarea
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-1 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm resize-y bg-slate-50 dark:bg-black/20"
                    placeholder="1713000000&#10;2024-04-13T00:00:00Z&#10;1713000000000"
                  />
                </div>
                <button
                  onClick={handleBatchConvert}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 hover:shadow-md transition-all duration-200 font-medium shadow-sm text-sm sm:text-base"
                >
                  {t('unix.batchConvertBtn') || 'Convert All'}
                </button>
                
                {batchResults && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('unix.batchOutputLabel') || 'Batch Results'}
                      </label>
                      <button
                        onClick={() => copyToClipboard(batchResults, 'batchResults')}
                        className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center transition-colors"
                      >
                        {copiedKey === 'batchResults' ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {t('unix.copy')}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={batchResults}
                      className="w-full h-40 px-4 py-3 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl font-mono text-sm resize-y text-gray-800 dark:text-gray-200 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('unix.longDesc.title')}</h2>
          <div className="prose prose-emerald dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p1') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p2') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p3') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p4') }} className="mt-4"></p>
            <p dangerouslySetInnerHTML={{ __html: t('unix.longDesc.p5') }} className="mt-4"></p>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">{t('unix.help.title')}</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('unix.help.1')}</li>
              <li>{t('unix.help.2')}</li>
              <li>{t('unix.help.3')}</li>
            </ol>
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
                Unix Timestamp Converter 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Unix Timestamp Converter 도구는 convert unix timestamps 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Unix Timestamp Converter 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Unix Timestamp Converter의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Unix Timestamp Converter 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Unix Timestamp Converter ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Unix Timestamp Converter ツールは、convert unix timestamps するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Unix Timestamp Converter を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Unix Timestamp Converter のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Unix Timestamp Converter ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Unix Timestamp Converter tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Unix Timestamp Converter is a specialized utility designed to convert unix timestamps. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Unix Timestamp Converter?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Unix Timestamp Converter happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Unix Timestamp Converter is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 convert unix timestamps 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に convert unix timestamps したい場合に非常に便利です。
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
                When you are working on a project and need to quickly convert unix timestamps without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to convert unix timestamps.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how convert processes work visually.
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