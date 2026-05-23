const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const targetStr = `    {
      name: t('nav.promptInjector') || 'Prompt Variable Injector',
      description: t('promptInjector.subtitle') || 'Dynamically inject variables into your AI prompt templates.',
      icon: Terminal,
      path: \\\`/\\\${currentLang}/prompt-variable-injector\\\`,
      color: 'bg-rose-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'template', 'injector', 'variables']
    },`;

const replacementStr = targetStr + `
    {
      name: t('nav.promptSplitter') || 'Prompt Token Splitter',
      description: t('promptSplitter.subtitle') || 'Split long texts into smaller LLM-friendly chunks.',
      icon: Layers,
      path: \\\`/\\\${currentLang}/prompt-token-splitter\\\`,
      color: 'bg-purple-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'split', 'chunk', 'tokens', 'limit']
    },`;

code = code.replace(/    \{\s*name: t\('nav\.promptInjector'\) \|\| 'Prompt Variable Injector',[\s\S]*?keywords: \['ai', 'prompt', 'template', 'injector', 'variables'\]\s*\},/, replacementStr);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log('patched home.tsx');
