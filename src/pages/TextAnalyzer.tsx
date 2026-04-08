import React, { useState, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { Type, Trash2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TextAnalyzer() {
  const [text, setText] = useState('');
  const { t, i18n } = useTranslation();

  const stats = useMemo(() => {
    if (!text.trim()) {
      return { 
        words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0, sentences: 0, 
        readingTimeMin: 0, topKeywords: [], byteSize: 0, longestWord: '-', letters: 0, numbers: 0 
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
    
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

    // Keyword density
    const wordCounts: Record<string, number> = {};
    words.forEach(w => {
      const lower = w.toLowerCase();
      wordCounts[lower] = (wordCounts[lower] || 0) + 1;
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

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      readingTimeMin,
      topKeywords,
      byteSize,
      longestWord,
      letters,
      numbers
    };
  }, [text, i18n.language]);

  return (
    <>
      <SEO 
        title={`${t('text.title')} - DevToolz`}
        description={t('text.desc')}
        url="/text-analyzer"
        schema={[
          {
            "@type": "SoftwareApplication",
            "name": t('text.title'),
            "description": t('text.desc'),
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "HowTo",
            "name": t('text.help.title'),
            "step": [
              { "@type": "HowToStep", "text": t('text.help.1') },
              { "@type": "HowToStep", "text": t('text.help.2') },
              { "@type": "HowToStep", "text": t('text.help.3') }
            ]
          }
        ]}
      />

      <div className="max-w-5xl mx-auto flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Type className="mr-3 h-8 w-8 text-purple-600" />
            {t('text.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('text.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          {/* Main Input Area */}
          <div className="lg:col-span-2 flex flex-col h-full min-h-[400px]">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('text.inputLabel')}</label>
              <button
                onClick={() => setText('')}
                className="text-sm text-red-600 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" /> {t('text.clear')}
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 resize-none shadow-sm"
              placeholder={t('text.placeholder')}
            />
          </div>

          {/* Stats Panel */}
          <div className="flex flex-col space-y-6">
            {/* Quick Stats */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-bold text-purple-900 mb-4">{t('text.stats')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.words}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('text.words')}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.characters}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('text.chars')}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.sentences}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('text.sentences')}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.paragraphs}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">{t('text.paragraphs')}</div>
                </div>
              </div>
              
              <div className="mt-4 bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{t('text.readingTime')}</span>
                <span className="font-bold text-purple-600">~{stats.readingTimeMin} min</span>
              </div>
            </div>

            {/* Advanced Stats */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">{t('text.advancedStats')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-600">{t('text.byteSize')}</span>
                  <span className="font-semibold text-gray-900">{stats.byteSize} B</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-600">{t('text.letters')}</span>
                  <span className="font-semibold text-gray-900">{stats.letters}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-600">{t('text.numbers')}</span>
                  <span className="font-semibold text-gray-900">{stats.numbers}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-600">{t('text.longestWord')}</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[120px]" title={stats.longestWord}>
                    {stats.longestWord}
                  </span>
                </div>
              </div>
            </div>

            {/* Keyword Density */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex-1">
              <h3 className="font-bold text-gray-900 mb-4">{t('text.keywordDensity')}</h3>
              {stats.topKeywords.length > 0 ? (
                <div className="space-y-3">
                  {stats.topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 truncate mr-2" title={kw.word}>{kw.word}</span>
                      <div className="flex items-center space-x-3 min-w-[100px] justify-end">
                        <span className="text-gray-500">{kw.count}x</span>
                        <span className="bg-purple-100 text-purple-700 py-0.5 px-2 rounded font-mono text-xs w-14 text-right">
                          {kw.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">
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
            <li>{t('text.help.1')}</li>
            <li>{t('text.help.2')}</li>
            <li>{t('text.help.3')}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
