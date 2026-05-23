const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const targetStr = `{ name: t('nav.promptSplitter') || 'Prompt Splitter', path: \\\`/\\\${currentLang}/prompt-token-splitter\\\`, icon: Layers },`;

const replacementStr = `{ name: t('nav.promptSplitter') || 'Prompt Splitter', path: \\\`/\\\${currentLang}/prompt-token-splitter\\\`, icon: Layers },
        { name: t('nav.llmPlayground') || 'LLM Playground', path: \\\`/\\\${currentLang}/llm-parameter-playground\\\`, icon: Terminal },
        { name: t('nav.xmlGuardrail') || 'XML Guardrail', path: \\\`/\\\${currentLang}/xml-guardrail-generator\\\`, icon: Terminal },
        { name: t('nav.fewShotBuilder') || 'Few-Shot Builder', path: \\\`/\\\${currentLang}/few-shot-builder\\\`, icon: Terminal },`;

code = code.replace(/{ name: t\('nav\.promptSplitter'\)[\s\S]*?icon: Layers \},/, replacementStr);

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('patched layout.tsx');
