import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Key, Copy, Check, RefreshCw, Info, Shield, Eye, EyeOff, QrCode, X, Book, Undo2, ShieldCheck, AlertTriangle, Layers, Settings2, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const ADJECTIVES = ['Swift', 'Bright', 'Silent', 'Strong', 'Kind', 'Fast', 'Cool', 'Warm', 'Bold', 'Wise', 'Grand', 'Pure', 'Vast', 'Deep', 'High', 'Blue', 'Red', 'Gold', 'Silver', 'Iron'];
const NOUNS = ['Eagle', 'River', 'Mountain', 'Forest', 'Ocean', 'Star', 'Cloud', 'Wind', 'Fire', 'Stone', 'Wolf', 'Lion', 'Bear', 'Hawk', 'Tiger', 'Oak', 'Pine', 'Lake', 'Peak', 'Moon'];
const WORDLIST = [...ADJECTIVES, ...NOUNS];

const ColoredPassword: React.FC<{ password: string, show: boolean }> = ({ password, show }) => {
  if (!show) return <span className="text-slate-400 dark:text-slate-400 tracking-[0.2em]">{'•'.repeat(password.length)}</span>;
  return (
    <>
      {password.split('').map((char, i) => {
        if (/[A-Z]/.test(char)) return <span key={i} className="text-slate-900 dark:text-slate-100 font-bold">{char}</span>;
        if (/[a-z]/.test(char)) return <span key={i} className="text-slate-700 dark:text-slate-300">{char}</span>;
        if (/[0-9]/.test(char)) return <span key={i} className="text-blue-600 dark:text-blue-400 font-bold">{char}</span>;
        return <span key={i} className="text-rose-500 dark:text-rose-400 font-black">{char}</span>;
      })}
    </>
  );
};

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [previousPassword, setPreviousPassword] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [bulkCount, setBulkCount] = useState(1);
  const [isGeneratingState, setIsGeneratingState] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showPasswords) {
      timeoutId = setTimeout(() => {
        setShowPasswords(false);
      }, 30000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showPasswords, password]);

  // Advanced Rules (Random)
  const [strictStartWithLetter, setStrictStartWithLetter] = useState(false);
  const [strictNoSequential, setStrictNoSequential] = useState(false);

  // Passphrase Settings
  const [passphraseSeparator, setPassphraseSeparator] = useState('-');
  const [passphraseCapitalize, setPassphraseCapitalize] = useState(true);
  const [passphraseIncludeNumber, setPassphraseIncludeNumber] = useState(false);
  
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const generateSinglePassword = () => {
    if (mode === 'passphrase') {
      const wordCount = Math.max(3, Math.floor(length / 5));
      let words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        let word = WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
        if (!passphraseCapitalize) {
          word = word.toLowerCase();
        }
        words.push(word);
      }
      if (passphraseIncludeNumber) {
        words[words.length - 1] += Math.floor(Math.random() * 100).toString();
      }
      return words.join(passphraseSeparator);
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    const ambiguous = 'il1Lo0O';

    let uppercasePool = uppercase;
    let lowercasePool = lowercase;
    let numbersPool = numbers;
    let symbolsPool = symbols;

    if (excludeAmbiguous) {
      const filter = (s: string) => s.split('').filter(c => !ambiguous.includes(c)).join('');
      uppercasePool = filter(uppercase);
      lowercasePool = filter(lowercase);
      numbersPool = filter(numbers);
      symbolsPool = filter(symbols);
    }

    let chars = '';
    if (includeUppercase) chars += uppercasePool;
    if (includeLowercase) chars += lowercasePool;
    if (includeNumbers) chars += numbersPool;
    if (includeSymbols) chars += symbolsPool;

    if (chars === '') return '';

    const getRandomInt = (max: number) => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    };

    const hasSequential = (str: string) => {
      for(let i=0; i<str.length-2; i++) {
        const c1 = str.charCodeAt(i);
        const c2 = str.charCodeAt(i+1);
        const c3 = str.charCodeAt(i+2);
        if (c1 + 1 === c2 && c2 + 1 === c3) return true;
        if (c1 - 1 === c2 && c2 - 1 === c3) return true;
      }
      return false;
    };

    const generateRaw = () => {
      let generated = '';
      if (includeUppercase && uppercasePool) generated += uppercasePool[getRandomInt(uppercasePool.length)];
      if (includeLowercase && lowercasePool) generated += lowercasePool[getRandomInt(lowercasePool.length)];
      if (includeNumbers && numbersPool) generated += numbersPool[getRandomInt(numbersPool.length)];
      if (includeSymbols && symbolsPool) generated += symbolsPool[getRandomInt(symbolsPool.length)];

      for (let i = generated.length; i < length; i++) {
        generated += chars[getRandomInt(chars.length)];
      }

      const arr = generated.split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = getRandomInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join('');
    };

    let finalPassword = '';
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 100) {
      finalPassword = generateRaw();
      valid = true;

      if (strictStartWithLetter) {
        if (!/^[a-zA-Z]/.test(finalPassword)) {
          const letterIdx = finalPassword.split('').findIndex(c => /[a-zA-Z]/.test(c));
          if (letterIdx > 0) {
            const arr = finalPassword.split('');
            [arr[0], arr[letterIdx]] = [arr[letterIdx], arr[0]];
            finalPassword = arr.join('');
          } else if (includeUppercase || includeLowercase) {
            valid = false;
          }
        }
      }

      if (strictNoSequential && hasSequential(finalPassword)) {
        valid = false;
      }

      attempts++;
    }

    return finalPassword;
  };

  const generatePasswords = () => {
    if (password) setPreviousPassword(password);
    const newPasswords = [];
    for (let i = 0; i < bulkCount; i++) {
      const p = generateSinglePassword();
      if (p) newPasswords.push(p);
    }
    setPasswords(newPasswords);
    if (newPasswords.length > 0) {
      setPassword(newPasswords[0]);
    }
  };

  const restorePrevious = () => {
    if (previousPassword) {
      const current = password;
      setPassword(previousPassword);
      setPreviousPassword(current);
    }
  };

  const handleGenerateClick = () => {
    setIsGeneratingState(true);
    generatePasswords();
    setTimeout(() => setIsGeneratingState(false), 500);
  };

  useEffect(() => {
    generatePasswords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, 
    excludeAmbiguous, mode, passphraseSeparator, passphraseCapitalize, 
    passphraseIncludeNumber, strictStartWithLetter, strictNoSequential
  ]);

  const copyToClipboard = async (text: string, index: number | null = null) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index === null ? -1 : index);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const copyAllToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(passwords.join('\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all: ', err);
    }
  };

  const calculateEntropy = (pass: string) => {
    if (!pass) return 0;
    let poolSize = 0;
    if (/[a-z]/.test(pass)) poolSize += 26;
    if (/[A-Z]/.test(pass)) poolSize += 26;
    if (/[0-9]/.test(pass)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(pass)) poolSize += 32;
    if (poolSize === 0) return 0;
    return Math.floor(pass.length * Math.log2(poolSize));
  };

  const getStrengthInfo = (entropy: number) => {
    if (entropy < 40) return { label: t('pass.weak'), color: 'bg-red-500', text: 'text-red-500' };
    if (entropy < 80) return { label: t('pass.good'), color: 'bg-orange-500', text: 'text-orange-500' };
    return { label: t('pass.strong'), color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const entropy = calculateEntropy(password);
  const strength = getStrengthInfo(entropy);

  return (
    <>
      <SEO 
        title={t('pass.seoTitle')}
        description={t('pass.desc')}
        url={`/${currentLang}/password-generator`}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 rounded-2xl mb-4 shadow-sm">
            <Shield className="h-10 w-10 text-slate-900 dark:text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{t('pass.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg max-w-2xl mx-auto">{t('pass.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 dark:from-slate-800 to-white dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                  {passwords.length <= 1 ? (
                    <>
                      <div className="p-6 min-h-[120px] flex items-center justify-center">
                        <p className="text-xl sm:text-2xl md:text-3xl font-mono text-center text-slate-800 dark:text-slate-200 tracking-wider break-all select-all">
                          <ColoredPassword password={password} show={showPasswords} />
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-3 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                          {showPasswords ? <><EyeOff className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Hide</span></> : <><Eye className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Show</span></>}
                        </button>
                        <button
                          onClick={() => setShowQr(password)}
                          className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                          <QrCode className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">QR Code</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(password)}
                          className="flex-[2] sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
                        >
                          {copied === -1 ? <><Check className="w-4 h-4 mr-2" /> {t('json.copied')}</> : <><Copy className="w-4 h-4 mr-2" /> {t('json.copy')}</>}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                        {passwords.map((p, i) => {
                          const pEntropy = calculateEntropy(p);
                          const pStrength = getStrengthInfo(pEntropy);
                          return (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-3">
                            <div className="flex flex-col gap-1.5 items-start">
                              <code className="text-lg font-mono text-slate-700 dark:text-slate-300 break-all">
                                <ColoredPassword password={p} show={showPasswords} />
                              </code>
                              {showPasswords && (
                                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md shadow-sm border border-transparent ${
                                  pEntropy >= 80 
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                                    : pEntropy >= 40 
                                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                                }`}>
                                  {pEntropy >= 80 ? '●' : pEntropy >= 40 ? '◐' : '○'} {pStrength.label} ({Math.round(pEntropy)} bit)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-auto sm:ml-4 shrink-0">
                              <button onClick={() => setShowQr(p)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-all bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 sm:border-transparent sm:bg-transparent shadow-sm sm:shadow-none">
                                <QrCode className="w-5 h-5" />
                              </button>
                              <button onClick={() => copyToClipboard(p, i)} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-all bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 sm:border-transparent sm:bg-transparent shadow-sm sm:shadow-none">
                                {copied === i ? <Check className="w-5 h-5 text-slate-900 dark:text-white" /> : <Copy className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        )})}
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                          {showPasswords ? <><EyeOff className="w-4 h-4 mr-2" /> Hide All</> : <><Eye className="w-4 h-4 mr-2" /> Show All</>}
                        </button>
                        <button
                          onClick={copyAllToClipboard}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm"
                        >
                          {copiedAll ? <><CheckCheck className="w-4 h-4 mr-2" /> {t('pass.copiedAll')}</> : <><Copy className="w-4 h-4 mr-2" /> {t('pass.copyAll')}</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('pass.strength')}</span>
                    <span className={`text-lg font-black ${strength.text}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end flex-shrink-0">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('pass.entropy')}</span>
                      <span className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{entropy} {t('pass.bits')}</span>
                    </div>
                    <div className="flex space-x-1 h-3 w-24 sm:w-32 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                      <div className={`h-full ${strength.color} transition-all duration-500 ease-out`} style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-8">
                <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                  <button
                    onClick={() => { setMode('random'); setPreviousPassword(null); }}
                    className={`flex-1 flex items-center justify-center py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold transition-all text-sm md:text-base ${mode === 'random' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Random
                  </button>
                  <button
                    onClick={() => { setMode('passphrase'); setPreviousPassword(null); }}
                    className={`flex-1 flex items-center justify-center py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold transition-all text-sm md:text-base ${mode === 'passphrase' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                  >
                    <Book className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> {t('pass.passphrase')}
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('pass.length')}</label>
                    <span className="text-2xl font-black text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-2xl border border-slate-200 dark:border-slate-800">{length}</span>
                  </div>
                  <input
                    type="range"
                    min={mode === 'passphrase' ? "10" : "6"}
                    max="64"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-3 dark:bg-slate-700 rounded-xl appearance-none cursor-pointer border border-slate-200 dark:border-slate-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-slate-900 dark:[&::-webkit-slider-thumb]:bg-slate-100 [&::-webkit-slider-thumb]:rounded-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-slate-800 [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-slate-900 dark:[&::-moz-range-thumb]:bg-slate-100 [&::-moz-range-thumb]:rounded-lg [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-slate-800 [&::-moz-range-thumb]:shadow-sm transition-all bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                {mode === 'random' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {[
                        { id: 'upper', label: t('pass.uppercase'), state: includeUppercase, setter: setIncludeUppercase },
                        { id: 'lower', label: t('pass.lowercase'), state: includeLowercase, setter: setIncludeLowercase },
                        { id: 'num', label: t('pass.numbers'), state: includeNumbers, setter: setIncludeNumbers },
                        { id: 'sym', label: t('pass.symbols'), state: includeSymbols, setter: setIncludeSymbols },
                        { id: 'amb', label: t('pass.excludeAmbiguous'), state: excludeAmbiguous, setter: setExcludeAmbiguous, full: true, hint: '(i, l, 1, L, o, 0, O)' },
                      ].map((opt) => (
                        <label key={opt.id} className={`flex items-center justify-between p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${opt.state ? 'border-slate-900 bg-slate-50 dark:border-slate-300 dark:bg-slate-900/50' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:border-slate-800'} ${opt.full ? 'sm:col-span-2' : ''}`}>
                          <div className="flex flex-col mr-3">
                            <span className={`font-bold text-sm md:text-base ${opt.state ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{opt.label}</span>
                            {opt.hint && <span className={`text-xs mt-0.5 ${opt.state ? 'text-emerald-500/80 dark:text-emerald-400/80' : 'text-slate-400 dark:text-slate-400'}`}>{opt.hint}</span>}
                          </div>
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex shrink-0 items-center justify-center transition-all ${opt.state ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400'}`}>
                            {opt.state && <Check className="w-3 h-3 md:w-4 md:h-4 text-white dark:text-slate-900" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={opt.state}
                            onChange={(e) => opt.setter(e.target.checked)}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                        <Settings2 className="w-4 h-4 mr-2" /> {t('pass.advancedRules')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { id: 'startLetter', label: t('pass.startWithLetter'), state: strictStartWithLetter, setter: setStrictStartWithLetter },
                          { id: 'noSeq', label: t('pass.noSequential'), state: strictNoSequential, setter: setStrictNoSequential },
                        ].map((opt) => (
                          <label key={opt.id} className={`flex items-center justify-between p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${opt.state ? 'border-slate-900 bg-slate-50 dark:border-slate-300 dark:bg-slate-900/50' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:border-slate-800'}`}>
                            <span className={`font-bold text-sm md:text-base mr-3 ${opt.state ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{opt.label}</span>
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex shrink-0 items-center justify-center transition-all ${opt.state ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400'}`}>
                              {opt.state && <Check className="w-3 h-3 md:w-4 md:h-4 text-white dark:text-slate-900" />}
                            </div>
                            <input type="checkbox" checked={opt.state} onChange={(e) => opt.setter(e.target.checked)} className="hidden" />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'passphrase' && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center">
                      <Settings2 className="w-4 h-4 mr-2" /> {t('pass.passphraseSettings')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-center p-3 md:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
                        <span className="font-bold text-sm md:text-base text-slate-500 dark:text-slate-400 mr-auto">{t('pass.separator')}</span>
                        <select
                          value={passphraseSeparator}
                          onChange={(e) => setPassphraseSeparator(e.target.value)}
                          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1 font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="-">Hyphen (-)</option>
                          <option value="_">Underscore (_)</option>
                          <option value=" ">Space ( )</option>
                          <option value=".">Dot (.)</option>
                          <option value="">None</option>
                        </select>
                      </div>
                      {[
                        { id: 'cap', label: t('pass.capitalize'), state: passphraseCapitalize, setter: setPassphraseCapitalize },
                        { id: 'incNum', label: t('pass.includeNumber'), state: passphraseIncludeNumber, setter: setPassphraseIncludeNumber },
                      ].map((opt) => (
                        <label key={opt.id} className={`flex items-center justify-between p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${opt.state ? 'border-slate-900 bg-slate-50 dark:border-slate-300 dark:bg-slate-900/50' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:border-slate-800'}`}>
                          <span className={`font-bold text-sm md:text-base mr-3 ${opt.state ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{opt.label}</span>
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex shrink-0 items-center justify-center transition-all ${opt.state ? 'bg-slate-900 border-slate-900 dark:bg-slate-100 dark:border-slate-100' : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400'}`}>
                            {opt.state && <Check className="w-3 h-3 md:w-4 md:h-4 text-white dark:text-slate-900" />}
                          </div>
                          <input type="checkbox" checked={opt.state} onChange={(e) => opt.setter(e.target.checked)} className="hidden" />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" />
                      <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('pass.bulk')}</span>
                    </div>
                    <select 
                      value={bulkCount}
                      onChange={(e) => setBulkCount(parseInt(e.target.value))}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                    >
                      {[1, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleGenerateClick}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 px-8 rounded-2xl transition-all flex items-center justify-center text-xl shadow-lg dark:shadow-none active:scale-[0.98]"
                  >
                    {isGeneratingState ? <Check className="mr-3 h-6 w-6 animate-pulse" /> : <RefreshCw className="mr-3 h-6 w-6" />} {t('pass.generateBtn')}
                  </button>
                  {previousPassword && (
                    <button
                      onClick={restorePrevious}
                      className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-400 font-bold py-5 px-6 rounded-2xl transition-all flex items-center justify-center text-base border-2 border-slate-200 dark:border-slate-800 active:scale-[0.98]"
                      title={t('pass.undo')}
                    >
                      <Undo2 className="mr-2 h-5 w-5" /> {t('pass.undo')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg p-6">
              <h3 className="font-black text-slate-900 dark:text-slate-100 flex items-center uppercase tracking-widest text-sm mb-6">
                <ShieldCheck className="w-5 h-5 mr-2 text-slate-900 dark:text-white" />
                {t('pass.securityTips')}
              </h3>
              <div className="space-y-4">
                {[t('pass.tip1'), t('pass.tip2'), t('pass.tip3'), t('pass.tip4')].map((tip, i) => (
                  <div key={i} className="flex items-start p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 text-slate-900 dark:text-white p-1 rounded-md mr-3 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-tight font-medium">{tip}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/50 flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-normal">
                  {t('pass.help.2')}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-8 ">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white dark:bg-slate-800/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-xl font-black mb-4 flex items-center">
                <Info className="h-6 w-6 mr-2" />
                {t('pass.help.title')}
              </h3>
              <ul className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <li className="flex items-start">
                  <span className="bg-white dark:bg-slate-800/20 rounded-lg p-1 mr-3 mt-0.5 font-bold text-xs">01</span>
                  {t('pass.help.1')}
                </li>
                <li className="flex items-start">
                  <span className="bg-white dark:bg-slate-800/20 rounded-lg p-1 mr-3 mt-0.5 font-bold text-xs">02</span>
                  {t('pass.help.3')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            {t('pass.seo.title')}
          </h2>
          
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
            <p className="leading-relaxed mb-4">
              {t('pass.seo.p1')}
            </p>
            
            <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
              {t('pass.seo.h2')}
            </h3>
            <p className="leading-relaxed mb-4">
              {t('pass.seo.p2')}
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
              {t('pass.seo.h3')}
            </h3>
            <p className="leading-relaxed mb-4">
              {t('pass.seo.p3')}
            </p>

            <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
               {t('pass.seo.h4')}
            </h3>
            <p className="leading-relaxed mb-4">
               {t('pass.seo.p4')}
            </p>
          </div>
        </div>
      </div>

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">{t('pass.qrCode')}</h3>
              <button onClick={() => setShowQr(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 border-4 border-slate-50 dark:border-slate-800 rounded-2xl flex justify-center mb-6">
              <QRCodeSVG value={showQr} size={200} level="H" includeMargin={true} />
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
              <code className="text-sm font-mono text-slate-600 dark:text-slate-400 break-all block text-center">{showQr}</code>
            </div>
            <button
              onClick={() => {
                copyToClipboard(showQr);
                setShowQr(null);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center shadow-sm"
            >
              <Copy className="w-5 h-5 mr-2" /> {t('json.copy')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
