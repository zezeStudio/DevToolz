const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/pages/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('prose-') && !content.includes('dark:prose-invert')) {
     content = content.replace(/prose (prose-[a-z]+) max-w-none/g, 'prose $1 dark:prose-invert max-w-none');
     content = content.replace(/prose (prose-[a-z]+) dark:prose-invert max-w-none/g, 'prose $1 dark:prose-invert max-w-none');
     fs.writeFileSync(file, content);
     console.log('Fixed prose in ', file);
  }
});
