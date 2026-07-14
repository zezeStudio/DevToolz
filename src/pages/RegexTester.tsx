import React, { useState, useMemo } from 'react';
import { Search, Info, Copy, Check, Trash2, AlertCircle, BookOpen, Clock, ArrowRight, List, ChevronDown, ChevronUp, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
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
  const { t, i18n } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const [mode, setMode] = useState<'test' | 'replace'>('test');
  const [pattern, setPattern] = useState('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Contact us at support@zezelab.xyz or info@example.com for help.');
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

      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('regex.title')}</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">{t('regex.desc')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setMode('test')} 
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'test' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              {t('regex.modeTest')}
            </button>
            <button 
              onClick={() => setMode('replace')} 
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'replace' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              {t('regex.modeReplace')}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? t('common.copied', 'Copied') : t('common.copy', 'Copy Regex')}
            </button>
            <button
              onClick={() => {
                setPattern('');
                setTestText('');
                setReplaceText('');
              }}
              className="flex-1 sm:flex-none flex items-center justify-center px-3 md:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('common.clear', 'Clear')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Pattern Input & Common Patterns */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-3">
              <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t('regex.patternLabel')}
              </label>
              <select
                onChange={handlePatternChange}
                className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500"
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
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f.char}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 font-mono text-base md:text-lg">/</span>
            </div>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className={`block w-full pl-7 pr-16 md:pr-20 py-2 border border-transparent rounded-xl font-mono text-base md:text-lg bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                results.error ? 'ring-red-500 bg-red-50 dark:bg-red-900/10' : 'focus:ring-emerald-500 ring-slate-200 dark:ring-slate-700'
              } shadow-sm`}
              placeholder="[a-z]+"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500 font-mono text-base md:text-lg">/{flags}</span>
            </div>
          </div>
          {results.error && (
            <div className="mt-3 flex items-center text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {t('regex.invalidRegex')}: {results.error}
            </div>
          )}
        </div>

        {/* Replace Input (Only visible in Replace mode) */}
        {mode === 'replace' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
              {t('regex.replaceLabel')}
            </label>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="block w-full px-4 py-2.5 md:py-3 border-2 border-slate-200 dark:border-white/[0.06] rounded-xl font-mono text-base md:text-lg dark:bg-black/20 dark:text-white focus:outline-none focus:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50"
              placeholder="$1"
            />
          </div>
        )}

        {/* Test Text & Result Grid */}
        <div className={`grid grid-cols-1 ${mode === 'replace' ? 'lg:grid-cols-2' : ''} gap-6`}>
          {/* Test Text Input */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm flex flex-col">
            <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
              {t('regex.testTextLabel')}
            </label>
            <div className="relative font-mono text-base md:text-lg leading-relaxed flex-1">
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                rows={mode === 'replace' ? 8 : 6}
                className="block w-full h-full min-h-[150px] p-3 md:p-4 border-2 border-slate-200 dark:border-white/[0.06] rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-y relative z-10 text-transparent caret-slate-900 dark:caret-white bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50"
                spellCheck={false}
                style={{ lineHeight: '1.625' }}
              />
              <div 
                className="absolute inset-0 p-3 md:p-4 whitespace-pre-wrap break-words pointer-events-none overflow-auto text-slate-900 dark:text-slate-300"
                style={{ lineHeight: '1.625' }}
              >
                {highlightedText}
              </div>
            </div>
          </div>

          {/* Replace Result (Only visible in Replace mode) */}
          {mode === 'replace' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm flex flex-col">
              <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
                {t('regex.replaceResult')}
              </label>
              <div className="relative font-mono text-base md:text-lg leading-relaxed flex-1">
                <textarea
                  value={results.replacedText}
                  readOnly
                  rows={8}
                  className="block w-full h-full min-h-[150px] p-3 md:p-4 border-2 border-slate-200 dark:border-white/[0.06] rounded-xl dark:bg-black/20 text-slate-900 dark:text-slate-300 focus:outline-none transition-colors resize-y dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900"
                  spellCheck={false}
                  style={{ lineHeight: '1.625' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Matches Results */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <label className="block text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t('regex.matchesLabel')}
            </label>
            <div className="flex items-center gap-2">
              <span className="flex items-center px-2 md:px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] md:text-xs font-medium rounded-full">
                <Clock className="w-3 h-3 mr-1" />
                {t('regex.execTime', { time: results.execTime })}
              </span>
              <span className="px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 text-[10px] md:text-xs font-bold rounded-full">
                {t('regex.matchCount', { count: results.matches.length })}
              </span>
            </div>
          </div>

          {results.matches.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {results.matches.map((match, i) => (
                <div key={i} className="p-3 md:p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] md:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Match {i + 1}</span>
                    <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-mono">{t('regex.indexLabel')}: {match.index}</span>
                  </div>
                  <div className="font-mono text-sm md:text-base text-slate-900 dark:text-white break-all mb-3 bg-white dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-800">
                    {match.text}
                  </div>
                  {match.groups.length > 0 && (
                    <div className="mt-3 bg-slate-100/50 dark:bg-slate-950/50 rounded-lg p-2.5 space-y-1.5 border border-slate-200/50 dark:border-slate-800/50">
                      {match.groups.map((group, gi) => (
                        <div key={gi} className="flex items-baseline font-mono text-[11px] md:text-xs">
                          <span className="w-12 flex-shrink-0 text-slate-500 dark:text-slate-400 select-none">${gi + 1}</span>
                          <span className="text-slate-700 dark:text-slate-300 break-all">{group || <span className="text-slate-500 dark:text-slate-400/70 italic">empty</span>}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>{t('regex.noMatches')}</p>
            </div>
          )}
        </div>

        {/* Cheatsheet Toggle */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <button 
            onClick={() => setShowCheatsheet(!showCheatsheet)}
            className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:bg-slate-50 dark:focus-visible:bg-slate-700/30"
          >
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('regex.cheatsheet')}
              </h2>
            </div>
            {showCheatsheet ? <ChevronUp className="h-5 w-5 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />}
          </button>
          
          {showCheatsheet && (
            <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CHEATSHEET.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-baseline text-sm">
                          <code className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-mono text-xs mr-2 min-w-[3rem] text-center">
                            {item.syntax}
                          </code>
                          <span className="text-slate-600 dark:text-slate-300 text-xs">{item.desc}</span>
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
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
              {t('regex.help.1')}
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
              {t('regex.help.2')}
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
              {t('regex.help.3')}
            </li>
          </ul>
        </div>

        {/* Long Description for SEO and Guide */}
        <div className="prose dark:prose-invert max-w-none mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
            {t('regex.seo.title')}
          </h2>
          
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {t('regex.seo.p1')}
          </p>
          
          <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
            {t('regex.seo.h2')}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {t('regex.seo.p2')}
          </p>
          
          <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
            {t('regex.seo.h3')}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
            {t('regex.seo.p3')}
          </p>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-6">
            {t('regex.seo.p4')}
          </p>
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
                Regex Tester 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Regex Tester 도구는 test regular expressions 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Regex Tester 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Regex Tester의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Regex Tester 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Regex Tester ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Regex Tester ツールは、test regular expressions するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Regex Tester を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Regex Tester のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Regex Tester ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Regex Tester tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Regex Tester is a specialized utility designed to test regular expressions. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Regex Tester?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Regex Tester happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Regex Tester is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 test regular expressions 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に test regular expressions したい場合に非常に便利です。
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
                When you are working on a project and need to quickly test regular expressions without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to test regular expressions.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how test processes work visually.
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
    </div>
  );
}