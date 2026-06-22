import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Code2, Key, Type, ArrowRight, Binary, Link as LinkIcon, Search, Shield, Terminal, FileText, FileJson, Palette, Fingerprint, Hash, Clock, QrCode, FileDiff, Image as ImageIcon, Bot, Braces, Layers } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useTranslation } from 'react-i18next';

export function Home() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentLang = lang || 'en';

  const tools = [
    {
      name: t('home.tools.json.name'),
      description: t('home.tools.json.desc'),
      icon: Code2,
      path: `/${currentLang}/json-formatter`,
      color: 'bg-emerald-500',
      category: 'developer'
    },
    {
      name: t('home.tools.base64.name'),
      description: t('home.tools.base64.desc'),
      icon: Binary,
      path: `/${currentLang}/base64-converter`,
      color: 'bg-slate-800',
      category: 'developer'
    },
    {
      name: t('home.tools.url.name'),
      description: t('home.tools.url.desc'),
      icon: LinkIcon,
      path: `/${currentLang}/url-encoder`,
      color: 'bg-indigo-500',
      category: 'developer'
    },
    {
      name: t('home.tools.jwt.name'),
      description: t('home.tools.jwt.desc'),
      icon: FileJson,
      path: `/${currentLang}/jwt-decoder`,
      color: 'bg-teal-500',
      category: 'developer'
    },
    {
      name: t('home.tools.color.name'),
      description: t('home.tools.color.desc'),
      icon: Palette,
      path: `/${currentLang}/color-converter`,
      color: 'bg-pink-500',
      category: 'design'
    },
    {
      name: t('home.tools.text.name'),
      description: t('home.tools.text.desc'),
      icon: Type,
      path: `/${currentLang}/text-analyzer`,
      color: 'bg-purple-500',
      category: 'text'
    },
    {
      name: t('home.tools.markdown.name'),
      description: t('home.tools.markdown.desc'),
      icon: FileText,
      path: `/${currentLang}/markdown-editor`,
      color: 'bg-slate-700',
      category: 'text'
    },
    {
      name: t('home.tools.password.name'),
      description: t('home.tools.password.desc'),
      icon: Key,
      path: `/${currentLang}/password-generator`,
      color: 'bg-green-500',
      category: 'security'
    },
    {
      name: t('home.tools.uuid.name'),
      description: t('home.tools.uuid.desc'),
      icon: Fingerprint,
      path: `/${currentLang}/uuid-generator`,
      color: 'bg-indigo-600',
      category: 'developer'
    },
    {
      name: t('home.tools.hash.name'),
      description: t('home.tools.hash.desc'),
      icon: Hash,
      path: `/${currentLang}/hash-generator`,
      color: 'bg-red-500',
      category: 'security'
    },
    {
      name: t('home.tools.unix.name'),
      description: t('home.tools.unix.desc'),
      icon: Clock,
      path: `/${currentLang}/unix-timestamp`,
      color: 'bg-cyan-600',
      category: 'developer'
    },
    {
      name: t('home.tools.qr.name'),
      description: t('home.tools.qr.desc'),
      icon: QrCode,
      path: `/${currentLang}/qr-code`,
      color: 'bg-yellow-500',
      category: 'design'
    },
    {
      name: t('home.tools.regex.name'),
      description: t('home.tools.regex.desc'),
      icon: Search,
      path: `/${currentLang}/regex-tester`,
      color: 'bg-slate-800',
      category: 'developer'
    },
    {
      name: t('home.tools.diff.name'),
      description: t('home.tools.diff.desc'),
      icon: FileDiff,
      path: `/${currentLang}/diff-checker`,
      color: 'bg-emerald-600',
      category: 'developer'
    },
    {
      name: t('home.tools.imageCompressor.name'),
      description: t('home.tools.imageCompressor.desc'),
      icon: ImageIcon,
      path: `/${currentLang}/image-compressor`,
      color: 'bg-rose-500',
      category: 'design'
    },
    {
      name: t('nav.jsonTs') || 'JSON to TS Converter',
      description: t('jsonTs.desc') || 'Convert JSON objects to TypeScript interfaces instantly. Perfect for strongly typing your AI API responses.',
      icon: Code2,
      path: `/${currentLang}/json-to-ts`,
      color: 'bg-emerald-600',
      category: 'ai',
      keywords: ['json', 'typescript', 'ts', 'converter', 'ai', 'interface']
    },
    {
      name: t('nav.tokenCounter') || 'Token Counter',
      description: t('tokenCounter.desc') || 'Calculate API tokens for your AI prompts and estimate costs for various models.',
      icon: Terminal,
      path: `/${currentLang}/token-counter`,
      color: 'bg-teal-600',
      category: 'ai',
      keywords: ['token', 'counter', 'ai', 'gpt', 'claude', 'gemini', 'cost']
    },
    {
      name: t('nav.llmOptimizer') || 'LLM Context Optimizer',
      description: t('llm.subtitle') || 'Combine multiple code files into a clean token-optimized Markdown format for AI.',
      icon: Bot,
      path: `/${currentLang}/llm-optimizer`,
      color: 'bg-blue-600',
      category: 'ai',
      keywords: ['ai', 'llm', 'context', 'compressor', 'optimizer', 'gpt', 'claude']
    },
    {
      name: t('nav.promptWrapper') || 'Prompt Wrapper',
      description: t('promptWrapper.subtitle') || 'Structure your AI prompts perfectly using XML tags or Markdown to reduce hallucinations.',
      icon: Braces,
      path: `/${currentLang}/prompt-wrapper`,
      color: 'bg-indigo-600',
      category: 'ai',
      keywords: ['ai', 'prompt', 'xml', 'markdown', 'wrapper', 'claude']
    },
    {
      name: t('nav.chunkingSimulator') || 'Chunking Simulator',
      description: t('chunking.subtitle') || 'Visualize how text is split into chunks for Vector Embeddings (RAG).',
      icon: Layers,
      path: `/${currentLang}/chunking-simulator`,
      color: 'bg-rose-600',
      category: 'ai',
      keywords: ['ai', 'chunking', 'simulator', 'rag', 'vector', 'embedding', 'llm']
    },
    {
      name: t('nav.systemPrompt') || 'System Prompt Generator',
      description: t('systemPrompt.subtitle') || 'Create rock-solid System Prompts to force Claude, ChatGPT, or Gemini into returning strictly valid JSON.',
      icon: Terminal,
      path: `/${currentLang}/system-prompt`,
      color: 'bg-amber-600',
      category: 'ai',
      keywords: ['ai', 'system prompt', 'json', 'generator', 'chatgpt', 'gemini']
    },
    {
      name: t('nav.promptInjector') || 'Prompt Variable Injector',
      description: t('promptInjector.subtitle') || 'Dynamically inject variables into your AI prompt templates.',
      icon: Terminal,
      path: `/${currentLang}/prompt-variable-injector`,
      color: 'bg-rose-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'template', 'injector', 'variables']
    },
    {
      name: t('nav.promptSplitter') || 'Prompt Token Splitter',
      description: t('promptSplitter.subtitle') || 'Split long texts into smaller LLM-friendly chunks.',
      icon: Layers,
      path: `/${currentLang}/prompt-token-splitter`,
      color: 'bg-purple-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'split', 'chunk', 'tokens', 'limit']
    },
    {
      name: t('nav.llmPlayground') || 'LLM Parameter Playground',
      description: t('llmPlayground.subtitle') || 'Interactive guide to understand AI parameters.',
      icon: Layers,
      path: `/${currentLang}/llm-parameter-playground`,
      color: 'bg-blue-500',
      category: 'ai',
      keywords: ['ai', 'llm', 'parameter', 'temperature', 'top-p', 'penalty']
    },
    {
      name: t('nav.xmlGuardrail') || 'XML Guardrail Generator',
      description: t('xmlGuardrail.subtitle') || 'Instantly generate XML system prompts.',
      icon: Terminal,
      path: `/${currentLang}/xml-guardrail-generator`,
      color: 'bg-teal-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'xml', 'guardrail', 'system']
    },
    {
      name: t('nav.fewShotBuilder') || 'Few-Shot Example Builder',
      description: t('fewShotBuilder.subtitle') || 'Construct optimized few-shot examples.',
      icon: Layers,
      path: `/${currentLang}/few-shot-builder`,
      color: 'bg-orange-500',
      category: 'ai',
      keywords: ['ai', 'few-shot', 'example', 'prompt', 'json', 'xml']
    },
    {
      name: t('nav.functionBuilder') || 'Function Payload Builder',
      description: t('functionBuilder.desc') || 'Visually build and format tools array for OpenAI, Anthropic, and Gemini function calling.',
      icon: Bot,
      path: `/${currentLang}/function-calling-builder`,
      color: 'bg-indigo-500',
      category: 'ai',
      keywords: ['ai', 'function', 'openai', 'anthropic', 'gemini', 'tool', 'calling']
    },
    {
      name: t('nav.jsonSchema') || 'JSON Schema Generator',
      description: t('jsonSchema.desc') || 'Generate strict JSON Schemas for OpenAI and Gemini Structured Outputs.',
      icon: Bot,
      path: `/${currentLang}/json-schema-generator`,
      color: 'bg-teal-500',
      category: 'ai',
      keywords: ['ai', 'json', 'schema', 'openai', 'gemini', 'structured', 'output']
    },
  ];

  const categories = [
    { id: 'ai', name: t('home.category.ai'), icon: Bot },
    { id: 'developer', name: t('home.category.developer'), icon: Terminal },
    { id: 'design', name: t('home.category.design'), icon: Palette },
    { id: 'text', name: t('home.category.text'), icon: FileText },
    { id: 'security', name: t('home.category.security'), icon: Shield },
  ];

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return tools;
    return tools.filter(tool => {
      const matchName = tool.name.toLowerCase().includes(query);
      const matchDesc = tool.description.toLowerCase().includes(query);
      const matchKeywords = tool.keywords?.some(kw => kw.toLowerCase().includes(query));
      return matchName || matchDesc || matchKeywords;
    });
  }, [searchQuery, tools]);

  const toolsByCategory = useMemo(() => {
    const grouped: Record<string, typeof tools> = {};
    filteredTools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });
    return grouped;
  }, [filteredTools]);

  return (
    <>
      <SEO 
        title={t('home.pageTitle')}
        description={t('home.subtitle')}
        url={`/${currentLang}`}
        schema={[
          {
            "@type": "WebApplication",
            "name": "DevToolz",
            "description": t('home.subtitle'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": tools.map(t => t.name)
          },
          {
            "@type": "ItemList",
            "itemListElement": tools.map((tool, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://www.zezelab.xyz${tool.path}`,
              "name": tool.name,
              "description": tool.description
            }))
          }
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15] mb-4 md:mb-6">
            {t('home.title1')} <span className="text-emerald-600 dark:text-emerald-400">{t('home.title2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 px-2">
            {t('home.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative px-2 sm:px-0">
            <div className="absolute inset-y-0 left-0 pl-6 sm:pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-20 py-3 md:py-4 border border-slate-300/80 hover:border-slate-400/80 dark:border-white/[0.06] rounded-2xl leading-5 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 text-base md:text-lg transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] bg-slate-50 dark:bg-black/20"
              placeholder={t('home.searchPlaceholder')}
            />
            <div className="absolute inset-y-0 right-0 pr-6 sm:pr-4 flex items-center pointer-events-none">
              <span className="hidden sm:inline-block bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-400 font-mono text-xs font-bold px-2 py-1 rounded shadow-sm border border-slate-200 dark:border-slate-800/50">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Tools Grid by Category */}
        {filteredTools.length > 0 ? (
          <div className="space-y-16">
            {categories.map(category => {
              const categoryTools = toolsByCategory[category.id];
              if (!categoryTools || categoryTools.length === 0) return null;

              return (
                <div key={category.id}>
                  <div className="flex items-center mb-6">
                    <category.icon className="h-6 w-6 text-slate-500 dark:text-slate-400 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{category.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.name}
                        to={tool.path}
                        className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 pb-8 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                      >
                        <div className="inline-flex p-2.5 md:p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-300/60 dark:border-slate-800/50 text-slate-600 dark:text-slate-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 mb-4 md:mb-5 w-fit shadow-sm transition-colors">
                          <tool.icon className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 md:mb-3 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 flex-1 mb-6 md:mb-8 leading-relaxed">
                          {tool.description}
                        </p>
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold mt-auto">
                          {t('home.useTool', { tool: tool.name })} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
              <Search className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-2">{t('home.noResults')}</h3>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Why Choose Us Section */}
        <div className="mt-24 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-12">{t('home.why.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{t('home.why.free.title')}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t('home.why.free.desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{t('home.why.privacy.title')}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t('home.why.privacy.desc')}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">{t('home.why.fast.title')}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{t('home.why.fast.desc')}</p>
            </div>
          </div>
        </div>

        {/* SEO Detailed Text Block */}
        <div className="mt-16 text-left px-4 md:px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('home.about.longTitle')}</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
             {t('home.about.longDesc').split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 leading-[1.85] tracking-[0.015em] text-[15px]">{paragraph}</p>
             ))}
          </div>
        </div>
      </div>
    </>
  );
}
