import React, { useState, useRef } from 'react';
import { SEO } from '../components/SEO';
import { FileText, Download, Copy, Check, SplitSquareHorizontal, Maximize2, Minimize2, HelpCircle, ChevronDown, ChevronUp, Code, Lightbulb, AlertTriangle } from 'lucide-react';
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
  const { t, i18n } = useTranslation();
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
                className="flex-1 w-full p-4 md:p-6 resize-none focus:outline-none font-mono text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 dark:bg-gray-800 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50 border border-slate-200 dark:border-white/[0.06]"
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
          <div className="flex space-x-6 text-xs text-slate-400 dark:text-slate-400 font-medium">
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
                Markdown Editor 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Markdown Editor 도구는 edit and preview markdown 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Markdown Editor 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! Markdown Editor의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. Markdown Editor 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Markdown Editor ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Markdown Editor ツールは、edit and preview markdown するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Markdown Editor を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！Markdown Editor のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。Markdown Editor ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the Markdown Editor tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The Markdown Editor is a specialized utility designed to edit and preview markdown. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the Markdown Editor?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the Markdown Editor happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The Markdown Editor is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 edit and preview markdown 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に edit and preview markdown したい場合に非常に便利です。
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
                When you are working on a project and need to quickly edit and preview markdown without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to edit and preview markdown.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how edit processes work visually.
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
    </>
  );
}