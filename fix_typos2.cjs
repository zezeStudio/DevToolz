const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  content = content.replace(/text-red-70text-red-600 dark:text-red-400/g, 'text-red-700 dark:text-red-400');
  content = content.replace(/text-sm text-sm/g, 'text-sm');
  content = content.replace(/text-blue-60text-blue-600 dark:text-blue-400/g, 'text-blue-600 dark:text-blue-400');
  content = content.replace(/text-blue-600 dark:text-blue-400 hover:/g, 'text-blue-600 dark:text-blue-400 hover:'); // just checking

  content = content.replace(/hover:bg-([a-z]+)-50 dark:bg-\1-900\/([0-9]+)/g, 'hover:bg-$1-50 dark:hover:bg-$1-900/$2');

  // Also in CookieConsent.tsx
  // text-blue-60text-blue-600 dark:text-blue-400 bg-white hover:flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-60text-blue-600 dark:text-blue-400 bg-white hover:bg-blue-50
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
