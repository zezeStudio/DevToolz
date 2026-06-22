const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replaceAll(
  '<Route path="json-schema-generator" element={<Suspense fallback={<PageLoader />}><JsonSchemaGenerator /></Suspense>} />',
  '<Route path="json-schema-generator" element={<Suspense fallback={<PageLoader />}><JsonSchemaGenerator /></Suspense>} />\n              <Route path="function-calling-builder" element={<Suspense fallback={<PageLoader />}><FunctionCallingBuilder /></Suspense>} />'
);
fs.writeFileSync('src/App.tsx', code);
