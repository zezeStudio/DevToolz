const i18next = require('i18next');
// load i18n
const i18nFile = require('fs').readFileSync('src/lib/i18n.ts', 'utf8');

const resourcesMatch = i18nFile.match(/const resources = ({[\s\S]*?});\n\ni18n/);
if (resourcesMatch) {
  const resourcesStr = resourcesMatch[1];
  const resources = eval('(' + resourcesStr + ')');
  i18next.init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });
  console.log("EN:", i18next.t('promptSplitter.guide.title', { lng: 'en' }));
  console.log("KO:", i18next.t('promptSplitter.guide.title', { lng: 'ko' }));
} else {
  console.log("NO MATCH");
}
