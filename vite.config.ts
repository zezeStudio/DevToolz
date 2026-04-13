import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const prerender = require('vite-plugin-prerender');
const JSDOMRenderer = require('@prerenderer/renderer-jsdom');

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      prerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: [
          '/en', '/ko', '/ja',
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
          '/en/privacy', '/ko/privacy', '/ja/privacy',
          '/en/terms', '/ko/terms', '/ja/terms',
          '/en/contact', '/ko/contact', '/ja/contact'
        ],
        renderer: new JSDOMRenderer({
          renderAfterDocumentEvent: 'render-event'
        }),
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            /http:\/\/localhost:3000/g,
            'https://devtoolz.app'
          );
          return renderedRoute;
        },
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
