import React, { useState, useRef, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { SEO } from '../components/SEO';
import { FileCode2, Copy, Trash2, Plus, Upload, Bot, FileText, Check, Download, AlignLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language?: string;
}

export function LlmOptimizer() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const addEmptyFile = () => {
    const newId = crypto.randomUUID();
    setFiles(prev => [...prev, { id: newId, name: `untitled-${prev.length + 1}.txt`, content: '' }]);
    setSelectedId(newId);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;
    
    const newFiles: CodeFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Skip large files > 1MB
      if (file.size > 1024 * 1024) continue;
      
      const content = await file.text();
      // Only keep files that look like text (very simple heuristic: let's assume all uploaded files via text() are text, but we can verify it doesn't have too many null bytes)
      if (content.indexOf('\0') !== -1) continue;

      const path = (file as any).webkitRelativePath || file.name;
      newFiles.push({
        id: crypto.randomUUID(),
        name: path,
        content: content,
        language: path.split('.').pop() || 'text'
      });
    }

    if (newFiles.length > 0) {
      setFiles(prev => {
        const next = [...prev, ...newFiles];
        // Select the first uploaded file if nothing was selected
        if (!selectedId && next.length > 0) setSelectedId(next[0].id);
        return next;
      });
    }
    // reset input
    if (event.target) event.target.value = '';
  };

  const updateFile = (id: string, updates: Partial<CodeFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(prev => {
      const next = prev.filter(f => f.id !== id);
      if (selectedId === id) {
        setSelectedId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  const clearAll = () => {
    setFiles([]);
    setSelectedId(null);
  };

  // Generate markdown output
  const generateMarkdown = useCallback(() => {
    if (files.length === 0) return '';
    
    let md = 'Here is the codebase context:\n\n';

    // Try to build a simple tree representation
    md += '### Project Structure\n```text\n';
    
    // Sort files by path
    const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
    
    // Very simple flat tree printing
    sortedFiles.forEach(f => {
      md += `/ ${f.name}\n`;
    });
    md += '```\n\n';

    // File contents
    md += '### File Contents\n\n';
    sortedFiles.forEach(f => {
      const ext = f.name.split('.').pop() || 'text';
      md += `==== File: \`${f.name}\` ====\n`;
      md += `\`\`\`${ext}\n${f.content}\n\`\`\`\n\n`;
    });

    return md;
  }, [files]);

  const copyToClipboard = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectedFile = files.find(f => f.id === selectedId);
  const totalChars = files.reduce((acc, f) => acc + f.content.length, 0);

  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <div className="max-w-7xl mx-auto">
      <SEO 
        title={t('llm.seoTitle') || 'LLM Context Optimizer | DevToolz'}
        description={t('llm.desc') || 'Compress and optimize your codebase context for LLM prompts'}
        url={`/${currentLang}/llm-optimizer`}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <Bot className="mr-3 h-8 w-8 text-emerald-600" />
          {t('llm.title') || 'LLM Prompt Context Optimizer'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('llm.subtitle') || 'Combine multiple code files into a clean, token-optimized Markdown format for ChatGPT, Claude, and Gemini.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Left Sidebar: File List */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Files ({files.length})</span>
              {files.length > 0 && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">
                  {t('common.clear') || 'Clear'}
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button onClick={addEmptyFile} className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs py-1.5 rounded-md flex items-center justify-center font-medium transition-colors">
                <Plus className="w-3.5 h-3.5 mr-1" /> {t('common.add') || 'Add'}
              </button>
              
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs py-1.5 rounded-md flex items-center justify-center font-medium transition-colors">
                <Upload className="w-3.5 h-3.5 mr-1" /> {t('common.files') || 'Files'}
              </button>

              <button onClick={() => folderInputRef.current?.click()} className="flex-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-xs py-1.5 rounded-md flex items-center justify-center font-medium transition-colors" title={t('common.dir') || 'Dir'}>
                <Upload className="w-3.5 h-3.5 mr-1" /> {t('common.dir') || 'Dir'}
              </button>
            </div>
            
            <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900" />
            <input type="file" multiple ref={folderInputRef} onChange={handleFileUpload} {...({ webkitdirectory: "", directory: "" } as any)} className="hidden dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900" />
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-400 text-sm text-center p-4">
                <FileCode2 className="w-8 h-8 mb-2 opacity-50" />
                <p>{t('llm.noFiles')}</p>
                <p className="mt-1 text-xs">{t('llm.noFilesHint')}</p>
              </div>
            ) : (
              files.map((file) => (
                <div 
                  key={file.id} 
                  onClick={() => setSelectedId(file.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-sm ${
                    selectedId === file.id 
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center overflow-hidden mr-2">
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0 opacity-70" />
                    <span className="truncate" title={file.name}>{file.name}</span>
                  </div>
                  <button 
                    onClick={(e) => removeFile(file.id, e)}
                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Center: Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden min-h-[400px]">
          {selectedFile ? (
            <>
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center">
                <input 
                  type="text" 
                  value={selectedFile.name}
                  onChange={(e) => updateFile(selectedFile.id, { name: e.target.value })}
                  placeholder={t('llm.filePathPlaceholder') || "File path (e.g. src/App.tsx)"}
                  className="flex-1 dark:bg-black/20 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-slate-800 dark:text-slate-200 transition-shadow bg-slate-50 dark:bg-slate-900"
                />
              </div>
              <textarea
                value={selectedFile.content}
                onChange={(e) => updateFile(selectedFile.id, { content: e.target.value })}
                placeholder={t('llm.codePlaceholder') || "Paste code or text here..."}
                className="flex-1 w-full p-4 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-sm resize-none outline-none focus:ring-inset focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.06]"
              />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-400">
              <AlignLeft className="w-12 h-12 mb-4 opacity-30" />
              <p>{t('llm.selectFileHint')}</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Output */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden h-full min-h-[500px] lg:min-h-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{t('llm.outputTitle')}</h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex justify-between">
              <span>{t('llm.filesRange', { count: files.length })}</span>
              <span>{t('llm.tokens', { count: Math.ceil(totalChars / 4) })}</span>
            </div>
            <button
              onClick={copyToClipboard}
              disabled={files.length === 0}
              className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center transition-all ${
                files.length === 0 
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                  : copied
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300'
              }`}
            >
              {copied ? <><Check className="w-4 h-4 mr-2" /> {t('common.copied')}</> : <><Copy className="w-4 h-4 mr-2" /> {t('llm.copyContext')}</>}
            </button>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
            <textarea
              readOnly
              value={generateMarkdown()}
              placeholder={t('llm.outputPlaceholder') || "Your optimized prompt context will appear here..."}
              className="absolute inset-4 resize-none outline-none font-mono text-xs text-slate-600 dark:text-slate-400 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('llm.howToUseTitle')}</h2>
        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">1</span>
            <span>{t('llm.howToUse1')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">2</span>
            <span>{t('llm.howToUse2')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">3</span>
            <span>{t('llm.howToUse3')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">4</span>
            <span>{t('llm.howToUse4')}</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('llm.aboutTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('llm.about1')}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          <Trans i18nKey="llm.about2">
            The <strong>LLM Prompt Context Optimizer</strong> automatically converts multiple files or entire folders into a clean, hierarchical Markdown format. It explicitly labels each code snippet with its relative path, preventing AI hallucinations and dramatically improving the quality of the generated code refactoring or debugging suggestions.
          </Trans>
        </p>
      </div>
    </div>
  );
}
