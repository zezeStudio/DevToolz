import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FavoriteButton } from './FavoriteButton';

interface BreadcrumbItem {
  label: string;
  path?: string; // If undefined, rendered as current page (non-clickable)
}

const TOOL_TITLE_KEYS: Record<string, string> = {
  'json-formatter': 'nav.json',
  'password-generator': 'nav.password',
  'text-analyzer': 'nav.text',
  'base64-converter': 'nav.base64',
  'url-encoder': 'nav.url',
  'jwt-decoder': 'nav.jwt',
  'color-converter': 'nav.color',
  'markdown-editor': 'nav.markdown',
  'uuid-generator': 'nav.uuid',
  'hash-generator': 'nav.hash',
  'unix-timestamp': 'nav.unix',
  'qr-code': 'nav.qr',
  'regex-tester': 'nav.regex',
  'diff-checker': 'nav.diff',
  'image-compressor': 'nav.imageCompressor',
  'json-to-ts': 'nav.jsonTs',
  'json-schema-generator': 'nav.jsonSchema',
  'function-calling-builder': 'nav.functionBuilder',
  'token-counter': 'nav.tokenCounter',
  'llm-optimizer': 'nav.llmOptimizer',
  'prompt-wrapper': 'nav.promptWrapper',
  'chunking-simulator': 'nav.chunkingSimulator',
  'system-prompt': 'nav.systemPrompt',
  'prompt-variable-injector': 'nav.promptInjector',
  'prompt-token-splitter': 'nav.promptSplitter',
  'llm-parameter-playground': 'nav.llmPlayground',
  'xml-guardrail-generator': 'nav.xmlGuardrail',
  'few-shot-builder': 'nav.fewShotBuilder',
};

const BLOG_TITLE_KEYS: Record<string, string> = {
  'why-typescript-interfaces-matter': 'blog.why-default.title',
  'regex-mastery-for-developers': 'blog.regex.title',
  'secure-password-generation': 'blog.crypto.title',
  'jwt-security-principles': 'blog.jwt.title',
  'understanding-base64': 'blog.base64.title',
  'webassembly-and-local-processing': 'blog.wasm.title',
  'json-parsing-strategies': 'blog.json.title',
  'prompt-engineering-best-practices': 'blog.prompt.title',
  'uuid-version-differences': 'blog.uuid.title',
  'diff-algorithms-explained': 'blog.diff.title',
  'optimizing-web-apps': 'blog.react.title',
  'regex-performance-backtracking': 'blog.backtrack.title',
  'understanding-unix-epoch': 'blog.unix.title',
  'the-math-behind-qr-codes': 'blog.qr.title',
};

const STATIC_PAGE_KEYS: Record<string, string> = {
  about: 'footer.about',
  privacy: 'footer.privacy',
  terms: 'footer.terms',
  contact: 'footer.contact',
  donate: 'footer.donate',
};

export function Breadcrumbs() {
  const location = useLocation();
  const { lang } = useParams();
  const { t } = useTranslation();

  const currentLang = lang || 'en';
  const basePath = currentLang === 'en' ? '' : `/${currentLang}`;
  const homePath = basePath || '/';

  // Extract segments ignoring language prefix
  const rawSegments = location.pathname.split('/').filter(Boolean);
  const segments = (rawSegments.length > 0 && ['en', 'ko', 'ja'].includes(rawSegments[0]))
    ? rawSegments.slice(1)
    : rawSegments;

  // Don't render breadcrumbs on homepage
  if (segments.length === 0) {
    return null;
  }

  const items: BreadcrumbItem[] = [
    {
      label: t('nav.home') || 'Home',
      path: homePath,
    },
  ];

  const firstSeg = segments[0];

  if (firstSeg === 'blog') {
    const blogIndexPath = `${basePath}/blog`;
    if (segments.length === 1) {
      // /blog
      items.push({
        label: t('footer.blog') || 'Tech Blog',
      });
    } else {
      // /blog/:id
      const postSlug = segments[1];
      const blogTitleKey = BLOG_TITLE_KEYS[postSlug];
      const translatedTitle = blogTitleKey ? t(blogTitleKey) : postSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      items.push({
        label: t('footer.blog') || 'Tech Blog',
        path: blogIndexPath,
      });
      items.push({
        label: translatedTitle,
      });
    }
  } else if (TOOL_TITLE_KEYS[firstSeg]) {
    // Tool page: Home -> Category (optional/implied) -> Tool Name
    const toolTitle = t(TOOL_TITLE_KEYS[firstSeg]) || firstSeg;
    items.push({
      label: toolTitle,
    });
  } else if (STATIC_PAGE_KEYS[firstSeg]) {
    const pageTitle = t(STATIC_PAGE_KEYS[firstSeg]) || firstSeg.charAt(0).toUpperCase() + firstSeg.slice(1);
    items.push({
      label: pageTitle,
    });
  } else {
    // Fallback: format slug to title case
    const fallbackTitle = firstSeg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    items.push({
      label: fallbackTitle,
    });
  }

  // Generate BreadcrumbList Schema for Google SEO Rich Snippets
  const baseUrl = 'https://www.zezelab.xyz';
  const schemaBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const itemUrl = isLast
        ? `${baseUrl}${location.pathname}`
        : `${baseUrl}${item.path}`;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: itemUrl,
      };
    }),
  };

  const isTool = Boolean(TOOL_TITLE_KEYS[firstSeg]);
  const currentToolId = isTool ? firstSeg : null;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schemaBreadcrumbs)}
        </script>
      </Helmet>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center space-x-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1 overflow-x-auto py-1 scrollbar-none"
        >
          <ol className="flex items-center space-x-1.5 list-none p-0 m-0">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isFirst = index === 0;

              return (
                <li key={index} className="flex items-center space-x-1.5 flex-shrink-0">
                  {index > 0 && (
                    <ChevronRight
                      className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="font-medium text-slate-800 dark:text-slate-200 max-w-[200px] sm:max-w-xs md:max-w-md truncate"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.path || '#'}
                      className="flex items-center text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                    >
                      {isFirst && <Home className="w-3.5 h-3.5 mr-1" aria-hidden="true" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {currentToolId && (
          <div className="flex items-center shrink-0">
            <FavoriteButton toolId={currentToolId} showLabel={true} size="sm" />
          </div>
        )}
      </div>
    </>
  );
}
