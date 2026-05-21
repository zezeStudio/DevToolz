const fs = require('fs');

let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

// 1. Add icons to import
const importPattern = /import \{ (.*?) \} from 'lucide-react';/;
content = content.replace(importPattern, "import { $1, Quote, FileCode } from 'lucide-react';");

// 2. Add escapeJson and unescapeJson functions BEFORE sortKeys
const escapeFuncs = `
  const escapeJson = () => {
    if (!input.trim()) return;
    try {
      try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        setOutput(JSON.stringify(minified));
        setIsValid(true);
        setError(null);
        setErrorLine(null);
      } catch {
        setOutput(JSON.stringify(input));
      }
    } catch (err) {
      // Ignore
    }
  };

  const unescapeJson = () => {
    if (!input.trim()) return;
    try {
      const parsedString = JSON.parse(input);
      if (typeof parsedString === 'string') {
        const parsedJson = JSON.parse(parsedString);
        setOutput(JSON.stringify(parsedJson, null, 2));
        setIsValid(true);
        setError(null);
        setErrorLine(null);
      } else {
        throw new Error("Input is not a valid escaped JSON string");
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setErrorLine(getErrorLine(errorMessage, input));
      setIsValid(false);
    }
  };

  const sortKeys = () => {`;

content = content.replace('  const sortKeys = () => {', escapeFuncs);

// 3. Update activeHelpGroup rendering
const toolsHelpOld = `<p className="mt-1"><strong>{t('json.maskBtn')}:</strong> {t('json.tip.mask')}</p>
                </div>
              )}`;

const toolsHelpNew = `<p className="mt-1"><strong>{t('json.maskBtn')}:</strong> {t('json.tip.mask')}</p>
                  <p className="mt-1"><strong>{t('json.escapeBtn')}:</strong> {t('json.tip.escape')}</p>
                  <p className="mt-1"><strong>{t('json.unescapeBtn')}:</strong> {t('json.tip.unescape')}</p>
                </div>
              )}`;

content = content.replace(toolsHelpOld, toolsHelpNew);

// 4. Update the buttons rendering
const buttonsOld = `<div className="flex gap-2">
                <button
                  onClick={validateJson}
                  title={t('json.tip.validate')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  {t('json.validateBtn')}
                </button>
                <button
                  onClick={maskData}
                  title={t('json.tip.mask')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {t('json.maskBtn')}
                </button>
                <button
                  onClick={sortKeys}
                  title={t('json.tip.sort')}
                  className="h-9 w-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0"
                >
                  <ListTree className="w-4 h-4" /> <span className="sr-only">Sort Keys</span>
                </button>
              </div>`;

const buttonsNew = `<div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={validateJson}
                    title={t('json.tip.validate')}
                    className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  >
                    {t('json.validateBtn')}
                  </button>
                  <button
                    onClick={maskData}
                    title={t('json.tip.mask')}
                    className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  >
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    {t('json.maskBtn')}
                  </button>
                  <button
                    onClick={sortKeys}
                    title={t('json.tip.sort')}
                    className="h-9 w-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0"
                  >
                    <ListTree className="w-4 h-4" /> <span className="sr-only">Sort Keys</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={escapeJson}
                    title={t('json.tip.escape')}
                    className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  >
                    <Quote className="w-3.5 h-3.5 mr-1" />
                    {t('json.escapeBtn')}
                  </button>
                  <button
                    onClick={unescapeJson}
                    title={t('json.tip.unescape')}
                    className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  >
                    <FileCode className="w-3.5 h-3.5 mr-1" />
                    {t('json.unescapeBtn')}
                  </button>
                </div>
              </div>`;

content = content.replace(buttonsOld, buttonsNew);

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);

console.log("Replaced:", content.includes(buttonsNew));
