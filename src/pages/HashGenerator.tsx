import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, Copy, Check, FileText, Upload, Lock } from 'lucide-react';
import { SEO } from '../components/SEO';
import CryptoJS from 'crypto-js';

type HashMode = 'text' | 'file';
type Encoding = 'hex' | 'base64';

export function HashGenerator() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<HashMode>('text');
  const [input, setInput] = useState('');
  const [useHmac, setUseHmac] = useState(false);
  const [hmacKey, setHmacKey] = useState('');
  const [encoding, setEncoding] = useState<Encoding>('hex');
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHashing, setIsHashing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: '',
    sha3: '',
    ripemd160: ''
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const calculateTextHashes = useCallback(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '', sha3: '', ripemd160: '' });
      return;
    }

    const formatOutput = (wordArray: CryptoJS.lib.WordArray) => {
      return encoding === 'hex' 
        ? CryptoJS.enc.Hex.stringify(wordArray) 
        : CryptoJS.enc.Base64.stringify(wordArray);
    };

    try {
      if (useHmac && hmacKey) {
        setHashes({
          md5: formatOutput(CryptoJS.HmacMD5(input, hmacKey)),
          sha1: formatOutput(CryptoJS.HmacSHA1(input, hmacKey)),
          sha256: formatOutput(CryptoJS.HmacSHA256(input, hmacKey)),
          sha512: formatOutput(CryptoJS.HmacSHA512(input, hmacKey)),
          sha3: formatOutput(CryptoJS.HmacSHA3(input, hmacKey)),
          ripemd160: formatOutput(CryptoJS.HmacRIPEMD160(input, hmacKey))
        });
      } else {
        setHashes({
          md5: formatOutput(CryptoJS.MD5(input)),
          sha1: formatOutput(CryptoJS.SHA1(input)),
          sha256: formatOutput(CryptoJS.SHA256(input)),
          sha512: formatOutput(CryptoJS.SHA512(input)),
          sha3: formatOutput(CryptoJS.SHA3(input)),
          ripemd160: formatOutput(CryptoJS.RIPEMD160(input))
        });
      }
    } catch (err) {
      console.error("Hashing error", err);
    }
  }, [input, useHmac, hmacKey, encoding]);

  useEffect(() => {
    if (mode === 'text') {
      calculateTextHashes();
    }
  }, [calculateTextHashes, mode]);

  const calculateFileHashes = async (selectedFile: File) => {
    setIsHashing(true);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer as any);
      
      const formatOutput = (wa: CryptoJS.lib.WordArray) => {
        return encoding === 'hex' 
          ? CryptoJS.enc.Hex.stringify(wa) 
          : CryptoJS.enc.Base64.stringify(wa);
      };

      if (useHmac && hmacKey) {
        setHashes({
          md5: formatOutput(CryptoJS.HmacMD5(wordArray, hmacKey)),
          sha1: formatOutput(CryptoJS.HmacSHA1(wordArray, hmacKey)),
          sha256: formatOutput(CryptoJS.HmacSHA256(wordArray, hmacKey)),
          sha512: formatOutput(CryptoJS.HmacSHA512(wordArray, hmacKey)),
          sha3: formatOutput(CryptoJS.HmacSHA3(wordArray, hmacKey)),
          ripemd160: formatOutput(CryptoJS.HmacRIPEMD160(wordArray, hmacKey))
        });
      } else {
        setHashes({
          md5: formatOutput(CryptoJS.MD5(wordArray)),
          sha1: formatOutput(CryptoJS.SHA1(wordArray)),
          sha256: formatOutput(CryptoJS.SHA256(wordArray)),
          sha512: formatOutput(CryptoJS.SHA512(wordArray)),
          sha3: formatOutput(CryptoJS.SHA3(wordArray)),
          ripemd160: formatOutput(CryptoJS.RIPEMD160(wordArray))
        });
      }
    } catch (err) {
      console.error("File hashing error", err);
      alert("Error hashing file. File might be too large.");
    } finally {
      setIsHashing(false);
    }
  };

  useEffect(() => {
    if (mode === 'file' && file) {
      // Small delay to allow UI to update to "Hashing..." state
      setTimeout(() => calculateFileHashes(file), 50);
    } else if (mode === 'file' && !file) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '', sha3: '', ripemd160: '' });
    }
  }, [file, useHmac, hmacKey, encoding, mode]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        title={t('hash.seoTitle')}
        description={t('hash.desc')}
        url="/hash-generator"
      />

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-2xl mb-4">
            <Hash className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('hash.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('hash.desc')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setMode('text')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                mode === 'text' 
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('hash.modeText') || 'Text Hash'}
            </button>
            <button
              onClick={() => setMode('file')}
              className={`flex-1 py-4 px-6 text-sm font-medium text-center flex items-center justify-center transition-colors ${
                mode === 'file' 
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('hash.modeFile') || 'File Hash'}
            </button>
          </div>

          {/* Settings Bar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-6 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">{t('hash.encoding') || 'Encoding'}:</label>
              <select
                value={encoding}
                onChange={(e) => setEncoding(e.target.value as Encoding)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="hex">{t('hash.hex') || 'Hex'}</option>
                <option value="base64">{t('hash.base64') || 'Base64'}</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useHmac"
                checked={useHmac}
                onChange={(e) => setUseHmac(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="useHmac" className="text-sm font-medium text-gray-700 flex items-center">
                <Lock className="h-3.5 w-3.5 mr-1" />
                {t('hash.hmac') || 'HMAC'}
              </label>
            </div>

            {useHmac && (
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={hmacKey}
                  onChange={(e) => setHmacKey(e.target.value)}
                  placeholder={t('hash.hmacKey') || 'Secret Key'}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
          </div>

          <div className="p-6 border-b border-gray-200">
            {mode === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hash.inputLabel')}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono text-sm resize-y"
                  placeholder="Enter text to hash..."
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hash.fileSelect') || 'Select File'}
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className={`h-8 w-8 mb-2 ${isDragging ? 'text-red-500' : 'text-gray-400'}`} />
                  <p className="text-sm text-gray-600 font-medium">
                    {file ? file.name : (t('hash.fileDrop') || 'Click or drag & drop a file here')}
                  </p>
                  {file && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                  )}
                </div>
                {file && file.size > 50 * 1024 * 1024 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Warning: Hashing large files (&gt;50MB) in the browser may cause performance issues.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="p-6 space-y-6 bg-gray-50 relative">
            {isHashing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mb-2"></div>
                  <p className="text-sm font-medium text-gray-700">{t('hash.hashing') || 'Hashing...'}</p>
                </div>
              </div>
            )}
            
            <h3 className="text-lg font-medium text-gray-900">{t('hash.outputLabel')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'MD5', key: 'md5', value: hashes.md5 },
                { label: 'SHA-1', key: 'sha1', value: hashes.sha1 },
                { label: 'SHA-256', key: 'sha256', value: hashes.sha256 },
                { label: 'SHA-512', key: 'sha512', value: hashes.sha512 },
                { label: 'SHA-3', key: 'sha3', value: hashes.sha3 },
                { label: 'RIPEMD-160', key: 'ripemd160', value: hashes.ripemd160 },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-gray-700">
                      {item.label}
                    </label>
                    <button
                      onClick={() => copyToClipboard(item.value, item.key)}
                      disabled={!item.value}
                      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {copiedKey === item.key ? (
                        <><Check className="h-4 w-4 mr-1" /> {t('hash.copied')}</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-1" /> {t('hash.copy')}</>
                      )}
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 font-mono text-sm break-all text-gray-800 min-h-[3.5rem] flex items-center shadow-sm">
                    {item.value || <span className="text-gray-400 italic">Waiting for input...</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('hash.longDesc.title')}</h2>
          <div className="prose prose-red max-w-none text-gray-600">
            <p dangerouslySetInnerHTML={{ __html: t('hash.longDesc.p1') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('hash.longDesc.p2') }}></p>
            <p dangerouslySetInnerHTML={{ __html: t('hash.longDesc.p3') }}></p>
            
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">{t('hash.help.title')}</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>{t('hash.help.1')}</li>
              <li>{t('hash.help.2')}</li>
              <li>{t('hash.help.3')}</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
