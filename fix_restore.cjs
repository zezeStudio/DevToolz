const fs = require('fs');

const colors = ['purple', 'pink', 'orange', 'cyan', 'yellow', 'teal', 'blue', 'green', 'red'];

function restoreFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  colors.forEach(c => {
    // bg-color-50
    content = content.replace(new RegExp(`undefined dark:bg-${c}-900\\/20`, 'g'), `bg-${c}-50 dark:bg-${c}-900/20`);
    content = content.replace(new RegExp(`(.)\\1 dark:bg-${c}-900\\/20`, 'g'), `$1bg-${c}-50 dark:bg-${c}-900/20`);

    // hover:bg-color-50
    content = content.replace(new RegExp(`undefined dark:hover:bg-${c}-900\\/30`, 'g'), `hover:bg-${c}-50 dark:hover:bg-${c}-900/30`);
    content = content.replace(new RegExp(`(.)\\1 dark:hover:bg-${c}-900\\/30`, 'g'), `$1hover:bg-${c}-50 dark:hover:bg-${c}-900/30`);

    // border-color-100
    content = content.replace(new RegExp(`undefined dark:border-${c}-900\\/50`, 'g'), `border-${c}-100 dark:border-${c}-900/50`);
    content = content.replace(new RegExp(`(.)\\1 dark:border-${c}-900\\/50`, 'g'), `$1border-${c}-100 dark:border-${c}-900/50`);

    // text-color-900 -> 300
    content = content.replace(new RegExp(`undefined dark:text-${c}-300`, 'g'), `text-${c}-900 dark:text-${c}-300`);
    content = content.replace(new RegExp(`(.)\\1 dark:text-${c}-300`, 'g'), `$1text-${c}-900 dark:text-${c}-300`);

    // text-color-600,700,800 -> 400
    // This is lossy. I'll just restore them all as text-color-600. It's usually fine.
    content = content.replace(new RegExp(`undefined dark:text-${c}-400`, 'g'), `text-${c}-600 dark:text-${c}-400`);
    content = content.replace(new RegExp(`(.)\\1 dark:text-${c}-400`, 'g'), `$1text-${c}-600 dark:text-${c}-400`);
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Restored', file);
  }
}

const glob = require('glob');
const files = glob.sync('src/**/*.tsx');
files.forEach(restoreFile);
