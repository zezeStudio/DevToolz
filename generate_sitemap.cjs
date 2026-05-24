const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://www.zezelab.xyz';
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

const blogIds = [
  'why-typescript-interfaces-matter',
  'regex-mastery-for-developers',
  'secure-password-generation',
  'jwt-security-principles',
  'understanding-base64',
  'webassembly-and-local-processing',
  'json-parsing-strategies',
  'prompt-engineering-best-practices',
  'uuid-version-differences',
  'diff-algorithms-explained',
  'optimizing-web-apps',
  'regex-performance-backtracking',
  'understanding-unix-epoch',
  'the-math-behind-qr-codes'
];

blogIds.forEach(id => baseRoutes.push(`blog/${id}`));

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  baseRoutes.forEach(route => {
    // For each route, generate a block for each language
    LANGUAGES.forEach(lang => {
      const currentUrl = `${DOMAIN}/${lang}${route ? `/${route}` : ''}`;
      
      xml += `  <url>
    <loc>${currentUrl}</loc>
`;
      // hreflang tags
      LANGUAGES.forEach(altLang => {
        const altUrl = `${DOMAIN}/${altLang}${route ? `/${route}` : ''}`;
        xml += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}"/>
`;
      });
      // x-default using 'en'
      const defaultUrl = `${DOMAIN}/en${route ? `/${route}` : ''}`;
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>
  </url>
`;
    });
  });

  xml += `</urlset>`;

  return xml;
}

const sitemapContent = generateSitemap();
const publicSitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(publicSitemapPath, sitemapContent);
console.log('Successfully generated sitemap.xml with hreflang tags in public folder.');
