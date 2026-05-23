const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');

const targetStr = `{ name: t('nav.promptInjector') || 'Prompt Injector', path: \\\`/\\\${currentLang}/prompt-variable-injector\\\`, icon: Terminal },`;

const replacementStr = `{ name: t('nav.promptInjector') || 'Prompt Injector', path: \\\`/\\\${currentLang}/prompt-variable-injector\\\`, icon: Terminal },
        { name: t('nav.promptSplitter') || 'Prompt Splitter', path: \\\`/\\\${currentLang}/prompt-token-splitter\\\`, icon: Layers },`;

code = code.replace(/{ name: t\('nav\.promptInjector'\) \|\| 'Prompt Injector', path: `\/\${currentLang}\/prompt-variable-injector`, icon: Terminal },/g, replacementStr);

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('patched layout.tsx');
