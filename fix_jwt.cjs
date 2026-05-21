const fs = require('fs');

let content = fs.readFileSync('src/pages/JwtDecoder.tsx', 'utf-8');

// Fixing the /30/30 typo I created
content = content.replace(/\/30\/30/g, '/30');

// Red header
content = content.replace('border-b border-red-100', 'border-b border-red-100 dark:border-red-900/50');
content = content.replace('text-red-900', 'text-red-900 dark:text-red-200');
content = content.replace('text-red-900 text-red-900 dark:text-red-200', 'text-red-900 dark:text-red-200'); // in case of duplicate
content = content.replace('text-red-900\' : \'border-gray-300', 'text-red-900 dark:text-red-200\' : \'border-gray-300');

// Purple header & payload
content = content.replace('bg-purple-50 px-4', 'bg-purple-50 dark:bg-purple-900/30 px-4');
content = content.replace('border-b border-purple-100', 'border-b border-purple-100 dark:border-purple-900/50');
content = content.replace('text-purple-800', 'text-purple-800 dark:text-purple-300');
content = content.replace('text-purple-900', 'text-purple-900 dark:text-purple-200');

// Purple buttons
content = content.replace(/text-purple-600 hover:text-purple-800 bg-purple-50/g, 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/50');
content = content.replace(/border border-purple-100/g, 'border border-purple-100 dark:border-purple-800/50');

// textarea purple
content = content.replace('bg-purple-50/30', 'bg-purple-50/30 dark:bg-purple-900/30');

// Blue header & payload
content = content.replace('border-b border-blue-100', 'border-b border-blue-100 dark:border-blue-900/50');
content = content.replace(/text-blue-800/g, 'text-blue-800 dark:text-blue-300');

// Teal help section
content = content.replace('bg-teal-50 rounded-xl p-6 border border-teal-100', 'bg-teal-50 dark:bg-teal-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-900/50');
content = content.replace('text-teal-900', 'text-teal-900 dark:text-teal-300');
content = content.replace('text-teal-800', 'text-teal-800 dark:text-teal-400');

fs.writeFileSync('src/pages/JwtDecoder.tsx', content);
console.log('Fixed JwtDecoder');
