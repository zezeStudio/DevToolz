import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';

// Remove static content for SEO bots
const staticContent = document.getElementById('static-content');
if (staticContent) {
  staticContent.remove();
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
