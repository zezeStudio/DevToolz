const fs = require('fs');

const glob = require('glob');
const files = glob.sync('src/pages/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  content = content.replace(/divide-gray-200"/g, 'divide-gray-200 dark:divide-gray-700"');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
