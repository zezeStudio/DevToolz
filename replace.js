const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replaceAll(
  '<Route path="json-to-ts" element={',
  '<Route path="json-schema-generator" element={<Suspense fallback={<PageLoader />}><JsonSchemaGenerator /></Suspense>} />\n              <Route path="json-to-ts" element={'
);
fs.writeFileSync('src/App.tsx', code);
