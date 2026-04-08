import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Key, Copy, Check, RefreshCw, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') {
      setPassword('');
      return;
    }

    let generatedPassword = '';
    
    const getRandomInt = (max: number) => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    };

    // Ensure at least one of each selected type is included
    if (includeUppercase) generatedPassword += uppercase[getRandomInt(uppercase.length)];
    if (includeLowercase) generatedPassword += lowercase[getRandomInt(lowercase.length)];
    if (includeNumbers) generatedPassword += numbers[getRandomInt(numbers.length)];
    if (includeSymbols) generatedPassword += symbols[getRandomInt(symbols.length)];

    // Fill the rest
    for (let i = generatedPassword.length; i < length; i++) {
      const randomIndex = getRandomInt(chars.length);
      generatedPassword += chars[randomIndex];
    }

    // Shuffle the password securely
    const passwordArray = generatedPassword.split('');
    for (let i = passwordArray.length - 1; i > 0; i--) {
      const j = getRandomInt(i + 1);
      [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    generatedPassword = passwordArray.join('');
    
    setPassword(generatedPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const calculateStrength = () => {
    let score = 0;
    if (length > 8) score += 1;
    if (length > 12) score += 1;
    if (length >= 16) score += 1;
    if (includeUppercase && includeLowercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;

    if (score < 3) return { label: t('pass.weak'), color: 'bg-red-500' };
    if (score < 5) return { label: t('pass.good'), color: 'bg-yellow-500' };
    return { label: t('pass.strong'), color: 'bg-green-500' };
  };

  const strength = calculateStrength();

  return (
    <>
      <SEO 
        title={`${t('pass.title')} - DevToolz`}
        description={t('pass.desc')}
        url="/password-generator"
        schema={[
          {
            "@type": "SoftwareApplication",
            "name": t('pass.title'),
            "description": t('pass.desc'),
            "applicationCategory": "SecurityApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "HowTo",
            "name": t('pass.help.title'),
            "step": [
              { "@type": "HowToStep", "text": t('pass.help.1') },
              { "@type": "HowToStep", "text": t('pass.help.2') },
              { "@type": "HowToStep", "text": t('pass.help.3') }
            ]
          }
        ]}
      />

      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
            <Key className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t('pass.title')}</h1>
          <p className="text-gray-500 mt-2">{t('pass.desc')}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Password Display */}
          <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                value={password}
                readOnly
                className="w-full text-2xl md:text-3xl font-mono text-center py-4 px-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 tracking-wider"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-6 w-6 text-green-600" /> : <Copy className="h-6 w-6" />}
              </button>
            </div>
            
            {/* Strength Indicator */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{t('pass.strength')}</span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-bold ${strength.color.replace('bg-', 'text-')}`}>
                  {strength.label}
                </span>
                <div className="flex space-x-1 h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.label === t('pass.weak') ? '33%' : strength.label === t('pass.good') ? '66%' : '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="font-semibold text-gray-700">{t('pass.length')}</label>
                <span className="text-xl font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">{length}</span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900">{t('pass.uppercase')}</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900">{t('pass.lowercase')}</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900">{t('pass.numbers')}</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900">{t('pass.symbols')}</span>
              </label>
            </div>

            <button
              onClick={generatePassword}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center text-lg shadow-sm"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> {t('pass.generateBtn')}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('pass.help.title')}
          </h3>
          <ul className="space-y-2 text-green-800 text-sm list-disc list-inside">
            <li>{t('pass.help.1')}</li>
            <li>{t('pass.help.2')}</li>
            <li>{t('pass.help.3')}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
