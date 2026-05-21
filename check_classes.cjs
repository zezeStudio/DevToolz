const fs = require('fs');
const glob = require('glob');
const globPattern = 'src/**/*.tsx';
const files = require('glob').sync(globPattern);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const classMatches = content.match(/className=(?:["']([^"']*)["']|\{`([^`]*)`\}|\{"([^"]*)"\})/g);
  
  if (classMatches) {
    classMatches.forEach(match => {
      // Very basic parsing to get the string
      let classStr = match.replace(/^className=/, '').replace(/["'`{}]+/g, ' ');
      
      let hasBgWhite = classStr.includes('bg-white');
      let hasDarkBg = classStr.includes('dark:bg-');
      
      if (hasBgWhite && !hasDarkBg) {
        console.log(`${file}: MISSING dark:bg- FOR bg-white -> ${classStr}`);
      }
      
      let hasTextBlue = /text-blue-[4567]00/.test(classStr);
      let hasDarkTextBlue = /dark:text-blue-/.test(classStr) || /dark:text-gray-/.test(classStr) || /dark:text-white/.test(classStr);
      
      if (hasTextBlue && !hasDarkTextBlue) {
        console.log(`${file}: MISSING dark:text- FOR text-blue-X00 -> ${classStr}`);
      }
    });
  }
});
