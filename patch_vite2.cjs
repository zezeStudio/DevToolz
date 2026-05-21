const fs = require('fs');

let content = fs.readFileSync('vite.config.ts', 'utf-8');

content = content.replace(
  "outDir: 'dist',",
  "outDir: './dist',"
);

fs.writeFileSync('vite.config.ts', content);
