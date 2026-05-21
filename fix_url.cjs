const fs = require('fs');

const file = 'src/pages/UrlEncoder.tsx';
let content = fs.readFileSync(file, 'utf-8');

// fix toggles and dividers missing dark bg
content = content.replace(/bg-gray-300'}/g, "bg-gray-300 dark:bg-gray-600'}");
content = content.replace(/"h-6 w-px bg-gray-300 hidden sm:block"/g, '"h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"');

// fix buttons
content = content.replace(/bg-gray-800 hover:bg-gray-900/g, 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600');

// fix border
content = content.replace(/border-gray-100"/g, 'border-gray-100 dark:border-gray-700"');

// fix hover bg with duplicate darks
content = content.replace(/dark:hover:bg-gray-600 dark:bg-gray-700/g, 'dark:hover:bg-gray-700');
content = content.replace(/dark:hover:bg-gray-700 dark:bg-gray-900/g, 'dark:hover:bg-gray-700'); // Just dark:hover:bg-gray-700

// fix divide
content = content.replace(/divide-gray-200"/g, 'divide-gray-200 dark:divide-gray-700"');

fs.writeFileSync(file, content);
console.log('Fixed UrlEncoder');
