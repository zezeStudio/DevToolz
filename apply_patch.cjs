const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, 'src', 'lib', 'i18n.ts');
let i18nContent = fs.readFileSync(i18nPath, 'utf8');

const locales = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales_patch.json'), 'utf8'));

for (const [lang, data] of Object.entries(locales)) {
  for (const [key, val] of Object.entries(data)) {
    const insertString = '      "' + key + '": ' + JSON.stringify(val) + ',\n';
    if (lang === 'en') {
      i18nContent = i18nContent.replace(
        /("en":\s*\{\s*translation:\s*\{[\s\S]*?)(\s*"about\.title":)/,
        (match, p1, p2) => p1 + insertString + p2
      );
    } else if (lang === 'ko') {
      i18nContent = i18nContent.replace(
        /("ko":\s*\{\s*translation:\s*\{[\s\S]*?)(\s*"about\.title":)/,
        (match, p1, p2) => p1 + insertString + p2
      );
    } else if (lang === 'ja') {
      i18nContent = i18nContent.replace(
        /("ja":\s*\{\s*translation:\s*\{[\s\S]*?)(\s*"about\.title":)/,
        (match, p1, p2) => p1 + insertString + p2
      );
    }
  }
}

fs.writeFileSync(i18nPath, i18nContent, 'utf8');
console.log("Successfully patched i18n.ts");
