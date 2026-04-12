import React, { useState, useRef } from 'react';
import { SEO } from '../components/SEO';
import { FileText, Download, Copy, Check, SplitSquareHorizontal, Maximize2, Minimize2, HelpCircle, ChevronDown, ChevronUp, Code } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Sync scroll
  const handleEditorScroll = () => {
    if (viewMode !== 'split' || !editorRef.current || !previewRef.current) return;
    const editor = editorRef.current;
    const preview = previewRef.current;
    const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
  };

  const handlePreviewScroll = () => {
    if (viewMode !== 'split' || !editorRef.current || !previewRef.current) return;
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
        url="/markdown-editor"
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-3 h-8 w-8 text-blue-500" />
                {t('markdown.title')}
              </h1>
              <p className="text-gray-500 mt-2">{t('markdown.desc')}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${showGuide ? 'bg-blue-100 text-blue-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                {t('markdown.guide.title')}
                {showGuide ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </button>

              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode(viewMode === 'edit' ? 'split' : 'edit')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t('markdown.editOnly') || "Edit Only"}
                >
                  {viewMode === 'edit' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t('markdown.splitView') || "Split View"}
                >
                  <SplitSquareHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode(viewMode === 'preview' ? 'split' : 'preview')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t('markdown.previewOnly') || "Preview Only"}
                >
                  {viewMode === 'preview' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {showGuide && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-900 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
              <div>
                <h4 className="font-bold mb-2 text-blue-800">{t('markdown.guide.headings')}</h4>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1"># H1</code>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">## H2</code>
                <code className="block bg-white/60 px-2 py-1 rounded mb-4">### H3</code>
                
                <h4 className="font-bold mb-2 text-blue-800">{t('markdown.guide.emphasis')}</h4>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">**bold**</code>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">*italic*</code>
                <code className="block bg-white/60 px-2 py-1 rounded">~~strikethrough~~</code>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-blue-800">{t('markdown.guide.lists')}</h4>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">- Item 1</code>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">1. Item 1</code>
                <code className="block bg-white/60 px-2 py-1 rounded mb-4">- [x] Task</code>

                <h4 className="font-bold mb-2 text-blue-800">{t('markdown.guide.links')}</h4>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">[Text](url)</code>
                <code className="block bg-white/60 px-2 py-1 rounded">![Alt](url)</code>
              </div>
              <div>
                <h4 className="font-bold mb-2 text-blue-800">{t('markdown.guide.code')}</h4>
                <code className="block bg-white/60 px-2 py-1 rounded mb-1">`inline code`</code>
                <code className="block bg-white/60 px-2 py-1 rounded mb-4 whitespace-pre">```\nblock code\n```</code>

                <h4 className="font-bold mb-2 text-blue-800">{t('markdown.guide.quote')}</h4>
                <code className="block bg-white/60 px-2 py-1 rounded">{'>'} blockquote</code>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex space-x-6">
            <span><strong>{wordCount}</strong> words</span>
            <span><strong>{charCount}</strong> characters</span>
            <span><strong>~{readingTime}</strong> min read</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] h-[calc(100vh-20rem)]">
          {/* Editor Pane */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className={`flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-700">{t('markdown.editor')}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copied ? t('markdown.copied') : t('markdown.copy')}
                  </button>
                  <button
                    onClick={handleDownloadMd}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    title="Download .md"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    MD
                  </button>
                </div>
              </div>
              <textarea
                ref={editorRef}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                onScroll={handleEditorScroll}
                className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm text-gray-800 bg-white"
                placeholder={t('markdown.placeholder')}
                spellCheck="false"
              />
            </div>
          )}

          {/* Preview Pane */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className={`flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-bold text-gray-700">{t('markdown.preview')}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownloadHtml}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                    title="Download HTML"
                  >
                    <Code className="w-4 h-4 mr-1" />
                    HTML
                  </button>
                </div>
              </div>
              <div 
                ref={previewRef}
                onScroll={handlePreviewScroll}
                className="flex-1 overflow-y-auto p-6 bg-white"
              >
                <div className="prose prose-blue max-w-none prose-pre:p-0 prose-pre:bg-transparent">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md !m-0"
                          />
                        ) : (
                          <code {...props} className={className}>
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

        {/* SEO Detailed Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('markdown.longDesc.title')}</h2>
          <div className="prose prose-blue max-w-none text-gray-700">
            <div className="mb-4 leading-relaxed">
              <Markdown>{t('markdown.longDesc.p1')}</Markdown>
            </div>
            <div className="mb-4 leading-relaxed">
              <Markdown>{t('markdown.longDesc.p2')}</Markdown>
            </div>
            <div className="leading-relaxed">
              <Markdown>{t('markdown.longDesc.p3')}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
