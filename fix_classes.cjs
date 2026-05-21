const fs = require('fs');
const glob = require('glob');
const globPattern = 'src/**/*.tsx';
const files = require('glob').sync(globPattern);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Add dark:text-blue-400 after text-blue-500, text-blue-600, text-blue-700
  // if not already present in that className
  content = content.replace(/(className=(?:["']|\{`|\{"|'|\")([^"'\}`]*))((?:text-blue-[567]00))([^"'\}`]*)(["'\}])/g, (match, prefix, before, blueClass, after, suffix) => {
    const fullClassStr = match;
    if (fullClassStr.includes('dark:text-')) {
      return match;
    }
    changed = true;
    return `${prefix}${before}${blueClass} dark:text-blue-400${after}${suffix}`;
  });

  // Also replace some bg-blue-50 without dark version to dark:bg-blue-900/30
  content = content.replace(/(className=(?:["']|\{`|\{"|'|\")([^"'\}`]*))((?:bg-[a-z]+-[51]0))([^"'\}`]*)(["'\}])/g, (match, prefix, before, bgClass, after, suffix) => {
    const fullClassStr = match;
    if (fullClassStr.includes('dark:bg-') || fullClassStr.includes('dark:hover:bg-')) {
      return match;
    }
    // E.g. bg-blue-50 -> dark:bg-blue-900/30
    if (bgClass === 'bg-gray-50' || bgClass === 'bg-slate-50') {
      changed = true;
      return `${prefix}${before}${bgClass} dark:bg-gray-800${after}${suffix}`;
    }
    if (bgClass === 'bg-blue-50') {
      changed = true;
      return `${prefix}${before}${bgClass} dark:bg-blue-900/30${after}${suffix}`;
    }
    if (bgClass === 'bg-red-50') {
      changed = true;
      return `${prefix}${before}${bgClass} dark:bg-red-900/30${after}${suffix}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed classes in', file);
  }
});
