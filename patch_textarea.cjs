const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

content = content.replace(
  /placeholder=""/g,
  "`placeholder={t('json.outputPlaceholder')}`"
);

// Ah wait, it's not backticks, just `{t('json.outputPlaceholder')}`
content = content.replace(
  "`placeholder={t('json.outputPlaceholder')}`",
  "placeholder={t('json.outputPlaceholder')}"
);

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
