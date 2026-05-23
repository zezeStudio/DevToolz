const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importStr = `const PromptTokenSplitter = lazy(() => import('./pages/PromptTokenSplitter').then(m => ({ default: m.PromptTokenSplitter })));`;
code = code.replace(`const PrivacyPolicy = lazy`, importStr + '\nconst PrivacyPolicy = lazy');

const routeStr = `              <Route path="prompt-token-splitter" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptTokenSplitter />
                </Suspense>
              } />`;
code = code.replace(`              <Route path="privacy-policy"`, routeStr + '\n              <Route path="privacy-policy"');

fs.writeFileSync('src/App.tsx', code);
console.log('patched app.tsx');
