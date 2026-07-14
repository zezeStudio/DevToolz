import React, { useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Type, Trash2, Info, Copy, Check, Search, Replace, AlignLeft, AlignJustify, ArrowDownAZ, ArrowLeftRight, Eraser, Link, Mail, FileText, Database, Undo2, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const countSyllables = (word: string) => {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const match = word.match(/[aeiouy]{1,2}/g);
  return match ? match.length : 1;
};

export function TextAnalyzer() {
  const [text, setText] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const stats = useMemo(() => {
    if (!text.trim()) {
      return { 
        words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0, sentences: 0, lines: 0,
        readingTimeMin: 0, topKeywords: [], byteSize: 0, longestWord: '-', letters: 0, numbers: 0,
        readabilityScore: 0, emails: [], urls: []
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    const lines = text.split('\n').length;
    
    const byteSize = new Blob([text]).size;
    const letters = (text.match(/[a-zA-Z가-힣ぁ-んァ-ン一-龯]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;

    // Use Intl.Segmenter for accurate word counting across languages (including CJK)
    const wordSegmenter = new Intl.Segmenter(i18n.language, { granularity: 'word' });
    const wordSegments = Array.from(wordSegmenter.segment(text));
    const words = wordSegments.filter(s => s.isWordLike).map(s => s.segment);
    
    let longestWord = '-';
    if (words.length > 0) {
      longestWord = words.reduce((a, b) => a.length > b.length ? a : b, '');
    }
    
    // Use Intl.Segmenter for accurate sentence counting
    const sentenceSegmenter = new Intl.Segmenter(i18n.language, { granularity: 'sentence' });
    const sentences = Array.from(sentenceSegmenter.segment(text)).filter(s => s.segment.trim().length > 0).length;

    // Keyword density & Syllables
    const wordCounts: Record<string, number> = {};
    let totalSyllables = 0;
    words.forEach(w => {
      const lower = w.toLowerCase();
      wordCounts[lower] = (wordCounts[lower] || 0) + 1;
      totalSyllables += countSyllables(lower);
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        count,
        percentage: ((count / words.length) * 100).toFixed(1)
      }));

    // Reading time (avg 200 words per minute)
    const readingTimeMin = Math.ceil(words.length / 200);

    // Flesch Reading Ease (approximate for English, but gives a metric)
    let readabilityScore = 0;
    if (words.length > 0 && sentences > 0) {
      readabilityScore = 206.835 - 1.015 * (words.length / sentences) - 84.6 * (totalSyllables / words.length);
      readabilityScore = Math.max(0, Math.min(100, Math.round(readabilityScore)));
    }

    // Data Extraction
    const emails = Array.from(new Set(text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []));
    const urls = Array.from(new Set(text.match(/https?:\/\/[^\s]+/g) || []));

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      lines,
      readingTimeMin,
      topKeywords,
      byteSize,
      longestWord,
      letters,
      numbers,
      readabilityScore,
      emails,
      urls
    };
  }, [text, i18n.language]);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const applyTool = (transform: (val: string) => string) => {
    const newText = transform(text);
    if (newText !== text) {
      setHistory(prev => [...prev, text]);
      setText(newText);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setText(prev);
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedFind, 'g');
    applyTool(t => t.replace(regex, replaceText));
  };

  const toUpperCase = () => applyTool(t => t.toUpperCase());
  const toLowerCase = () => applyTool(t => t.toLowerCase());
  const toTitleCase = () => applyTool(t => t.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
  const removeExtraSpaces = () => applyTool(t => t.replace(/[ \t]{2,}/g, ' ').trim());
  const removeEmptyLines = () => applyTool(t => t.replace(/^\s*[\r\n]/gm, ''));
  const sortLines = () => applyTool(t => t.split('\n').sort().join('\n'));
  const reverseText = () => applyTool(t => t.split('').reverse().join(''));
  const removePunctuation = () => applyTool(t => t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""'']/g,"").replace(/\s{2,}/g," "));
  const handleClear = () => applyTool(() => '');

  return (
    <>
      <SEO 
        title={t('text.seoTitle')}
        description={t('text.desc')}
        url={`/${currentLang}/text-analyzer`}
      />

      <div className="max-w-7xl mx-auto flex flex-col h-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Type className="mr-3 h-7 w-7 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
            {t('text.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">{t('text.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 flex-1">
          {/* Main Input Area */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-[400px] lg:min-h-[600px]">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-4 shadow-sm flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline-block">
                {t('text.tools')}
              </span>
              <button 
                onClick={handleUndo} 
                disabled={history.length === 0} 
                title={t('text.undo')} 
                className="w-9 h-9 sm:w-8 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1 hidden md:block"></div>
              <button onClick={toUpperCase} className="px-3 h-9 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                {t('text.uppercase')}
              </button>
              <button onClick={toLowerCase} className="px-3 h-9 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                {t('text.lowercase')}
              </button>
              <button onClick={toTitleCase} className="px-3 h-9 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                {t('text.titleCase')}
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden md:block"></div>
              
              <button onClick={removeExtraSpaces} title={t('text.removeSpaces')} className="w-9 h-9 sm:w-8 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button onClick={removeEmptyLines} title={t('text.removeEmptyLines')} className="w-9 h-9 sm:w-8 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <AlignJustify className="w-4 h-4" />
              </button>
              <button onClick={sortLines} title={t('text.sortLines')} className="w-9 h-9 sm:w-8 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <ArrowDownAZ className="w-4 h-4" />
              </button>
              <button onClick={reverseText} title={t('text.reverse')} className="w-9 h-9 sm:w-8 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <button onClick={removePunctuation} title={t('text.removePunctuation')} className="w-9 h-9 sm:w-8 sm:h-8 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('text.inputLabel')}</label>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={handleCopy}
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-green-600 dark:text-green-400" /> : <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />}
                  {copied ? t('text.copied') : t('text.copy')}
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400 flex items-center px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" /> {t('text.clear')}
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 dark:text-gray-200 resize-none shadow-sm text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-black/20"
              placeholder={t('text.placeholder')}
            />

            {/* Find & Replace Panel */}
            <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="flex items-center mb-2 sm:mb-3">
                <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('text.findReplace')}</h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder={t('text.find')}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors bg-slate-50 dark:bg-black/20"
                />
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder={t('text.replace')}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors bg-slate-50 dark:bg-black/20"
                />
                <button
                  onClick={handleReplaceAll}
                  disabled={!findText}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
                >
                  <Replace className="w-4 h-4 mr-2" />
                  {t('text.replaceBtn')}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="flex flex-col space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">{t('text.stats')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm flex flex-col items-center justify-center w-full overflow-hidden">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">{stats.words}</div>
                  <div title={t('text.words')} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-2 truncate w-full text-center">{t('text.words')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm flex flex-col items-center justify-center w-full overflow-hidden">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">{stats.characters}</div>
                  <div title={t('text.chars')} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-2 truncate w-full text-center">{t('text.chars')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm flex flex-col items-center justify-center w-full overflow-hidden">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">{stats.lines}</div>
                  <div title={t('text.lines')} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-2 truncate w-full text-center">{t('text.lines')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm flex flex-col items-center justify-center w-full overflow-hidden">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">{stats.sentences}</div>
                  <div title={t('text.sentences')} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-2 truncate w-full text-center">{t('text.sentences')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm flex flex-col items-center justify-center w-full overflow-hidden">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">{stats.paragraphs}</div>
                  <div title={t('text.paragraphs')} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-2 truncate w-full text-center">{t('text.paragraphs')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg shadow-sm flex flex-col items-center justify-center w-full overflow-hidden">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none truncate w-full text-center">~{stats.readingTimeMin}m</div>
                  <div title={t('text.readingTime')} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-2 truncate w-full text-center">{t('text.readingTime')}</div>
                </div>
              </div>
            </div>

            {/* Advanced Stats & Readability */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('text.advancedStats')}</h3>
                <div className="flex items-center text-xs font-bold bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                  {t('text.readability')}: {stats.readabilityScore}/100
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('text.byteSize')}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.byteSize} B</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('text.letters')}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.letters}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('text.numbers')}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.numbers}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('text.longestWord')}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]" title={stats.longestWord}>
                    {stats.longestWord}
                  </span>
                </div>
              </div>
            </div>

            {/* Data Extraction */}
            {(stats.emails.length > 0 || stats.urls.length > 0) && (
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 sm:p-6 border border-blue-100 dark:border-blue-900/50 shadow-sm">
                <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  {t('text.extractedData')}
                </h3>
                
                {stats.emails.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center">
                      <Mail className="w-3 h-3 mr-1" /> {t('text.emails')} ({stats.emails.length})
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/50 p-2 max-h-32 overflow-y-auto text-sm">
                      {stats.emails.map((email, i) => (
                        <div key={i} className="text-gray-700 dark:text-gray-300 py-1 border-b border-gray-50 last:border-0 truncate">{email}</div>
                      ))}
                    </div>
                  </div>
                )}

                {stats.urls.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center">
                      <Link className="w-3 h-3 mr-1" /> {t('text.urls')} ({stats.urls.length})
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-900/50 p-2 max-h-32 overflow-y-auto text-sm">
                      {stats.urls.map((url, i) => (
                        <div key={i} className="text-gray-700 dark:text-gray-300 py-1 border-b border-gray-50 last:border-0 truncate">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{url}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keyword Density */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t('text.keywordDensity')}</h3>
              {stats.topKeywords.length > 0 ? (
                <div className="space-y-3">
                  {stats.topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate mr-2" title={kw.word}>{kw.word}</span>
                      <div className="flex items-center space-x-3 min-w-[100px] justify-end">
                        <span className="text-gray-500 dark:text-gray-400">{kw.count}x</span>
                        <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 py-0.5 px-2 rounded font-mono text-xs w-14 text-right">
                          {kw.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-70">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-400 dark:text-slate-400 text-center font-medium">
                    {t('text.noText')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2 text-emerald-500" />
            {t('text.help.title')}
          </h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`text.help.${num}`)}</li>
            ))}
          </ul>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('text.longDesc.title')}</h2>
          <div className="prose prose-emerald dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('text.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('text.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('text.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('text.longDesc.p4')}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('text.longDesc.p5')}
              </p>
            </div>
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
                Text Analyzer 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Text Analyzer 도구는 analyze text statistics 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Text Analyzer 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Text Analyzer의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Text Analyzer 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Text Analyzer ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Text Analyzer ツールは、analyze text statistics するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Text Analyzer を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Text Analyzer のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Text Analyzer ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Text Analyzer tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Text Analyzer is a specialized utility designed to analyze text statistics. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Text Analyzer?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Text Analyzer happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Text Analyzer is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 analyze text statistics 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に analyze text statistics したい場合に非常に便利です。
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
                When you are working on a project and need to quickly analyze text statistics without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to analyze text statistics.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how analyze processes work visually.
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