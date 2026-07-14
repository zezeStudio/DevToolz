import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, Settings2, Trash2, ArrowRight, Info, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function ImageCompressor() {
  const { t, i18n } = useTranslation();
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
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{t('imageCompressor.title')}</h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">{t('imageCompressor.desc')}</p>
      </div>

      {!originalFile && (
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer mb-8 ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
              : 'border-slate-300 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
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
            className="hidden bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]" 
          />
          <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <Upload className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('imageCompressor.upload')}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t('imageCompressor.dropzone')}</p>
        </div>
      )}
      
      <div className={`space-y-6 transition-all duration-300 ${!originalFile ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
          {/* Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300">
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
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-emerald-600 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span>Smaller File</span>
                  <span>Better Quality</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleClear}
                  className="flex items-center justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.clear') || 'Clear'}
                </button>
                <a
                  href={compressedUrl || '#'}
                  download={originalFile ? `compressed_${originalFile.name.replace(/\.[^/.]+$/, "")}.jpg` : 'compressed_image.jpg'}
                  className="flex items-center justify-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('imageCompressor.download')}
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">{t('imageCompressor.original')} {t('imageCompressor.size')}</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{formatBytes(originalSize)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">{t('imageCompressor.compressed')} {t('imageCompressor.size')}</p>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(compressedSize)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">{t('imageCompressor.reduction')}</p>
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
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 text-center">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('imageCompressor.original')}</span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlN2ViIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU3ZWIiPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzNzQxNTEiPjwvcmVjdD4KPC9zdmc+')]">
                {originalUrl ? (
                  <img src={originalUrl} alt="Original" className="max-w-full max-h-[400px] object-contain shadow-md" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full opacity-20">
                    <ImageIcon className="w-12 h-12 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
              <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 text-center">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t('imageCompressor.compressed')}</span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZTVlN2ViIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNlNWU3ZWIiPjwvcmVjdD4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMzc0MTUxIj48L3JlY3Q+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMzNzQxNTEiPjwvcmVjdD4KPC9zdmc+')]">
                {compressedUrl ? (
                  <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-[400px] object-contain shadow-md" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    {originalFile ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    ) : (
                      <div className="opacity-20"><ImageIcon className="w-12 h-12 text-slate-500 dark:text-slate-400" /></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Help Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mt-8">
        <div className="flex items-center mb-4">
          <Info className="h-5 w-5 text-slate-500 mr-2" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t('imageCompressor.help.title')}</h2>
        </div>
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
            {t('imageCompressor.help.1')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
            {t('imageCompressor.help.2')}
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-5 h-5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
            {t('imageCompressor.help.3')}
          </li>
        </ul>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 md:p-6 text-sm text-blue-800 dark:text-blue-300">
        <h3 className="font-bold flex items-center mb-2">
          <Info className="h-5 w-5 mr-2" />
          Tip & Disclaimer
        </h3>
        <p className="mb-2">
          {t('imageCompressor.disclaimer')}
        </p>
      </div>

      {/* Long Description for SEO */}
      <div className="prose dark:prose-invert max-w-none mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4">{t('imageCompressor.longDesc.title')}</h2>
        <p>{t('imageCompressor.longDesc.p1')}</p>
        <p>{t('imageCompressor.longDesc.p2')}</p>
        <p>{t('imageCompressor.longDesc.p3')}</p>
          <p className="mt-4 leading-relaxed">{t('imageCompressor.longDesc.p4')}</p>
          <p className="mt-4 leading-relaxed">{t('imageCompressor.longDesc.p5')}</p>
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
                Image Compressor 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Image Compressor 도구는 compress and optimize images 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Image Compressor 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Image Compressor의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Image Compressor 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Image Compressor ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Image Compressor ツールは、compress and optimize images するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Image Compressor を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Image Compressor のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Image Compressor ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Image Compressor tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Image Compressor is a specialized utility designed to compress and optimize images. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Image Compressor?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Image Compressor happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Image Compressor is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 compress and optimize images 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に compress and optimize images したい場合に非常に便利です。
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
                When you are working on a project and need to quickly compress and optimize images without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to compress and optimize images.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how compress processes work visually.
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