const fs = require('fs');

let content = fs.readFileSync('vite.config.ts', 'utf-8');

content = content.replace(
  "dynamicRoutes: routes,",
  "dynamicRoutes: routes,\n        outDir: 'dist',"
);

fs.writeFileSync('vite.config.ts', content);
