const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const match = code.match(/<Route path="\/:lang" element={<LanguageWrapper \/>}>\n([\s\S]*?)<\/Route>/);
if (match) {
  const innerRoutes = match[1];
  
  code = code.replace(/<Route path="\/:lang" element={<LanguageWrapper \/>}>\n[\s\S]*?<\/Route>/, 
    `<Route path="/:lang" element={<LanguageWrapper />}>\n${innerRoutes}</Route>\n            <Route path="/" element={<LanguageWrapper />}>\n${innerRoutes}</Route>`);
  
  // Remove RootRedirect
  code = code.replace(/<Route path="\*" element={<RootRedirect \/>} \/>\n/, '');
  code = code.replace(/function RootRedirect\(\) \{[\s\S]*?\}\n/, '');

  fs.writeFileSync('src/App.tsx', code);
  console.log('Done rewriting routes');
} else {
  console.log('Failed to match routes');
}
