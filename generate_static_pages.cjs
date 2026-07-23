const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

console.log('Compiling blog data for static rendering...');
esbuild.buildSync({
  entryPoints: [
    'src/pages/blogData.tsx', 
    'src/pages/blogDataKo.tsx', 
    'src/pages/blogDataJa.tsx'
  ],
  bundle: true,
  outdir: 'temp_build',
  format: 'cjs',
  jsx: 'automatic',
  external: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
  outExtension: { '.js': '.cjs' }
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const { blogArticles } = require('./temp_build/blogData.cjs');
const { blogArticlesKo } = require('./temp_build/blogDataKo.cjs');
const { blogArticlesJa } = require('./temp_build/blogDataJa.cjs');

const LANGUAGES = ['en', 'ko', 'ja'];
const baseRoutes = [
  '',
  'json-formatter',
  'password-generator',
  'text-analyzer',
  'base64-converter',
  'url-encoder',
  'jwt-decoder',
  'color-converter',
  'markdown-editor',
  'uuid-generator',
  'hash-generator',
  'unix-timestamp',
  'qr-code',
  'regex-tester',
  'diff-checker',
  'image-compressor',
  'json-to-ts',
  'json-schema-generator',
  'function-calling-builder',
  'token-counter',
  'llm-optimizer',
  'prompt-wrapper',
  'chunking-simulator',
  'prompt-variable-injector',
  'prompt-token-splitter',
  'llm-parameter-playground',
  'xml-guardrail-generator',
  'few-shot-builder',
  'system-prompt',
  'blog',
  'privacy',
  'terms',
  'contact',
  'about'
];

const blogIds = Object.keys(blogArticles);
blogIds.forEach(id => baseRoutes.push(`blog/${id}`));

const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

function createStaticPage(route, lang) {
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  const fullRoute = `${langPrefix}${route ? `/${route}` : ''}`;
  const dir = path.join(__dirname, 'dist', fullRoute);
  fs.mkdirSync(dir, { recursive: true });

  let pageTitle = 'DevToolz - Essential Dev Tools';
  let staticHtml = `<h1>${pageTitle}</h1><p>Welcome to DevToolz. Developer utilities for daily tasks.</p>`;

  if (route.startsWith('blog/')) {
    const id = route.split('/')[1];
    let articleData = blogArticles[id];
    if (lang === 'ko' && blogArticlesKo[id]) articleData = blogArticlesKo[id];
    if (lang === 'ja' && blogArticlesJa[id]) articleData = blogArticlesJa[id];
    
    if (articleData) {
      pageTitle = `${id} - DevToolz Blog`;
      try {
        staticHtml = ReactDOMServer.renderToString(articleData);
      } catch (e) {
        console.error(`Error rendering blog post ${id} in ${lang}:`, e);
      }
    }
  } else if (route === 'blog') {
    pageTitle = 'Blog - DevToolz';
    staticHtml = `<h1>DevToolz Blog</h1><p>Read our latest articles on development, tools, and AI.</p>`;
    // Add links to all posts
    staticHtml += '<ul>' + blogIds.map(id => `<li><a href="${langPrefix}/blog/${id}">${id}</a></li>`).join('') + '</ul>';
  } else if (route) {
    const toolName = route.replace(/-/g, ' ').toUpperCase();
    pageTitle = `${toolName} - DevToolz`;
    staticHtml = `<h1>${toolName}</h1><p>Use our free ${toolName} online tool securely in your browser.</p>
    <p>This is a free online developer utility for ${toolName}. It operates entirely in your browser without sending your data to any server, ensuring maximum privacy.</p>
    <h2>Features</h2>
    <ul>
      <li>Fast and secure</li>
      <li>No data leaves your device</li>
      <li>Free to use</li>
    </ul>`;
  }

  let newHtml = baseHtml.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  
  const currentUrl = `https://www.zezelab.xyz${fullRoute === '/' ? '' : fullRoute}`;
  newHtml = newHtml.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${currentUrl}" />`);
  
  const routeSuffix = route ? `/${route}` : '';
  newHtml = newHtml.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${currentUrl}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>/, `<link rel="alternate" hreflang="en" href="https://www.zezelab.xyz${routeSuffix}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="ko" href=".*?" \/>/, `<link rel="alternate" hreflang="ko" href="https://www.zezelab.xyz/ko${routeSuffix}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="ja" href=".*?" \/>/, `<link rel="alternate" hreflang="ja" href="https://www.zezelab.xyz/ja${routeSuffix}" />`);
  newHtml = newHtml.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/, `<link rel="alternate" hreflang="x-default" href="https://www.zezelab.xyz${routeSuffix}" />`);
  newHtml = newHtml.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${pageTitle}" />`);
  newHtml = newHtml.replace(/"url": "https:\/\/www\.zezelab\.xyz\/"/, `"url": "${currentUrl}"`);

  const staticBlock = `\n<div id="static-content" style="display:none; visibility:hidden;">\n${staticHtml}\n</div>\n`;
  newHtml = newHtml.replace('<body>', '<body>' + staticBlock);
  
  fs.writeFileSync(path.join(dir, 'index.html'), newHtml);
}

baseRoutes.forEach(route => {
  LANGUAGES.forEach(lang => {
    createStaticPage(route, lang);
  });
});

console.log('Static pages generated for AdFit/AdSense SEO!');

// Clean up temp_build directory
fs.rmSync(path.join(__dirname, 'temp_build'), { recursive: true, force: true });
