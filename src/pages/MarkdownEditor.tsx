import React, { useState, useRef } from 'react';
import { SEO } from '../components/SEO';
import { FileText, Download, Copy, Check, SplitSquareHorizontal, Maximize2, Minimize2, HelpCircle, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Editor!

This is a live preview markdown editor. You can type on the left and see the rendered output on the right.

## Features

- **Real-time rendering**: See changes instantly
- **GitHub Flavored Markdown**: Supports tables, strikethrough, task lists
- **Syntax Highlighting**: Beautiful code blocks

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

### Tables

| Feature | Support |
|---------|---------|
| Tables  | Yes     |
| Code    | Yes     |
| Math    | No      |

### Task Lists

- [x] Write markdown
- [x] Preview it
- [ ] Export to PDF (coming soon)

> "Markdown is a text-to-HTML conversion tool for web writers." - John Gruber
`;

export function MarkdownEditor() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Anti-loop flags for scroll sync
  const isSyncingLeftScroll = useRef(false);
  const isSyncingRightScroll = useRef(false);

  // Sync scroll
  const handleEditorScroll = () => {
    if (viewMode !== 'split' || !editorRef.current || !previewRef.current) return;
    if (isSyncingLeftScroll.current) {
      isSyncingLeftScroll.current = false;
      return;
    }
    isSyncingRightScroll.current = true;
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
  };

  const handlePreviewScroll = () => {
    if (viewMode !== 'split' || !editorRef.current || !previewRef.current) return;
    if (isSyncingRightScroll.current) {
      isSyncingRightScroll.current = false;
      return;
    }
    isSyncingLeftScroll.current = true;
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    editor.scrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const handleCopyHtml = async () => {
    try {
      const htmlContent = previewRef.current?.innerHTML || '';
      await navigator.clipboard.writeText(htmlContent);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch (err) {
      console.error('Failed to copy HTML');
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Markdown Export</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #333; }
  pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
  code { font-family: monospace; background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background-color: #f8f9fa; }
  blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
  img { max-width: 100%; height: auto; }
</style>
</head>
<body>
${previewRef.current?.innerHTML || ''}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;
  const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

  return (
    <>
      <SEO 
        title={t('markdown.seoTitle')}
        description={t('markdown.desc')}
        url={`/${currentLang}/markdown-editor`}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col shrink-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center mb-2">
            <FileText className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
            {t('markdown.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t('markdown.desc')}</p>
          
          <div className="flex items-center space-x-3 relative">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative z-50 ${showGuide ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:bg-gray-900'}`}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('markdown.guide.title')}
                {showGuide ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </button>

              {showGuide && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowGuide(false)} />
                  <div className="absolute top-full right-0 mt-3 z-50 w-[700px] max-w-[90vw] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-6 text-sm grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                    <div>
                      <h4 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{t('markdown.guide.headings')}</h4>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs"># H1</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs">## H2</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-6 text-xs">### H3</code>
                      
                      <h4 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{t('markdown.guide.emphasis')}</h4>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs">**bold**</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs">*italic*</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg text-xs">~~strikethrough~~</code>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{t('markdown.guide.lists')}</h4>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs">- Item 1</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs">1. Item 1</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-6 text-xs">- [x] Task</code>

                      <h4 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{t('markdown.guide.links')}</h4>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs break-all">[Text](url)</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg text-xs break-all">![Alt](url)</code>
                    </div>
                    <div>
                      <h4 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{t('markdown.guide.code')}</h4>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-2 text-xs">`inline code`</code>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg mb-6 text-xs whitespace-pre-wrap break-all">```\nblock code\n```</code>

                      <h4 className="font-bold mb-3 text-blue-600 dark:text-blue-400">{t('markdown.guide.quote')}</h4>
                      <code className="block bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 px-3 py-1.5 rounded-lg text-xs">{'>'} blockquote</code>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg border border-transparent dark:border-gray-800">
                <button
                  onClick={() => setViewMode(viewMode === 'edit' ? 'split' : 'edit')}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'edit' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800/80'}`}
                  title={t('markdown.editOnly') || "Edit Only"}
                >
                  {viewMode === 'edit' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'split' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800/80'}`}
                  title={t('markdown.splitView') || "Split View"}
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'preview' ? 'split' : 'preview')}
                  className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'preview' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800/80'}`}
                  title={t('markdown.previewOnly') || "Preview Only"}
                >
                  {viewMode === 'preview' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Editor Pane */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 ${viewMode === 'split' ? 'lg:w-1/2 h-[450px] md:h-[600px] lg:h-[calc(100vh-14rem)]' : 'w-full h-[600px] md:h-[calc(100vh-16rem)] lg:h-[calc(100vh-14rem)]'}`}>
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-14">
                <h3 className="font-bold text-gray-700 dark:text-gray-300">{t('markdown.editor')}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1.5 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                    {copied ? t('markdown.copied') : t('markdown.copy')}
                  </button>
                  <button
                    onClick={handleDownloadMd}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Download .md"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    MD
                  </button>
                </div>
              </div>
              <textarea
                ref={editorRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                onScroll={handleEditorScroll}
                className="flex-1 w-full p-4 md:p-6 resize-none focus:outline-none font-mono text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                placeholder={t('markdown.placeholder')}
                spellCheck="false"
              />
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex-shrink-0 ${viewMode === 'split' ? 'lg:w-1/2 h-[450px] md:h-[600px] lg:h-[calc(100vh-14rem)]' : 'w-full h-[600px] md:h-[calc(100vh-16rem)] lg:h-[calc(100vh-14rem)]'}`}>
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-14">
                <h3 className="font-bold text-gray-700 dark:text-gray-300">{t('markdown.preview')}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyHtml}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Copy HTML to clipboard"
                  >
                    {copiedHtml ? <Check className="w-4 h-4 mr-1.5 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1.5" />}
                    {copiedHtml ? t('markdown.copied') : t('markdown.copy')}
                  </button>
                  <button
                    onClick={handleDownloadHtml}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Download HTML"
                  >
                    <Code className="w-4 h-4 mr-1.5" />
                    HTML
                  </button>
                </div>
              </div>
              <div 
                ref={previewRef}
                onScroll={handlePreviewScroll}
                className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-gray-800"
              >
                <div className="prose prose-blue dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-img:rounded-xl prose-headings:font-bold">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-xl !m-0 border border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <code {...props} className={`${className} bg-gray-100 dark:bg-gray-700/50 px-1.5 py-0.5 rounded-md font-mono text-sm`}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {markdown}
                  </Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Stats Footer */}
        <div className="flex justify-center items-center mt-2">
          <div className="flex space-x-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
            <span>~{readingTime} min read</span>
          </div>
        </div>

        {/* SEO Detailed Description */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('markdown.longDesc.title')}</h2>
          <div className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <div className="mb-4 leading-relaxed">
              <Markdown>{t('markdown.longDesc.p1')}</Markdown>
            </div>
            <div className="mb-4 leading-relaxed">
              <Markdown>{t('markdown.longDesc.p2')}</Markdown>
            </div>
            <div className="leading-relaxed">
              <Markdown>{t('markdown.longDesc.p3')}</Markdown>
              <div className="mt-4"><Markdown>{t('markdown.longDesc.p4')}</Markdown></div>
              <div className="mt-4"><Markdown>{t('markdown.longDesc.p5')}</Markdown></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
