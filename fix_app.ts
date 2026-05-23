import * as fs from 'fs';

const path = './src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const toReplace = `<Route path="image-compressor" element={
                <Suspense fallback={<PageLoader />}>
                  <ImageCompressor />
                </Suspense>
              } />`;

const replacement = `<Route path="image-compressor" element={
                <Suspense fallback={<PageLoader />}>
                  <ImageCompressor />
                </Suspense>
              } />
              <Route path="json-to-ts" element={
                <Suspense fallback={<PageLoader />}>
                  <JsonToTsConverter />
                </Suspense>
              } />
              <Route path="token-counter" element={
                <Suspense fallback={<PageLoader />}>
                  <TokenCounter />
                </Suspense>
              } />`;

content = content.split(toReplace).join(replacement);

fs.writeFileSync(path, content);
console.log('Fixed App.tsx routes');
