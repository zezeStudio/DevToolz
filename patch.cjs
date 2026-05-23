const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement = `              <Route path="prompt-variable-injector" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptVariableInjector />
                </Suspense>
              } />
              <Route path="llm-parameter-playground" element={
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
              } />
              <Route path="prompt-token-splitter" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptTokenSplitter />
                </Suspense>
              } />
              <Route path="privacy" element={`;

const target = `              <Route path="prompt-variable-injector" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptVariableInjector />
                </Suspense>
              } />
              <Route path="privacy" element={`;

code = code.split(target).join(replacement);

fs.writeFileSync('src/App.tsx', code);
console.log('patched');
