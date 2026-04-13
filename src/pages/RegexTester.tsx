import React, { useState, useMemo } from 'react';
import { Search, Info, Copy, Check, Trash2, AlertCircle, BookOpen, Clock, ArrowRight, List, ChevronDown, ChevronUp } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const COMMON_PATTERNS = [
  { id: 'custom', label: 'regex.custom', pattern: '', flags: 'g' },
  { id: 'email', label: 'Email', pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})', flags: 'g' },
  { id: 'url', label: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'g' },
  { id: 'ipv4', label: 'IPv4 Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g' },
  { id: 'password', label: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', flags: '' },
  { id: 'html', label: 'HTML Tag', pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)', flags: 'gi' }
];

const CHEATSHEET = [
  { 
    category: 'Character Classes', 
    items: [ 
      { syntax: '.', desc: 'Any character except newline' }, 
      { syntax: '\\w', desc: 'Word char [a-zA-Z0-9_]' }, 
      { syntax: '\\W', desc: 'Non-word char' }, 
      { syntax: '\\d', desc: 'Digit [0-9]' }, 
      { syntax: '\\D', desc: 'Non-digit' }, 
      { syntax: '\\s', desc: 'Whitespace' }, 
      { syntax: '\\S', desc: 'Non-whitespace' } 
    ] 
  },
  { 
    category: 'Anchors', 
    items: [ 
      { syntax: '^', desc: 'Start of string' }, 
      { syntax: '$', desc: 'End of string' }, 
      { syntax: '\\b', desc: 'Word boundary' }, 
      { syntax: '\\B', desc: 'Non-word boundary' } 
    ] 
  },
  { 
    category: 'Quantifiers', 
    items: [ 
      { syntax: '*', desc: '0 or more' }, 
      { syntax: '+', desc: '1 or more' }, 
      { syntax: '?', desc: '0 or 1' }, 
      { syntax: '{n}', desc: 'Exactly n times' }, 
      { syntax: '{n,}', desc: 'n or more times' }, 
      { syntax: '{n,m}', desc: 'n to m times' } 
    ] 
  },
  { 
    category: 'Groups & Lookarounds', 
    items: [ 
      { syntax: '(abc)', desc: 'Capture group' }, 
      { syntax: '(?:abc)', desc: 'Non-capturing group' }, 
      { syntax: '(?=abc)', desc: 'Positive lookahead' }, 
      { syntax: '(?!abc)', desc: 'Negative lookahead' }, 
      { syntax: '(?<=abc)', desc: 'Positive lookbehind' }, 
      { syntax: '(?<!abc)', desc: 'Negative lookbehind' } 
    ] 
  }
];

