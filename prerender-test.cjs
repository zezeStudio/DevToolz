const Prerenderer = require('@prerenderer/prerenderer');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
const path = require('path');

const prerenderer = new Prerenderer({
  staticDir: path.join(__dirname, 'dist'),
  server: { host: 'localhost', port: 8085 },
  renderer: new PuppeteerRenderer({
    renderAfterDocumentEvent: 'render-event',
    renderAfterTime: 5000,
    maxConcurrentRoutes: 4,
    puppeteer: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    }
  })
});

prerenderer.initialize().then(() => {
  return prerenderer.renderRoutes([ '/en', '/ko' ]);
}).then(renderedRoutes => {
  console.log('Success!', renderedRoutes[0].html.length);
  prerenderer.destroy();
}).catch(err => {
  console.error('Prerender ERROR:', err);
  prerenderer.destroy();
});
