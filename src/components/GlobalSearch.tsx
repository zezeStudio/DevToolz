import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  X, 
  CornerDownLeft, 
  Sparkles, 
  Flame, 
  SlidersHorizontal,
  Bot,
  Terminal,
  FileText,
  Palette,
  Shield,
  Layers,
  LucideIcon,
  Star,
  Keyboard
} from 'lucide-react';
import { SEARCHABLE_TOOLS, SearchableTool, ToolCategory } from '../data/searchTools';
import { cn } from '../lib/utils';
import { useFavorites } from '../hooks/useFavorites';
import { useShortcuts } from './ShortcutProvider';
import { useToolUsage } from '../hooks/useToolUsage';

const CATEGORY_ORDER: (ToolCategory | 'all')[] = [
  'all',
  'ai',
  'developer',
  'text',
  'design',
  'security',
];

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { isSearchOpen: isOpen, setIsSearchOpen: setIsOpen, openHelp, isMac } = useShortcuts();
  const { isFavorite } = useFavorites();
  const { usageMap } = useToolUsage();

  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const currentLang = (lang || i18n.language || 'en') as 'en' | 'ko' | 'ja';
  const effectiveLang: 'en' | 'ko' | 'ja' = ['en', 'ko', 'ja'].includes(currentLang) ? currentLang : 'en';
  const basePath = effectiveLang === 'en' ? '' : `/${effectiveLang}`;

  // Handle modal open: focus input and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Small timeout to allow the modal to render before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Close modal when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Filter tools based on query and category
  const filteredTools = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    return SEARCHABLE_TOOLS.filter(tool => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // If no query, return all matching category
      if (queryTokens.length === 0) return true;

      // Combine searchable text across localized names, descriptions, id, path, and keywords
      const haystack = [
        tool.name[effectiveLang] || '',
        tool.name.en,
        tool.name.ko,
        tool.name.ja,
        tool.description[effectiveLang] || '',
        tool.description.en,
        tool.id,
        tool.path,
        ...tool.keywords,
      ]
        .join(' ')
        .toLowerCase();

      return queryTokens.every(token => haystack.includes(token));
    }).sort((a, b) => {
      const cleanQuery = query.trim().toLowerCase();
      if (!cleanQuery) {
        // Prioritize favorites, then most used tools, then curated popular tools
        const aFav = isFavorite(a.id) ? 1 : 0;
        const bFav = isFavorite(b.id) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;

        const aUsage = usageMap[a.id] || 0;
        const bUsage = usageMap[b.id] || 0;
        if (aUsage !== bUsage) return bUsage - aUsage;

        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      }

      // Exact title prefix match gets highest priority
      const aTitle = a.name[effectiveLang]?.toLowerCase() || a.name.en.toLowerCase();
      const bTitle = b.name[effectiveLang]?.toLowerCase() || b.name.en.toLowerCase();

      const aStarts = aTitle.startsWith(cleanQuery);
      const bStarts = bTitle.startsWith(cleanQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Exact keyword match
      const aHasExactKeyword = a.keywords.some(k => k.toLowerCase() === cleanQuery);
      const bHasExactKeyword = b.keywords.some(k => k.toLowerCase() === cleanQuery);
      if (aHasExactKeyword && !bHasExactKeyword) return -1;
      if (!aHasExactKeyword && bHasExactKeyword) return 1;

      return 0;
    });
  }, [query, selectedCategory, effectiveLang, isFavorite, usageMap]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredTools.length, selectedCategory, query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-tool-index="${selectedIndex}"]`) as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Navigation action
  const handleSelectTool = useCallback((tool: SearchableTool) => {
    const targetUrl = `${basePath}/${tool.path}`;
    setIsOpen(false);
    navigate(targetUrl);
  }, [basePath, navigate]);

  // Keyboard navigation within the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredTools.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const idx = CATEGORY_ORDER.indexOf(selectedCategory);
      const nextIdx = e.shiftKey
        ? (idx - 1 + CATEGORY_ORDER.length) % CATEGORY_ORDER.length
        : (idx + 1) % CATEGORY_ORDER.length;
      setSelectedCategory(CATEGORY_ORDER[nextIdx]);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelectTool(filteredTools[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Helper highlighting supporting multi-word queries
  const highlightMatch = (text: string, searchQuery: string) => {
    const tokens = searchQuery.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return text;
    const escapedTokens = tokens
      .sort((a, b) => b.length - a.length)
      .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => 
          tokens.some(tok => part.toLowerCase() === tok.toLowerCase()) ? (
            <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/60 text-slate-900 dark:text-yellow-200 px-0.5 rounded font-medium">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const categories: { id: ToolCategory | 'all'; label: string; icon: LucideIcon }[] = [
    { id: 'all', label: t('search.all') || 'All Tools', icon: SlidersHorizontal },
    { id: 'ai', label: t('home.category.ai') || 'AI Tools', icon: Bot },
    { id: 'developer', label: t('home.category.developer') || 'Developer', icon: Terminal },
    { id: 'text', label: t('home.category.text') || 'Text & Content', icon: FileText },
    { id: 'design', label: t('home.category.design') || 'Design', icon: Palette },
    { id: 'security', label: t('home.category.security') || 'Security', icon: Shield }
  ];

  return (
    <>
      {/* Top Navbar Search Button */}
      <div className="flex items-center">
        {/* Desktop Search Input Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-keyshortcuts="Meta+k Control+k"
          className={cn(
            "hidden md:flex items-center justify-between w-56 lg:w-72 xl:w-80 h-9 px-3 text-xs font-normal",
            "bg-slate-100/80 hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-800",
            "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
            "border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600",
            "rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-150 group"
          )}
          aria-label={t('search.placeholder') || 'Search tools...'}
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
            <span className="truncate">
              {t('search.placeholder') || (effectiveLang === 'ko' ? '도구 검색...' : effectiveLang === 'ja' ? 'ツールを検索...' : 'Search tools...')}
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium tracking-tight text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded shadow-xs shrink-0 ml-2">
            <span>{isMac ? '⌘' : 'Ctrl'}</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors"
          aria-label="Search tools"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Global Command Palette / Search Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('shortcuts.openSearch') || 'Global Tool Search'}
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-150"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div 
            className={cn(
              "relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[82vh]",
              "animate-in zoom-in-95 fade-in duration-150"
            )}
            onKeyDown={handleKeyDown}
          >
            {/* Header: Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-200/90 dark:border-slate-800 gap-3">
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="global-search-listbox"
                aria-activedescendant={filteredTools[selectedIndex] ? `search-option-${filteredTools[selectedIndex].id}` : undefined}
                aria-label={t('search.placeholder') || 'Search tools'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  t('search.modalPlaceholder') || 
                  (effectiveLang === 'ko' ? '도구 이름, 기능, 키워드 검색 (예: JSON, Base64, 토큰...)' : 
                   effectiveLang === 'ja' ? 'ツール名、機能、キーワードで検索 (例: JSON, Base64, トークン...)' : 
                   'Search developer tools (e.g., JSON, Base64, Token, Regex, Diff)...')
                }
                className="flex-1 bg-transparent border-0 text-slate-900 dark:text-slate-100 text-base sm:text-lg placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                  aria-label="Clear query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors flex items-center gap-1"
              >
                <span>Esc</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-700/50">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all",
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tools Result List */}
            <div 
              ref={listRef}
              id="global-search-listbox"
              role="listbox"
              aria-label={t('search.quickResults') || 'Developer Tools'}
              className="flex-1 overflow-y-auto p-2 space-y-1 divide-y-0"
              tabIndex={-1}
            >
              {filteredTools.length > 0 ? (
                <>
                  {!query && selectedCategory === 'all' && (
                    <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-amber-500" />
                        {t('search.popular') || (effectiveLang === 'ko' ? '추천 및 주요 도구' : effectiveLang === 'ja' ? '人気のツール' : 'Recommended & Popular')}
                      </span>
                      <span>{filteredTools.length} {t('search.all') || 'tools'}</span>
                    </div>
                  )}

                  {query && (
                    <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      {filteredTools.length} {effectiveLang === 'ko' ? '개의 도구 발견' : effectiveLang === 'ja' ? '件のツールが見つかりました' : 'tools found'}
                    </div>
                  )}

                  {filteredTools.map((tool, index) => {
                    const isSelected = index === selectedIndex;
                    const Icon = tool.icon;
                    const toolName = tool.name[effectiveLang] || tool.name.en;
                    const toolDesc = tool.description[effectiveLang] || tool.description.en;

                    return (
                      <div
                        key={tool.id}
                        id={`search-option-${tool.id}`}
                        role="option"
                        aria-selected={isSelected}
                        data-tool-index={index}
                        onClick={() => handleSelectTool(tool)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "group flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all duration-100",
                          isSelected 
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 shadow-xs ring-1 ring-blue-500/30" 
                            : "hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Tool Icon in Squircle */}
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs transition-transform duration-150 group-hover:scale-105",
                            tool.colorClass
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Tool Name, Description & Category */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                                {highlightMatch(toolName, query)}
                              </span>
                              {isFavorite(tool.id) && (
                                <span title="Pinned" className="inline-flex items-center">
                                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500 shrink-0" />
                                </span>
                              )}
                              {tool.isPopular && !query && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-medium rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  <span>Hot</span>
                                </span>
                              )}
                              <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-400 tabular-nums">
                                · {tool.badgeText}
                                {(usageMap[tool.id] || 0) > 0 && (
                                  <> · {t('home.usageCount', { count: usageMap[tool.id] })}</>
                                )}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {highlightMatch(toolDesc, query)}
                            </p>
                          </div>
                        </div>

                        {/* Right Quick Action Indicator */}
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          {isSelected && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-800/40 px-2 py-0.5 rounded-md">
                              <span>{t('search.open') || (effectiveLang === 'ko' ? '열기' : effectiveLang === 'ja' ? '開く' : 'Open')}</span>
                              <CornerDownLeft className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                /* No Results Empty State */
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t('search.noResults') || (effectiveLang === 'ko' ? '일치하는 도구를 찾을 수 없습니다' : effectiveLang === 'ja' ? '一致するツールが見つかりませんでした' : 'No tools found matching')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {effectiveLang === 'ko' 
                      ? `"${query}"와(과) 일치하는 도구가 없습니다. 다른 검색어나 키워드(예: JSON, 토큰, 해시)를 입력해 보세요.`
                      : effectiveLang === 'ja'
                      ? `「${query}」に一致するツールはありません。別のキーワード（JSON、トークン、ハッシュなど）をお試しください。`
                      : `No developer utilities matched "${query}". Try searching by feature (e.g., JSON, Token, Hash, Regex).`}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setSelectedCategory('all'); }}
                    className="mt-4 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                  >
                    {effectiveLang === 'ko' ? '검색 초기화' : effectiveLang === 'ja' ? '検索をリセット' : 'Reset search filter'}
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">↓</kbd>
                  <span className="hidden sm:inline ml-0.5">{effectiveLang === 'ko' ? '이동' : effectiveLang === 'ja' ? '移動' : 'Navigate'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">↵</kbd>
                  <span className="hidden sm:inline ml-0.5">{effectiveLang === 'ko' ? '선택' : effectiveLang === 'ja' ? '選択' : 'Select'}</span>
                </span>
                <span className="hidden md:flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">Tab</kbd>
                  <span className="ml-0.5">{effectiveLang === 'ko' ? '카테고리' : effectiveLang === 'ja' ? '分類' : 'Category'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">Esc</kbd>
                  <span className="hidden sm:inline ml-0.5">{effectiveLang === 'ko' ? '닫기' : effectiveLang === 'ja' ? '閉じる' : 'Close'}</span>
                </span>
              </div>

              <button
                type="button"
                onClick={openHelp}
                className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('shortcuts.buttonLabel') || 'Shortcuts'}</span>
                <kbd className="px-1 py-0.2 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">?</kbd>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
