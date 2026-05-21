const fs = require('fs');
let content = fs.readFileSync('src/pages/PasswordGenerator.tsx', 'utf-8');

content = content.replace(/bg-gray-800 hover:bg-gray-900/g, 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500');
content = content.replace(/hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700/g, 'hover:bg-gray-100 dark:hover:bg-gray-700');

fs.writeFileSync('src/pages/PasswordGenerator.tsx', content);
console.log('Fixed PasswordGenerator 2');
