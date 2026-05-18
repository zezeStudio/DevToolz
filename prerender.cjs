const Prerenderer = require('@prerenderer/prerenderer');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
const path = require('path');
const fs = require('fs');

const routes = [
  '/', '/en', '/ko', '/ja',
  '/en/json-formatter', '/ko/json-formatter', '/ja/json-formatter',
  '/en/password-generator', '/ko/password-generator', '/ja/password-generator',
  '/en/text-analyzer', '/ko/text-analyzer', '/ja/text-analyzer',
  '/en/base64-converter', '/ko/base64-converter', '/ja/base64-converter',
  '/en/url-encoder', '/ko/url-encoder', '/ja/url-encoder',
  '/en/jwt-decoder', '/ko/jwt-decoder', '/ja/jwt-decoder',
  '/en/color-converter', '/ko/color-converter', '/ja/color-converter',
  '/en/markdown-editor', '/ko/markdown-editor', '/ja/markdown-editor',
  '/en/uuid-generator', '/ko/uuid-generator', '/ja/uuid-generator',
  '/en/hash-generator', '/ko/hash-generator', '/ja/hash-generator',
  '/en/unix-timestamp', '/ko/unix-timestamp', '/ja/unix-timestamp',
  '/en/qr-code', '/ko/qr-code', '/ja/qr-code',
  '/en/regex-tester', '/ko/regex-tester', '/ja/regex-tester',
  '/en/diff-checker', '/ko/diff-checker', '/ja/diff-checker',
  '/en/image-compressor', '/ko/image-compressor', '/ja/image-compressor',
  '/en/privacy', '/ko/privacy', '/ja/privacy',
  '/en/terms', '/ko/terms', '/ja/terms',
  '/en/contact', '/ko/contact', '/ja/contact'
];

async function prerender() {
  const prerenderer = new Prerenderer({
    staticDir: path.join(__dirname, 'dist'),
    server: { host: 'localhost', port: 8085 },
    renderer: new PuppeteerRenderer({
      renderAfterTime: 2000,
      maxConcurrentRoutes: 4,
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      }
    })
  });

  try {
    await prerenderer.initialize();
    
    // Process routes in batches
    for (let i = 0; i < routes.length; i += 5) {
        const batch = routes.slice(i, i + 5);
        console.log('Rendering batch:', batch);
        const renderedRoutes = await prerenderer.renderRoutes(batch);
        
        for (const render of renderedRoutes) {
           let routePath = render.route === '/' ? '/index.html' : `${render.route}.html`;
           
           const outputPath = path.join(__dirname, 'dist', routePath);
           const dir = path.dirname(outputPath);
           if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
           
           let html = render.html;
           html = html.replace(/http:\/\/localhost:8085/g, 'https://www.zezelab.xyz')
                      .replace(/http:\/\/127\.0\.0\.1:8085/g, 'https://www.zezelab.xyz');
           fs.writeFileSync(outputPath, html);
           console.log('Saved', routePath);
        }
    }
    
    prerenderer.destroy();
  } catch(err) {
    console.error('ERROR RENDER:', err);
    prerenderer.destroy();
  }
}

prerender();
