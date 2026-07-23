const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const itemListSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "name": "DevToolz",
          "url": "https://www.zezelab.xyz/",
          "description": "Free online developer utilities and AI prompt engineering tools."
        },
        {
          "@type": "ItemList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "JSON Formatter", "url": "https://www.zezelab.xyz/en/json-formatter"},
            {"@type": "ListItem", "position": 2, "name": "Password Generator", "url": "https://www.zezelab.xyz/en/password-generator"},
            {"@type": "ListItem", "position": 3, "name": "Base64 Encoder", "url": "https://www.zezelab.xyz/en/base64-converter"},
            {"@type": "ListItem", "position": 4, "name": "Text Analyzer", "url": "https://www.zezelab.xyz/en/text-analyzer"},
            {"@type": "ListItem", "position": 5, "name": "Markdown Editor", "url": "https://www.zezelab.xyz/en/markdown-editor"},
            {"@type": "ListItem", "position": 6, "name": "Regex Tester", "url": "https://www.zezelab.xyz/en/regex-tester"},
            {"@type": "ListItem", "position": 7, "name": "URL Encoder", "url": "https://www.zezelab.xyz/en/url-encoder"},
            {"@type": "ListItem", "position": 8, "name": "JWT Decoder", "url": "https://www.zezelab.xyz/en/jwt-decoder"},
            {"@type": "ListItem", "position": 9, "name": "Color Converter", "url": "https://www.zezelab.xyz/en/color-converter"},
            {"@type": "ListItem", "position": 10, "name": "UUID Generator", "url": "https://www.zezelab.xyz/en/uuid-generator"}
          ]
        }
      ]
    }
    </script>
`;

html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, itemListSchema);
fs.writeFileSync(indexPath, html);
console.log('Fixed JSON-LD in index.html');
