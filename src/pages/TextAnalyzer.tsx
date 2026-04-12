import React, { useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Type, Trash2, Info, Copy, Check, Search, Replace, AlignLeft, AlignJustify, ArrowDownAZ, ArrowLeftRight, Eraser, Link, Mail, FileText, Database, Undo2 } from 'lucide-react';
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

      <div className="max-w-7xl mx-auto flex flex-col h-full px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Type className="mr-3 h-8 w-8 text-purple-600" />
            {t('text.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('text.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Main Input Area */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-[600px]">
            {/* Toolbar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-4 shadow-sm flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden sm:inline-block">
                {t('text.tools')}
              </span>
              <button 
                onClick={handleUndo} 
                disabled={history.length === 0} 
                title={t('text.undo')} 
                className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1 hidden md:block"></div>
              <button onClick={toUpperCase} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                {t('text.uppercase')}
              </button>
              <button onClick={toLowerCase} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                {t('text.lowercase')}
              </button>
              <button onClick={toTitleCase} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors">
                {t('text.titleCase')}
              </button>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden md:block"></div>
              
              <button onClick={removeExtraSpaces} title={t('text.removeSpaces')} className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button onClick={removeEmptyLines} title={t('text.removeEmptyLines')} className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <AlignJustify className="w-4 h-4" />
              </button>
              <button onClick={sortLines} title={t('text.sortLines')} className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <ArrowDownAZ className="w-4 h-4" />
              </button>
              <button onClick={reverseText} title={t('text.reverse')} className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <button onClick={removePunctuation} title={t('text.removePunctuation')} className="p-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('text.inputLabel')}</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t('text.copied') : t('text.copy')}
                </button>
                <button
                  onClick={handleClear}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 flex items-center px-2 py-1 rounded hover:bg-red-50 dark:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> {t('text.clear')}
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 dark:text-gray-200 resize-none shadow-sm text-base leading-relaxed"
              placeholder={t('text.placeholder')}
            />

            {/* Find & Replace Panel */}
            <div className="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <Search className="w-4 h-4 text-purple-600 mr-2" />
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('text.findReplace')}</h4>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder={t('text.find')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder={t('text.replace')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <button
                  onClick={handleReplaceAll}
                  disabled={!findText}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
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
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-4">{t('text.stats')}</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.words}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{t('text.words')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.characters}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{t('text.chars')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.lines}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{t('text.lines')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.sentences}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{t('text.sentences')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xl font-bold text-purple-600">{stats.paragraphs}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{t('text.paragraphs')}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                  <div className="text-xl font-bold text-purple-600">~{stats.readingTimeMin}m</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mt-1">{t('text.readingTime')}</div>
                </div>
              </div>
            </div>

            {/* Advanced Stats & Readability */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{t('text.advancedStats')}</h3>
                <div className="flex items-center text-xs font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded-md border border-purple-100">
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
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 border border-blue-100 shadow-sm">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  {t('text.extractedData')}
                </h3>
                
                {stats.emails.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center">
                      <Mail className="w-3 h-3 mr-1" /> {t('text.emails')} ({stats.emails.length})
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-100 p-2 max-h-32 overflow-y-auto text-sm">
                      {stats.emails.map((email, i) => (
                        <div key={i} className="text-gray-700 dark:text-gray-300 py-1 border-b border-gray-50 last:border-0 truncate">{email}</div>
                      ))}
                    </div>
                  </div>
                )}

                {stats.urls.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center">
                      <Link className="w-3 h-3 mr-1" /> {t('text.urls')} ({stats.urls.length})
                    </h4>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-100 p-2 max-h-32 overflow-y-auto text-sm">
                      {stats.urls.map((url, i) => (
                        <div key={i} className="text-gray-700 dark:text-gray-300 py-1 border-b border-gray-50 last:border-0 truncate">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Keyword Density */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{t('text.keywordDensity')}</h3>
              {stats.topKeywords.length > 0 ? (
                <div className="space-y-3">
                  {stats.topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate mr-2" title={kw.word}>{kw.word}</span>
                      <div className="flex items-center space-x-3 min-w-[100px] justify-end">
                        <span className="text-gray-500 dark:text-gray-400">{kw.count}x</span>
                        <span className="bg-purple-100 text-purple-700 py-0.5 px-2 rounded font-mono text-xs w-14 text-right">
                          {kw.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                  {t('text.noText')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-purple-50 rounded-xl p-6 border border-purple-100">
          <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('text.help.title')}
          </h3>
          <ul className="space-y-2 text-purple-800 text-sm list-disc list-inside">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>{t(`text.help.${num}`)}</li>
            ))}
          </ul>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('text.longDesc.title')}</h2>
          <div className="prose prose-purple max-w-none text-gray-700 dark:text-gray-300 space-y-6">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
