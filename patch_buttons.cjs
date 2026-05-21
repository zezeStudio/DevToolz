const fs = require('fs');

let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

content = content.replace(
  'className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"',
  'className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"'
);

// fix wand button
content = content.replace(
  'className="h-9 w-9 bg-purple-100 hover:bg-purple-200 text-purple-600 dark:text-purple-400 rounded-lg transition-colors border border-purple-200 flex items-center justify-center shrink-0"',
  'className="h-9 w-9 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800 text-purple-600 dark:text-purple-400 rounded-lg transition-colors border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0"'
);

// fix wand sr-only
content = content.replace(
  '<Wand2 className="w-4 h-4" />',
  '<Wand2 className="w-4 h-4" /> <span className="sr-only">Fix JSON</span>'
);

// fix tree button
content = content.replace(
  'className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors border border-indigo-200 flex items-center justify-center shrink-0"',
  'className="h-9 w-9 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800 flex items-center justify-center shrink-0"'
);

// fix tree sr-only
content = content.replace(
  '<ListTree className="w-4 h-4" />',
  '<ListTree className="w-4 h-4" /> <span className="sr-only">Sort Keys</span>'
);


fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
