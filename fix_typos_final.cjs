const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  content = content.replace(/text-[a-z]+-\d+text-([a-z]+-\d+)/g, 'text-$1');
  content = content.replace(/text-xs font-bold text-xs font-bold/g, 'text-xs font-bold');
  content = content.replace(/flex items-center flex items-center/g, 'flex items-center');
  content = content.replace(/mr-1\.5 w-4 h-4 mr-1\.5/g, 'mr-1.5 w-4 h-4');
  content = content.replace(/h-8 w-8 h-8 w-8/g, 'h-8 w-8');
  content = content.replace(/mr-3 h-8 w-8 mr-3 h-8 w-8/g, 'mr-3 h-8 w-8');
  content = content.replace(/w-16 h-16 w-16 h-16/g, 'w-16 h-16');

  // Any remaining hover background fixes needed?
  // Text blue missing dark in JsonFormatter lines 861 and 869
  content = content.replace(/text-blue-600' : 'text-gray-500/g, 'text-blue-600 dark:text-blue-400\' : \'text-gray-500');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
