import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Key, Copy, Check, RefreshCw, Info, Shield, Eye, EyeOff, QrCode, X, Book, Undo2, ShieldCheck, AlertTriangle, Layers, Settings2, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const ADJECTIVES = ['Swift', 'Bright', 'Silent', 'Strong', 'Kind', 'Fast', 'Cool', 'Warm', 'Bold', 'Wise', 'Grand', 'Pure', 'Vast', 'Deep', 'High', 'Blue', 'Red', 'Gold', 'Silver', 'Iron'];
const NOUNS = ['Eagle', 'River', 'Mountain', 'Forest', 'Ocean', 'Star', 'Cloud', 'Wind', 'Fire', 'Stone', 'Wolf', 'Lion', 'Bear', 'Hawk', 'Tiger', 'Oak', 'Pine', 'Lake', 'Peak', 'Moon'];
const WORDLIST = [...ADJECTIVES, ...NOUNS];

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
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

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
    if (entropy < 80) return { label: t('pass.good'), color: 'bg-yellow-500', text: 'text-yellow-500' };
    return { label: t('pass.strong'), color: 'bg-green-500', text: 'text-green-500' };
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
          <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-2xl mb-4 shadow-sm">
            <Shield className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">{t('pass.title')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg max-w-2xl mx-auto">{t('pass.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl overflow-hidden">
              <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 rounded-2xl overflow-hidden shadow-inner">
                  {passwords.length <= 1 ? (
                    <>
                      <div className="p-6 min-h-[120px] flex items-center justify-center">
                        <p className="text-xl sm:text-2xl md:text-3xl font-mono text-center text-gray-800 dark:text-gray-200 tracking-wider break-all select-all">
                          {showPasswords ? password : '•'.repeat(password.length)}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 p-3 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all"
                        >
                          {showPasswords ? <><EyeOff className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Hide</span></> : <><Eye className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Show</span></>}
                        </button>
                        <button
                          onClick={() => setShowQr(password)}
                          className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all"
                        >
                          <QrCode className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">QR Code</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(password)}
                          className="flex-[2] sm:flex-none flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm"
                        >
                          {copied === -1 ? <><Check className="w-4 h-4 mr-2" /> {t('json.copied')}</> : <><Copy className="w-4 h-4 mr-2" /> {t('json.copy')}</>}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col">
                      <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                        {passwords.map((p, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-green-50 dark:bg-green-900/30 transition-all gap-3">
                            <code className="text-lg font-mono text-gray-700 dark:text-gray-300 break-all">
                              {showPasswords ? p : '•'.repeat(p.length)}
                            </code>
                            <div className="flex items-center space-x-2 self-end sm:self-auto sm:ml-4 shrink-0">
                              <button onClick={() => setShowQr(p)} className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:border-transparent sm:bg-transparent shadow-sm sm:shadow-none">
                                <QrCode className="w-5 h-5" />
                              </button>
                              <button onClick={() => copyToClipboard(p, i)} className="p-2 text-gray-400 hover:text-green-600 rounded-lg transition-all bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:border-transparent sm:bg-transparent shadow-sm sm:shadow-none">
                                {copied === i ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 p-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-xl transition-all"
                        >
                          {showPasswords ? <><EyeOff className="w-4 h-4 mr-2" /> Hide All</> : <><Eye className="w-4 h-4 mr-2" /> Show All</>}
                        </button>
                        <button
                          onClick={copyAllToClipboard}
                          className="w-full sm:w-auto flex items-center justify-center px-6 py-2 text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 rounded-xl transition-all"
                        >
                          {copiedAll ? <><CheckCheck className="w-4 h-4 mr-2" /> {t('pass.copiedAll')}</> : <><Copy className="w-4 h-4 mr-2" /> {t('pass.copyAll')}</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center justify-between sm:justify-start sm:space-x-3">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('pass.strength')}</span>
                    <span className={`text-lg font-black ${strength.text}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-gray-400 uppercase block">{t('pass.entropy')}</span>
                      <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">{entropy} {t('pass.bits')}</span>
                    </div>
                    <div className="flex space-x-1 h-3 w-24 sm:w-32 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className={`h-full ${strength.color} transition-all duration-500 ease-out`} style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-8">
                <div className="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-2xl">
                  <button
                    onClick={() => { setMode('random'); setPreviousPassword(null); }}
                    className={`flex-1 flex items-center justify-center py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold transition-all text-sm md:text-base ${mode === 'random' ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
                  >
                    <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Random
                  </button>
                  <button
                    onClick={() => { setMode('passphrase'); setPreviousPassword(null); }}
                    className={`flex-1 flex items-center justify-center py-2 md:py-3 px-2 md:px-4 rounded-xl font-bold transition-all text-sm md:text-base ${mode === 'passphrase' ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
                  >
                    <Book className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> {t('pass.passphrase')}
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('pass.length')}</label>
                    <span className="text-2xl font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-4 py-1 rounded-2xl border-2 border-green-100">{length}</span>
                  </div>
                  <input
                    type="range"
                    min={mode === 'passphrase' ? "10" : "6"}
                    max="64"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-xl appearance-none cursor-pointer accent-green-600 border border-gray-200 dark:border-gray-700"
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
                        { id: 'amb', label: t('pass.excludeAmbiguous'), state: excludeAmbiguous, setter: setExcludeAmbiguous, full: true },
                      ].map((opt) => (
                        <label key={opt.id} className={`flex items-center p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${opt.state ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-100 hover:border-gray-200 dark:border-gray-700'} ${opt.full ? 'sm:col-span-2' : ''}`}>
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center mr-3 transition-all ${opt.state ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                            {opt.state && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            checked={opt.state}
                            onChange={(e) => opt.setter(e.target.checked)}
                            className="hidden"
                          />
                          <span className={`font-bold text-sm md:text-base ${opt.state ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{opt.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                        <Settings2 className="w-4 h-4 mr-2" /> {t('pass.advancedRules')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { id: 'startLetter', label: t('pass.startWithLetter'), state: strictStartWithLetter, setter: setStrictStartWithLetter },
                          { id: 'noSeq', label: t('pass.noSequential'), state: strictNoSequential, setter: setStrictNoSequential },
                        ].map((opt) => (
                          <label key={opt.id} className={`flex items-center p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${opt.state ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-100 hover:border-gray-200 dark:border-gray-700'}`}>
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center mr-3 transition-all ${opt.state ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                              {opt.state && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                            </div>
                            <input type="checkbox" checked={opt.state} onChange={(e) => opt.setter(e.target.checked)} className="hidden" />
                            <span className={`font-bold text-sm md:text-base ${opt.state ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'passphrase' && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <Settings2 className="w-4 h-4 mr-2" /> {t('pass.passphraseSettings')}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-center p-3 md:p-4 rounded-2xl border-2 border-gray-100 bg-white dark:bg-gray-800">
                        <span className="font-bold text-sm md:text-base text-gray-500 dark:text-gray-400 mr-auto">{t('pass.separator')}</span>
                        <select
                          value={passphraseSeparator}
                          onChange={(e) => setPassphraseSeparator(e.target.value)}
                          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
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
                        <label key={opt.id} className={`flex items-center p-3 md:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${opt.state ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : 'border-gray-100 hover:border-gray-200 dark:border-gray-700'}`}>
                          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg border-2 flex items-center justify-center mr-3 transition-all ${opt.state ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                            {opt.state && <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                          </div>
                          <input type="checkbox" checked={opt.state} onChange={(e) => opt.setter(e.target.checked)} className="hidden" />
                          <span className={`font-bold text-sm md:text-base ${opt.state ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{t('pass.bulk')}</span>
                    </div>
                    <select 
                      value={bulkCount}
                      onChange={(e) => setBulkCount(parseInt(e.target.value))}
                      className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 rounded-xl px-4 py-2 font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:border-green-500"
                    >
                      {[1, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={generatePasswords}
                    className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-black py-5 px-8 rounded-2xl transition-all flex items-center justify-center text-xl shadow-lg shadow-green-200 active:scale-[0.98]"
                  >
                    <RefreshCw className="mr-3 h-6 w-6" /> {t('pass.generateBtn')}
                  </button>
                  {previousPassword && (
                    <button
                      onClick={restorePrevious}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-400 font-bold py-5 px-6 rounded-2xl transition-all flex items-center justify-center text-base border-2 border-gray-200 dark:border-gray-700 active:scale-[0.98]"
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
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-lg p-6">
              <h3 className="font-black text-gray-900 dark:text-gray-100 flex items-center uppercase tracking-widest text-sm mb-6">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                {t('pass.securityTips')}
              </h3>
              <div className="space-y-4">
                {[t('pass.tip1'), t('pass.tip2'), t('pass.tip3'), t('pass.tip4')].map((tip, i) => (
                  <div key={i} className="flex items-start p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100">
                    <div className="bg-green-100 text-green-600 p-1 rounded-md mr-3 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight font-medium">{tip}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-normal">
                  {t('pass.help.2')}
                </p>
              </div>
            </div>

            <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl shadow-green-100 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white dark:bg-gray-800/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="text-xl font-black mb-4 flex items-center">
                <Info className="h-6 w-6 mr-2" />
                {t('pass.help.title')}
              </h3>
              <ul className="space-y-4 text-green-50 text-sm leading-relaxed">
                <li className="flex items-start">
                  <span className="bg-white dark:bg-gray-800/20 rounded-lg p-1 mr-3 mt-0.5 font-bold text-xs">01</span>
                  {t('pass.help.1')}
                </li>
                <li className="flex items-start">
                  <span className="bg-white dark:bg-gray-800/20 rounded-lg p-1 mr-3 mt-0.5 font-bold text-xs">02</span>
                  {t('pass.help.3')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('pass.longDesc.title')}</h2>
          <div className="prose prose-green max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('pass.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('pass.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('pass.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-gray-100">{t('pass.qrCode')}</h3>
              <button onClick={() => setShowQr(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 border-4 border-gray-50 rounded-2xl flex justify-center mb-6">
              <QRCodeSVG value={showQr} size={200} level="H" includeMargin={true} />
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 mb-6">
              <code className="text-sm font-mono text-gray-600 dark:text-gray-400 break-all block text-center">{showQr}</code>
            </div>
            <button
              onClick={() => {
                copyToClipboard(showQr);
                setShowQr(null);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center"
            >
              <Copy className="w-5 h-5 mr-2" /> {t('json.copy')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
