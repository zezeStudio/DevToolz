import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { createRequire } from 'module';
import Sitemap from 'vite-plugin-sitemap';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  
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
    '/en/llm-optimizer', '/ko/llm-optimizer', '/ja/llm-optimizer',
    '/en/prompt-wrapper', '/ko/prompt-wrapper', '/ja/prompt-wrapper',
    '/en/chunking-simulator', '/ko/chunking-simulator', '/ja/chunking-simulator',
    '/en/prompt-variable-injector', '/ko/prompt-variable-injector', '/ja/prompt-variable-injector',
    '/en/prompt-token-splitter', '/ko/prompt-token-splitter', '/ja/prompt-token-splitter',
    '/en/llm-parameter-playground', '/ko/llm-parameter-playground', '/ja/llm-parameter-playground',
    '/en/xml-guardrail-generator', '/ko/xml-guardrail-generator', '/ja/xml-guardrail-generator',
    '/en/few-shot-builder', '/ko/few-shot-builder', '/ja/few-shot-builder',
    '/en/system-prompt', '/ko/system-prompt', '/ja/system-prompt',
    '/en/privacy', '/ko/privacy', '/ja/privacy',
    '/en/terms', '/ko/terms', '/ja/terms',
    '/en/contact', '/ko/contact', '/ja/contact'
  ];

  return {
    plugins: [
      react(), 
      tailwindcss()
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
