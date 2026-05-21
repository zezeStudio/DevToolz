const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/pages/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Fix messed up text colors
  content = content.replace(/text-[a-z]+-60text-[a-z]+-600 dark:text-[a-z]+-400/g, match => {
    return match.replace(/text-[a-z]+-60/, ''); // removes the weird part
  });
  
  content = content.replace(/text-red-70text-red-600 dark:text-red-400/g, 'text-red-700 dark:text-red-400');
  content = content.replace(/text-sm text-sm/g, 'text-sm');
  content = content.replace(/text-blue-60text-blue-600 dark:text-blue-400/g, 'text-blue-600 dark:text-blue-400');
  
  // Fix hover:bg-... dark:bg-... instead of dark:hover:bg-...
  content = content.replace(/hover:bg-([a-z]+)-50 dark:bg-\1-900\/([0-9]+)/g, 'hover:bg-$1-50 dark:hover:bg-$1-900/$2');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
