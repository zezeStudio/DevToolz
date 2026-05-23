const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `              <Route path="system-prompt" element={
                <Suspense fallback={<PageLoader />}>
                  <SystemPromptGenerator />
                </Suspense>
              } />`;
              
const replacement = target + `
              <Route path="prompt-variable-injector" element={
                <Suspense fallback={<PageLoader />}>
                  <PromptVariableInjector />
                </Suspense>
              } />`;

content = content.replace(new RegExp(target.replace(/[.*+?^$|{}()([\\]\\\\]/g, '\\\\$&'), 'g'), replacement);
fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated.');
