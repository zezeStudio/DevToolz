import React, { useState, useEffect, useCallback } from 'react';
import { SEO } from '../components/SEO';
import { Info, Palette, Copy, Check, RefreshCw, Pipette, Type, Wand2, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { colord, extend, AnyColor } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import cmykPlugin from 'colord/plugins/cmyk';
import namesPlugin from 'colord/plugins/names';
import a11yPlugin from 'colord/plugins/a11y';

extend([harmoniesPlugin, cmykPlugin, namesPlugin, a11yPlugin]);

const TAILWIND_COLORS: Record<string, string> = {
  'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-300': '#cbd5e1', 'slate-500': '#64748b', 'slate-700': '#334155', 'slate-900': '#0f172a',
  'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-300': '#d1d5db', 'gray-500': '#6b7280', 'gray-700': '#374151', 'gray-900': '#111827',
  'zinc-50': '#fafafa', 'zinc-100': '#f4f4f5', 'zinc-300': '#d4d4d8', 'zinc-500': '#71717a', 'zinc-700': '#3f3f46', 'zinc-900': '#18181b',
  'neutral-50': '#fafafa', 'neutral-100': '#f5f5f5', 'neutral-300': '#d4d4d4', 'neutral-500': '#737373', 'neutral-700': '#404040', 'neutral-900': '#171717',
  'stone-50': '#fafaf9', 'stone-100': '#f5f5f4', 'stone-300': '#d6d3d1', 'stone-500': '#78716c', 'stone-700': '#44403c', 'stone-900': '#1c1917',
  'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-300': '#fca5a5', 'red-500': '#ef4444', 'red-700': '#b91c1c', 'red-900': '#7f1d1d',
  'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-300': '#fdba74', 'orange-500': '#f97316', 'orange-700': '#c2410c', 'orange-900': '#7c2d12',
  'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-300': '#fcd34d', 'amber-500': '#f59e0b', 'amber-700': '#b45309', 'amber-900': '#78350f',
  'yellow-50': '#fefce8', 'yellow-100': '#fef9c3', 'yellow-300': '#fde047', 'yellow-500': '#eab308', 'yellow-700': '#a16207', 'yellow-900': '#713f12',
  'lime-50': '#f7fee7', 'lime-100': '#ecfccb', 'lime-300': '#bef264', 'lime-500': '#84cc16', 'lime-700': '#4d7c0f', 'lime-900': '#365314',
  'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-300': '#86efac', 'green-500': '#22c55e', 'green-700': '#15803d', 'green-900': '#14532d',
  'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-300': '#6ee7b7', 'emerald-500': '#10b981', 'emerald-700': '#047857', 'emerald-900': '#064e3b',
  'teal-50': '#f0fdfa', 'teal-100': '#ccfbf1', 'teal-300': '#5eead4', 'teal-500': '#14b8a6', 'teal-700': '#0f766e', 'teal-900': '#134e4a',
  'cyan-50': '#ecfeff', 'cyan-100': '#cffafe', 'cyan-300': '#67e8f9', 'cyan-500': '#06b6d4', 'cyan-700': '#0369a1', 'cyan-900': '#164e63',
  'sky-50': '#f0f9ff', 'sky-100': '#e0f2fe', 'sky-300': '#7dd3fc', 'sky-500': '#0ea5e9', 'sky-700': '#0369a1', 'sky-900': '#0c4a6e',
  'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-300': '#93c5fd', 'blue-500': '#3b82f6', 'blue-700': '#1d4ed8', 'blue-900': '#1e3a8a',
  'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-300': '#a5b4fc', 'indigo-500': '#6366f1', 'indigo-700': '#4338ca', 'indigo-900': '#312e81',
  'violet-50': '#f5f3ff', 'violet-100': '#ede9fe', 'violet-300': '#c4b5fd', 'violet-500': '#8b5cf6', 'violet-700': '#6d28d9', 'violet-900': '#4c1d95',
  'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-300': '#d8b4fe', 'purple-500': '#a855f7', 'purple-700': '#7e22ce', 'purple-900': '#581c87',
  'fuchsia-50': '#fdf4ff', 'fuchsia-100': '#fae8ff', 'fuchsia-300': '#f0abfc', 'fuchsia-500': '#d946ef', 'fuchsia-700': '#a21caf', 'fuchsia-900': '#701a75',
  'pink-50': '#fdf2f8', 'pink-100': '#fce7f3', 'pink-300': '#f9a8d4', 'pink-500': '#ec4899', 'pink-700': '#be185d', 'pink-900': '#831843',
  'rose-50': '#fff1f2', 'rose-100': '#ffe4e6', 'rose-300': '#fda4af', 'rose-500': '#f43f5e', 'rose-700': '#be123c', 'rose-900': '#881337',
};

export function ColorConverter() {
  const { t } = useTranslation();
  const [color, setColor] = useState(colord('#3b82f6'));
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);
  const [showContrastInfo, setShowContrastInfo] = useState(false);

  useEffect(() => {
    setIsEyeDropperSupported('EyeDropper' in window);
  }, []);

  // Input states
  const [hexInput, setHexInput] = useState(color.toHex());
  const [rgbInput, setRgbInput] = useState(color.toRgbString());
  const [hslInput, setHslInput] = useState(color.toHslString());
  const [cmykInput, setCmykInput] = useState(color.toCmykString());
  const [alpha, setAlpha] = useState(color.alpha());

  // Sync inputs when color state changes
  useEffect(() => {
    setHexInput(color.toHex());
    setRgbInput(color.toRgbString());
    setHslInput(color.toHslString());
    setCmykInput(color.toCmykString());
    setAlpha(color.alpha());
  }, [color]);

  const handleColorChange = (newColorStr: AnyColor) => {
    const newColor = colord(newColorStr);
    if (newColor.isValid()) {
      setColor(newColor);
    }
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = parseFloat(e.target.value);
    setColor(color.alpha(newAlpha));
  };

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor(colord(randomHex));
  };

  const openEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        handleColorChange(result.sRGBHex);
      } catch (e) {
        console.log('EyeDropper canceled or failed');
      }
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const getClosestTailwindColor = () => {
    let closestName = '';
    let minDelta = Infinity;
    
    const rgb1 = color.toRgb();

    Object.entries(TAILWIND_COLORS).forEach(([name, hex]) => {
      const rgb2 = colord(hex).toRgb();
      // Calculate Euclidean distance in RGB space
      const delta = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) + 
        Math.pow(rgb1.g - rgb2.g, 2) + 
        Math.pow(rgb1.b - rgb2.b, 2)
      );

      if (delta < minDelta) {
        minDelta = delta;
        closestName = name;
      }
    });
    
    return { name: closestName, hex: TAILWIND_COLORS[closestName] };
  };

  const closestTw = getClosestTailwindColor();
  
  // Calculate effective background color (blended over white background)
  const rgb = color.toRgb();
  const a = color.alpha();
  const effectiveBg = colord({
    r: Math.round(rgb.r * a + 255 * (1 - a)),
    g: Math.round(rgb.g * a + 255 * (1 - a)),
    b: Math.round(rgb.b * a + 255 * (1 - a)),
    a: 1
  });

  const contrastWhite = effectiveBg.contrast('#ffffff');
  const contrastBlack = effectiveBg.contrast('#000000');

  const renderHarmony = (title: string, colors: ReturnType<typeof colord>[]) => (
    <div className="mb-6">
      <h4 className="text-sm font-bold text-gray-700 mb-3">{title}</h4>
      <div className="flex space-x-2">
        {colors.map((c, i) => {
          const hex = c.toHex();
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full h-16 rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: hex }}
                onClick={() => setColor(c)}
                title="Click to use this color"
              />
              <span className="text-xs font-mono text-gray-500 mt-2 uppercase">{hex}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <SEO 
        title={`${t('color.title')} - DevToolz`}
        description={t('color.desc')}
        url="/color-converter"
      />

      <div className="max-w-5xl mx-auto h-full flex flex-col px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Palette className="mr-3 h-8 w-8 text-pink-500" />
            {t('color.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('color.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Preview & Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Color Preview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">{t('color.preview')}</h3>
                <div className="flex space-x-2">
                  {isEyeDropperSupported && (
                    <button 
                      onClick={openEyeDropper}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                    >
                      <Pipette className="w-4 h-4 mr-1" /> {t('color.eyedropper')}
                    </button>
                  )}
                  <button 
                    onClick={generateRandomColor}
                    className="text-sm text-pink-600 hover:text-pink-700 flex items-center hover:bg-pink-50 px-2 py-1 rounded transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" /> {t('color.random')}
                  </button>
                </div>
              </div>
              
              {/* Checkerboard background for transparency */}
              <div className="w-full h-48 rounded-xl shadow-inner overflow-hidden relative" style={{
                backgroundImage: 'conic-gradient(#e5e7eb 90deg, #f9fafb 90deg 180deg, #e5e7eb 180deg 270deg, #f9fafb 270deg)',
                backgroundSize: '20px 20px'
              }}>
                <div 
                  className="absolute inset-0 transition-colors duration-200"
                  style={{ backgroundColor: color.toRgbString() }}
                />
              </div>

              {/* Opacity Slider */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{t('color.opacity')}</span>
                  <span className="font-mono text-gray-500">{Math.round(alpha * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1" step="0.01" 
                  value={alpha} 
                  onChange={handleAlphaChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              {/* HEX */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700">HEX</label>
                  <button onClick={() => copyToClipboard(color.toHex(), 'hex')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center">
                    {copiedStates['hex'] ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedStates['hex'] ? t('color.copied') : t('color.copy')}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={hexInput}
                  onChange={(e) => {
                    setHexInput(e.target.value);
                    handleColorChange(e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>

              {/* RGB */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700">RGB</label>
                  <button onClick={() => copyToClipboard(color.toRgbString(), 'rgb')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center">
                    {copiedStates['rgb'] ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedStates['rgb'] ? t('color.copied') : t('color.copy')}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={rgbInput}
                  onChange={(e) => {
                    setRgbInput(e.target.value);
                    handleColorChange(e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>

              {/* HSL */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700">HSL</label>
                  <button onClick={() => copyToClipboard(color.toHslString(), 'hsl')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center">
                    {copiedStates['hsl'] ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedStates['hsl'] ? t('color.copied') : t('color.copy')}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={hslInput}
                  onChange={(e) => {
                    setHslInput(e.target.value);
                    handleColorChange(e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>

              {/* CMYK */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-bold text-gray-700">CMYK</label>
                  <button onClick={() => copyToClipboard(color.toCmykString(), 'cmyk')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center">
                    {copiedStates['cmyk'] ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedStates['cmyk'] ? t('color.copied') : t('color.copy')}
                  </button>
                </div>
                <input 
                  type="text" 
                  value={cmykInput}
                  onChange={(e) => {
                    setCmykInput(e.target.value);
                    handleColorChange(e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Harmonies & Pro Features */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pro Features: Contrast & Tailwind */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WCAG Contrast Checker */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center">
                    <Type className="w-5 h-5 mr-2 text-pink-500" />
                    {t('color.contrast.title')}
                  </h3>
                  <button 
                    onClick={() => setShowContrastInfo(!showContrastInfo)}
                    className={`p-1.5 rounded-full transition-colors ${showContrastInfo ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                    title="What do these scores mean?"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                {showContrastInfo && (
                  <div className="mb-4 p-4 bg-blue-50/80 border border-blue-100 rounded-xl text-sm text-blue-900 animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold mb-2 flex items-center">
                      <Info className="w-4 h-4 mr-1.5 text-blue-600" />
                      {t('color.contrast.helpTitle')}
                    </p>
                    <ul className="space-y-2 text-xs leading-relaxed">
                      <li><strong className="text-blue-700">AA Normal:</strong> {t('color.contrast.helpNormal')}</li>
                      <li><strong className="text-blue-700">AA Large:</strong> {t('color.contrast.helpLarge')}</li>
                      <li><strong className="text-blue-700">AAA:</strong> {t('color.contrast.helpAAA')}</li>
                    </ul>
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  {/* White Text Card */}
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 p-4">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'conic-gradient(#e5e7eb 90deg, #ffffff 90deg 180deg, #e5e7eb 180deg 270deg, #ffffff 270deg)',
                      backgroundSize: '10px 10px'
                    }} />
                    <div className="absolute inset-0" style={{ backgroundColor: color.toRgbString() }} />
                    
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg block drop-shadow-md" style={{ color: '#ffffff' }}>{t('color.contrast.white')}</span>
                        <span className="text-sm font-mono font-medium drop-shadow-md" style={{ color: '#ffffff' }}>{contrastWhite.toFixed(2)}:1</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-center shadow-sm ${contrastWhite >= 4.5 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>AA Normal</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-center shadow-sm ${contrastWhite >= 3.0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>AA Large</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-center shadow-sm ${contrastWhite >= 7.0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>AAA</span>
                      </div>
                    </div>
                  </div>

                  {/* Black Text Card */}
                  <div className="relative overflow-hidden rounded-xl border border-gray-200 p-4">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'conic-gradient(#e5e7eb 90deg, #ffffff 90deg 180deg, #e5e7eb 180deg 270deg, #ffffff 270deg)',
                      backgroundSize: '10px 10px'
                    }} />
                    <div className="absolute inset-0" style={{ backgroundColor: color.toRgbString() }} />
                    
                    <div className="relative z-10 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-lg block drop-shadow-md" style={{ color: '#000000' }}>{t('color.contrast.black')}</span>
                        <span className="text-sm font-mono font-medium drop-shadow-md" style={{ color: '#000000' }}>{contrastBlack.toFixed(2)}:1</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-center shadow-sm ${contrastBlack >= 4.5 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>AA Normal</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-center shadow-sm ${contrastBlack >= 3.0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>AA Large</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-center shadow-sm ${contrastBlack >= 7.0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>AAA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Closest Tailwind Color */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Wand2 className="w-5 h-5 mr-2 text-pink-500" />
                  {t('color.tailwind.title')}
                </h3>
                <div 
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleColorChange(closestTw.hex)}
                  title="Click to use this color"
                >
                  <div className="w-full h-12 rounded-lg shadow-inner mb-3" style={{ backgroundColor: closestTw.hex }} />
                  <div className="flex justify-between w-full items-center">
                    <span className="font-bold text-gray-700">{closestTw.name}</span>
                    <span className="text-xs font-mono text-gray-500 uppercase">{closestTw.hex}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Harmonies */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center">
                <Palette className="w-5 h-5 mr-2 text-pink-500" />
                {t('color.harmonies')}
              </h3>
              
              {renderHarmony(t('color.complementary'), color.harmonies('complementary'))}
              {renderHarmony(t('color.analogous'), color.harmonies('analogous'))}
              {renderHarmony(t('color.triadic'), color.harmonies('triadic'))}
              {renderHarmony(t('color.tetradic'), color.harmonies('tetradic'))}
              
              {/* CSS Variables Output */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-gray-700">CSS Variables</h4>
                  <button onClick={() => copyToClipboard(`--color-primary: ${color.toHex()};\n--color-primary-rgb: ${color.toRgb().r}, ${color.toRgb().g}, ${color.toRgb().b};\n--color-primary-hsl: ${color.toHsl().h}, ${color.toHsl().s}%, ${color.toHsl().l}%;`, 'css')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center">
                    {copiedStates['css'] ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedStates['css'] ? t('color.copied') : t('color.copy')}
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded-xl font-mono text-sm text-gray-600 border border-gray-200 overflow-x-auto">
{`--color-primary: ${color.toHex()};
--color-primary-rgb: ${color.toRgb().r}, ${color.toRgb().g}, ${color.toRgb().b};
--color-primary-hsl: ${color.toHsl().h}, ${color.toHsl().s}%, ${color.toHsl().l}%;`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-pink-50 rounded-xl p-6 border border-pink-100">
          <h3 className="text-lg font-bold text-pink-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            {t('color.help.title')}
          </h3>
          <ul className="space-y-2 text-pink-800 text-sm list-disc list-inside">
            {[1, 2, 3, 4].map(num => (
              <li key={num}>{t(`color.help.${num}`)}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
