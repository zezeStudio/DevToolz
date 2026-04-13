import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Settings2, Trash2, ArrowRight, Info } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function ImageCompressor() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setOriginalFile(file);
    setOriginalSize(file.size);
    
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
  };

  const compressImage = () => {
    if (!originalUrl || !canvasRef.current || !originalFile) return;

    const img = new Image();
    img.src = originalUrl;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Keep original dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // For PNGs with transparency, we want to keep them as PNG if quality is 100
      // Otherwise, we convert to WebP which handles transparency and compression much better than JPEG
      const isPng = originalFile.type === 'image/png';
      
      if (isPng) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        // Fill with white background for JPEGs just in case
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Use better interpolation for drawing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Use WebP for better quality/size ratio, fallback to JPEG if not supported
      // If it's a PNG and quality is 100, keep it as PNG
      let mimeType = 'image/webp';
      if (isPng && quality === 100) {
        mimeType = 'image/png';
      } else if (originalFile.type === 'image/jpeg') {
        // If original is JPEG, keep it as JPEG or WebP
        mimeType = 'image/jpeg';
      }

      // Convert quality from 1-100 to 0.0-1.0
      // We removed the artificial quality floor so 1% truly means maximum compression
      const actualQuality = quality / 100;
      
      const dataUrl = canvas.toDataURL(mimeType, actualQuality);
      
      setCompressedUrl(dataUrl);
      
      // Calculate compressed size
      const base64str = dataUrl.split(',')[1];
      const decoded = atob(base64str);
      setCompressedSize(decoded.length);
    };
  };

  useEffect(() => {
    if (originalUrl) {
      compressImage();
    }
  }, [originalUrl, quality]);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const reductionPercentage = originalSize > 0 
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <SEO 
        title={t('imageCompressor.seoTitle')}
        description={t('imageCompressor.desc')}
        url={`/${currentLang}/image-compressor`}
      />

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('imageCompressor.title')}</h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">{t('imageCompressor.desc')}</p>
      </div>

      {!originalFile ? (
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('imageCompressor.upload')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('imageCompressor.dropzone')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Settings2 className="w-4 h-4 mr-2" />
                    {t('imageCompressor.quality')}: {quality}%
                  </label>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={quality} 
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>Smaller File</span>
                  <span>Better Quality</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.clear') || 'Clear'}
                </button>
                <a
                  href={compressedUrl}
                  download={`compressed_${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg`}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('imageCompressor.download')}
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">{t('imageCompressor.original')} {t('imageCompressor.size')}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatBytes(originalSize)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">{t('imageCompressor.compressed')} {t('imageCompressor.size')}</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatBytes(compressedSize)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">{t('imageCompressor.reduction')}</p>
                <p className={`text-xl font-bold ${reductionPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {reductionPercentage > 0 ? '-' : '+'}{Math.abs(reductionPercentage)}%
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reductionPercentage > 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <ArrowRight className={`w-5 h-5 ${reductionPercentage > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 text-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('imageCompressor.original')}</span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlN2ViIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU3ZWIiPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzNzQxNTEiPjwvcmVjdD4KPC9zdmc+')]">
                {originalUrl ? (
                  <img src={originalUrl} alt="Original" className="max-w-full max-h-[400px] object-contain shadow-md" referrerPolicy="no-referrer" />
                ) : null}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 text-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('imageCompressor.compressed')}</span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlN2ViIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU3ZWIiPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzNzQxNTEiPjwvcmVjdD4KPC9zdmc+')]">
                {compressedUrl ? (
                  <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-[400px] object-contain shadow-md" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 mt-8">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100">{t('imageCompressor.help.title')}</h2>
        </div>
        <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            {t('imageCompressor.help.1')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            {t('imageCompressor.help.2')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            {t('imageCompressor.help.3')}
          </li>
        </ul>
      </div>

      {/* Long Description for SEO */}
      <div className="prose dark:prose-invert max-w-none mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-4">{t('imageCompressor.longDesc.title')}</h2>
        <p>{t('imageCompressor.longDesc.p1')}</p>
        <p>{t('imageCompressor.longDesc.p2')}</p>
        <p>{t('imageCompressor.longDesc.p3')}</p>
      </div>
    </div>
  );
}
