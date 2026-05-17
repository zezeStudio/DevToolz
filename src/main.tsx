import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';

const rootElement = document.getElementById('root');
if (rootElement?.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  const root = createRoot(rootElement!);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
