const fs = require('fs');
let content = fs.readFileSync('src/pages/PasswordGenerator.tsx', 'utf-8');

// Missing dark mode classes in PasswordGenerator.tsx
content = content.replace(/bg-gradient-to-br from-gray-50 to-white/g, 'bg-gradient-to-br from-gray-50 dark:from-gray-800 to-white dark:to-gray-900');
content = content.replace(/border-gray-100(?! dark:)/g, 'border-gray-100 dark:border-gray-700');
content = content.replace(/hover:bg-green-100(?! dark:)/g, 'hover:bg-green-100 dark:hover:bg-green-900/40');
content = content.replace(/bg-amber-50(?! dark:)/g, 'bg-amber-50 dark:bg-amber-900/20');
content = content.replace(/border-amber-100(?! dark:)/g, 'border-amber-100 dark:border-amber-900/50');
content = content.replace(/shadow-green-100(?! dark:)/g, 'shadow-green-100 dark:shadow-none');
content = content.replace(/shadow-green-200(?! dark:)/g, 'shadow-green-200 dark:shadow-none');
content = content.replace(/border-4 border-gray-50(?! dark:)/g, 'border-4 border-gray-50 dark:border-gray-700');
content = content.replace(/bg-green-100/g, 'bg-green-100 dark:bg-green-900/30');
content = content.replace(/bg-green-100 dark:bg-green-900\/30 dark:bg-green-900\/30/g, 'bg-green-100 dark:bg-green-900/30');

// There are more cases like `border-2 border-gray-50`?
content = content.replace(/border-gray-50/g, 'border-gray-50 dark:border-gray-700');
content = content.replace(/border-gray-50 dark:border-gray-700 dark:border-gray-700/g, 'border-gray-50 dark:border-gray-700');

fs.writeFileSync('src/pages/PasswordGenerator.tsx', content);
console.log('Fixed PasswordGenerator');
