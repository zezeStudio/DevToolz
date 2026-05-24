import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Layers, Trash2, Wand2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function ChunkingSimulator() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [chunkSize, setChunkSize] = useState(200);
  const [overlap, setOverlap] = useState(50);
  const [mode, setMode] = useState<'char' | 'token'>('char');

  const handleSample = () => {
    setText('Vector space models are a key component of modern search and retrieval-augmented generation (RAG) systems. In RAG, documents are split into smaller segments called chunks. These chunks are embedded using embedding models, transforming them into high-dimensional numerical vectors.\n\nWhen a user queries the system, their question is also converted into a vector. The system then performs a cosine similarity search between the query vector and the document vectors. The top K most similar chunks are retrieved and provided as context to the Large Language Model (LLM).\n\nHowever, deciding the chunk size and overlap is an art. Too large, and the context might be diluted with irrelevant information. Too small, and the AI might lack the broader context needed to synthesize a coherent answer. Overlap is crucial because it prevents sentences or thoughts from being abruptly cut off precisely at the boundary of a chunk.');
    setMode('char');
    setChunkSize(150);
    setOverlap(30);
  };

  // Token is rough estimation (1 token approx 4 chars)
  const effectiveSize = mode === 'token' ? chunkSize * 4 : chunkSize;
  const effectiveOverlap = mode === 'token' ? overlap * 4 : overlap;

  const chunks = useMemo(() => {
    if (!text) return [];
    const results = [];
    let i = 0;
    while (i < text.length) {
      results.push(text.slice(i, i + effectiveSize));
      i += (effectiveSize - effectiveOverlap);
      if (effectiveSize <= effectiveOverlap) break; // prevents infinite loop
    }
    return results;
  }, [text, effectiveSize, effectiveOverlap]);

  const handleClear = () => {
    setText('');
  };

  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <div className="max-w-7xl mx-auto">
      <SEO 
        title={t('chunking.seoTitle') || 'Chunking Simulator | DevToolz'}
        description="Visualize RAG vector embedding chunking visually." 
        url={`/${currentLang}/chunking-simulator`}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <Layers className="mr-3 h-8 w-8 text-rose-600" />
          {t('nav.chunkingSimulator') || 'Chunking Simulator'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('chunking.subtitle') || 'Visualize how text is split into chunks for Vector Embeddings (RAG).'}
        </p>
        <button onClick={handleSample} className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 rounded-lg text-sm font-medium flex items-center transition-colors border border-rose-200 dark:border-rose-800/50 w-fit">
          <Wand2 className="w-4 h-4 mr-2" /> {t('common.sample') || 'Sample Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold mb-4 text-slate-800 dark:text-slate-200">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Unit</label>
                <select value={mode} onChange={e => setMode(e.target.value as any)} className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-900">
                  <option value="char">Characters</option>
                  <option value="token">Tokens (Approx, 1 = 4 chars)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Chunk Size</label>
                <input type="number" min="10" value={chunkSize} onChange={e => setChunkSize(parseInt(e.target.value) || 10)} className="w-full p-2 border border-slate-200 dark:border-white/[0.06] rounded dark:bg-black/20 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Overlap Size</label>
                <input type="number" min="0" value={overlap} onChange={e => setOverlap(parseInt(e.target.value) || 0)} className="w-full p-2 border border-slate-200 dark:border-white/[0.06] rounded dark:bg-black/20 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex-1">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Source Text</label>
              {text && (
                <button onClick={handleClear} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center">
                  <Trash2 className="w-3 h-3 mr-1" /> {t('common.clear') || 'Clear'}
                </button>
              )}
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={12} className="w-full h-64 p-3 dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg text-sm resize-none bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/50" placeholder="Paste long text here to simulate chunking..."></textarea>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[500px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Chunks ({chunks.length})</h3>
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px] lg:min-h-0">
            {chunks.length === 0 ? (
              <p className="text-slate-500 text-sm text-center mt-10">Waiting for input...</p>
            ) : (
              chunks.map((c, i) => (
                <div key={i} className="p-3 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 rounded break-all whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-mono">
                  <div className="text-xs font-bold text-rose-600 mb-1">Chunk {i+1} ({c.length} chars)</div>
                  {c}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('chunking.howToUseTitle')}</h2>
        
        <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 flex items-start text-rose-800 dark:text-rose-300">
          <p className="text-sm leading-relaxed">{t('chunking.howToUseSample')}</p>
        </div>

        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm">1</span>
            <span>{t('chunking.howToUse1')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm">2</span>
            <span>{t('chunking.howToUse2')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm">3</span>
            <span>{t('chunking.howToUse3')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm">4</span>
            <span>{t('chunking.howToUse4')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-semibold text-sm">5</span>
            <span>{t('chunking.howToUse5')}</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('chunking.aboutTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('chunking.about1')}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('chunking.about2')}
        </p>
      </div>
    </div>
  );
}
