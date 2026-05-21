const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  const colors = ['purple', 'pink', 'orange', 'cyan', 'yellow', 'teal', 'blue', 'green', 'red'];
  
  colors.forEach(color => {
    // 1. Backgrounds: bg-color-50 -> dark:bg-color-900/20  (if not already present)
    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:bg-${color}).)*?)(bg-${color}-50(?:\\/50)?\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      // It's safer to just inject it right after the match if dark:bg is not present
      return `className=${q1}${before}${match} dark:bg-${color}-900/20${after}${q2}`;
    });

    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:hover:bg-${color}).)*?)(hover:bg-${color}-50\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      return `className=${q1}${before}${match} dark:hover:bg-${color}-900/30${after}${q2}`;
    });

    // 2. Borders: border-color-100 -> dark:border-color-900/50
    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:border-${color}).)*?)(border-${color}-100\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      return `className=${q1}${before}${match} dark:border-${color}-900/50${after}${q2}`;
    });

    // 3. Texts: text-color-900 -> dark:text-color-300
    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:text-${color}).)*?)(text-${color}-900\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      return `className=${q1}${before}${match} dark:text-${color}-300${after}${q2}`;
    });

    // text-color-800 -> dark:text-color-400
    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:text-${color}).)*?)(text-${color}-800\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      return `className=${q1}${before}${match} dark:text-${color}-400${after}${q2}`;
    });

    // text-color-700 -> dark:text-color-400
    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:text-${color}).)*?)(text-${color}-700\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      return `className=${q1}${before}${match} dark:text-${color}-400${after}${q2}`;
    });

    // text-color-600 -> dark:text-color-400
    content = content.replace(new RegExp(`className=(["'\`])(((?!dark:text-${color}).)*?)(text-${color}-600\\b)(?!.*dark:)(.*?)(["'\`])`, 'g'), 
                              (m, q1, before, match, _, after, q2) => {
      return `className=${q1}${before}${match} dark:text-${color}-400${after}${q2}`;
    });
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log('Fixed colored panels in', file);
  }
});
