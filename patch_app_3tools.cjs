const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const imports = `const LlmParameterPlayground = lazy(() => import('./pages/LlmParameterPlayground').then(m => ({ default: m.LlmParameterPlayground })));
const XmlGuardrailGenerator = lazy(() => import('./pages/XmlGuardrailGenerator').then(m => ({ default: m.XmlGuardrailGenerator })));
const FewShotBuilder = lazy(() => import('./pages/FewShotBuilder').then(m => ({ default: m.FewShotBuilder })));`;

code = code.replace(`const PromptTokenSplitter = lazy`, imports + '\nconst PromptTokenSplitter = lazy');

const routes = `              <Route path="llm-parameter-playground" element={
                <Suspense fallback={<PageLoader />}>
                  <LlmParameterPlayground />
                </Suspense>
              } />
              <Route path="xml-guardrail-generator" element={
                <Suspense fallback={<PageLoader />}>
                  <XmlGuardrailGenerator />
                </Suspense>
              } />
              <Route path="few-shot-builder" element={
                <Suspense fallback={<PageLoader />}>
                  <FewShotBuilder />
                </Suspense>
              } />`;

code = code.replace(`              <Route path="prompt-token-splitter"`, routes + '\n              <Route path="prompt-token-splitter"');

fs.writeFileSync('src/App.tsx', code);
console.log('patched app.tsx for 3 tools');