export function RegexTester() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const [mode, setMode] = useState<'test' | 'replace'>('test');
  const [pattern, setPattern] = useState('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@devtoolz.app or info@example.com for help.');
  const [replaceText, setReplaceText] = useState('user@domain.com');
  const [copied, setCopied] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const availableFlags = [
    { char: 'g', label: 'global' },
    { char: 'i', label: 'insensitive' },
    { char: 'm', label: 'multiline' },
    { char: 's', label: 'single line' },
    { char: 'u', label: 'unicode' },
    { char: 'y', label: 'sticky' },
  ];

  const results = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replacedText: testText, execTime: '0.00' };

    const start = performance.now();
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;
      let replacedText = testText;

      if (mode === 'replace') {
        replacedText = testText.replace(regex, replaceText);
      }

      if (flags.includes('g')) {
        let lastMatchIndex = -1;
        while ((match = regex.exec(testText)) !== null) {
          // Prevent infinite loops if the regex doesn't advance
          if (match.index === lastMatchIndex && regex.lastIndex === lastMatchIndex) {
            regex.lastIndex++;
            continue;
          }
          lastMatchIndex = match.index;

          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      const end = performance.now();
      return { matches, error: null, replacedText, execTime: (end - start).toFixed(2) };
    } catch (e) {
      return { matches: [], error: (e as Error).message, replacedText: testText, execTime: '0.00' };
    }
  }, [pattern, flags, testText, mode, replaceText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COMMON_PATTERNS.find(p => p.id === e.target.value);
    if (selected && selected.id !== 'custom') {
      setPattern(selected.pattern);
      setFlags(selected.flags);
    }
  };

  const highlightedText = useMemo(() => {
    if (results.error || results.matches.length === 0) return testText;

    let lastIndex = 0;
    const parts = [];

    const sortedMatches = [...results.matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      if (match.index > lastIndex) {
        parts.push(testText.substring(lastIndex, match.index));
      }
      
      parts.push(
        <span 
          key={i} 
          className="bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 rounded px-0.5 border-b-2 border-blue-500"
        >
          {match.text}
        </span>
      );
      
      lastIndex = match.index + match.text.length;
    });

    if (lastIndex < testText.length) {
      parts.push(testText.substring(lastIndex));
    }

    return parts;
  }, [testText, results]);

  return (
    <div className="max-w-5xl mx-auto">
      <SEO 
        title={t('regex.seoTitle')}
        description={t('regex.desc')}
        url={`/${currentLang}/regex-tester`}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('regex.title')}</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{t('regex.desc')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setMode('test')} 
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'test' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              {t('regex.modeTest')}
            </button>
            <button 
              onClick={() => setMode('replace')} 
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'replace' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              {t('regex.modeReplace')}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? t('common.copied') || 'Copied' : t('common.copy') || 'Copy Regex'}
            </button>
            <button
              onClick={() => {
                setPattern('');
                setTestText('');
                setReplaceText('');
              }}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('common.clear') || 'Clear'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Pattern Input & Common Patterns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('regex.patternLabel')}
              </label>
              <select
                onChange={handlePatternChange}
                className="text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500"
              >
                {COMMON_PATTERNS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id === 'custom' ? t(p.label) : p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-1">
              {availableFlags.map(f => (
                <button
                  key={f.char}
                  onClick={() => toggleFlag(f.char)}
                  title={f.label}
                  className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded text-[10px] md:text-xs font-bold transition-colors ${
                    flags.includes(f.char)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {f.char}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 font-mono text-base md:text-lg">/</span>
            </div>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className={`block w-full pl-6 pr-16 md:pr-20 py-2.5 md:py-3 border-2 rounded-xl font-mono text-base md:text-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none transition-colors ${
                results.error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
              }`}
              placeholder="[a-z]+"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 font-mono text-base md:text-lg">/{flags}</span>
            </div>
          </div>
          {results.error && (
            <div className="mt-3 flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {t('regex.invalidRegex')}: {results.error}
            </div>
          )}
        </div>

        {/* Replace Input (Only visible in Replace mode) */}
        {mode === 'replace' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
              {t('regex.replaceLabel')}
            </label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="block w-full px-4 py-2.5 md:py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-mono text-base md:text-lg bg-gray-50 dark:bg-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="$1"
            />
          </div>
        )}

        {/* Test Text & Result Grid */}
        <div className={`grid grid-cols-1 ${mode === 'replace' ? 'lg:grid-cols-2' : ''} gap-6`}>
          {/* Test Text Input */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm flex flex-col">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
              {t('regex.testTextLabel')}
            </label>
            <div className="relative font-mono text-base md:text-lg leading-relaxed flex-1">
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                rows={mode === 'replace' ? 8 : 6}
                className="block w-full h-full min-h-[150px] p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-transparent focus:outline-none focus:border-blue-500 transition-colors resize-y relative z-10 text-transparent caret-gray-900 dark:caret-white"
                spellCheck={false}
                style={{ lineHeight: '1.625' }}
              />
              <div 
                className="absolute inset-0 p-3 md:p-4 whitespace-pre-wrap break-words pointer-events-none overflow-auto text-gray-900 dark:text-gray-300"
                style={{ lineHeight: '1.625' }}
              >
                {highlightedText}
              </div>
            </div>
          </div>

          {/* Replace Result (Only visible in Replace mode) */}
          {mode === 'replace' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm flex flex-col">
              <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">
                {t('regex.replaceResult')}
              </label>
              <div className="relative font-mono text-base md:text-lg leading-relaxed flex-1">
                <textarea
                  value={results.replacedText}
                  readOnly
                  rows={8}
                  className="block w-full h-full min-h-[150px] p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-300 focus:outline-none transition-colors resize-y"
                  spellCheck={false}
                  style={{ lineHeight: '1.625' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Matches Results */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <label className="block text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {t('regex.matchesLabel')}
            </label>
            <div className="flex items-center gap-2">
              <span className="flex items-center px-2 md:px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] md:text-xs font-medium rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                {t('regex.execTime', { time: results.execTime })}
              </span>
              <span className="px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] md:text-xs font-bold rounded-full">
                {t('regex.matchCount', { count: results.matches.length })}
              </span>
            </div>
          </div>

          {results.matches.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {results.matches.map((match, i) => (
                <div key={i} className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Match {i + 1}</span>
                    <span className="text-[10px] md:text-xs text-gray-400 font-mono">{t('regex.indexLabel')}: {match.index}</span>
                  </div>
                  <div className="font-mono text-sm md:text-base text-gray-900 dark:text-white break-all mb-3 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                    {match.text}
                  </div>
                  {match.groups.length > 0 && (
                    <div className="grid grid-cols-1 gap-1.5">
                      {match.groups.map((group, gi) => (
                        <div key={gi} className="flex items-start text-[10px] md:text-xs">
                          <span className="w-16 md:w-20 flex-shrink-0 text-gray-500 dark:text-gray-400 font-medium">{t('regex.groupLabel')} {gi + 1}:</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 break-all">{group || '(empty)'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>{t('regex.noMatches')}</p>
            </div>
          )}
        </div>

        {/* Cheatsheet Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <button 
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                {t('regex.cheatsheet')}
              </h2>
            </div>
            {showCheatsheet ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
          
          {showCheatsheet && (
            <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CHEATSHEET.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-baseline text-sm">
                          <code className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs mr-2 min-w-[3rem] text-center">
                            {item.syntax}
                          </code>
                          <span className="text-gray-600 dark:text-gray-300 text-xs">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">{t('regex.help.title')}</h2>
          </div>
          <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
              {t('regex.help.1')}
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
              {t('regex.help.2')}
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
              {t('regex.help.3')}
            </li>
          </ul>
        </div>

        {/* Long Description for SEO */}
        <div className="prose dark:prose-invert max-w-none mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">{t('regex.longDesc.title')}</h2>
          <p>{t('regex.longDesc.p1')}</p>
          <p>{t('regex.longDesc.p2')}</p>
          <p>{t('regex.longDesc.p3')}</p>
        </div>
      </div>
    </div>
  );
}
