const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const targetStr = `    {
      name: t('nav.promptSplitter') || 'Prompt Token Splitter',
      description: t('promptSplitter.subtitle') || 'Split long texts into smaller LLM-friendly chunks.',
      icon: Layers,
      path: \`/\${currentLang}/prompt-token-splitter\`,
      color: 'bg-purple-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'split', 'chunk', 'tokens', 'limit']
    },`;

const appendStr = `
    {
      name: t('nav.llmPlayground') || 'LLM Parameter Playground',
      description: t('llmPlayground.subtitle') || 'Interactive guide to understand AI parameters.',
      icon: Layers,
      path: \`/\${currentLang}/llm-parameter-playground\`,
      color: 'bg-blue-500',
      category: 'ai',
      keywords: ['ai', 'llm', 'parameter', 'temperature', 'top-p', 'penalty']
    },
    {
      name: t('nav.xmlGuardrail') || 'XML Guardrail Generator',
      description: t('xmlGuardrail.subtitle') || 'Instantly generate XML system prompts.',
      icon: Terminal,
      path: \`/\${currentLang}/xml-guardrail-generator\`,
      color: 'bg-teal-500',
      category: 'ai',
      keywords: ['ai', 'prompt', 'xml', 'guardrail', 'system']
    },
    {
      name: t('nav.fewShotBuilder') || 'Few-Shot Example Builder',
      description: t('fewShotBuilder.subtitle') || 'Construct optimized few-shot examples.',
      icon: Layers,
      path: \`/\${currentLang}/few-shot-builder\`,
      color: 'bg-orange-500',
      category: 'ai',
      keywords: ['ai', 'few-shot', 'example', 'prompt', 'json', 'xml']
    },`;

code = code.replace(/    \{\s*name: t\('nav\.promptSplitter'\)[\s\S]*?keywords: \['ai', 'prompt', 'split', 'chunk', 'tokens', 'limit'\]\s*\},/, targetStr + appendStr);

fs.writeFileSync('src/pages/Home.tsx', code);
console.log('patched home.tsx for 3 tools');
