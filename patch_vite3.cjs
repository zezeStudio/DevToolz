const fs = require('fs');

let content = fs.readFileSync('vite.config.ts', 'utf-8');

content = content.replace(
  /outDir: '\.\/dist',\n\s*/,
  ""
);
content = content.replace(
  /outDir: 'dist',\n\s*/,
  ""
);

fs.writeFileSync('vite.config.ts', content);
