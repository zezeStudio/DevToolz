const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

// remove mt-8 from right panel help section
content = content.replace(
  '<div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-xl p-8 border border-blue-100 dark:border-blue-900/50 shadow-sm">',
  '<div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-8 border border-blue-100 dark:border-blue-900/50 shadow-sm">'
);

// remove mt-12 from SEO piece
content = content.replace(
  '<div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">',
  '<div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">'
);

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
