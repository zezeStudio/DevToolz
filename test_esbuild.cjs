const esbuild = require('esbuild');
try {
  esbuild.buildSync({
    entryPoints: [
      'src/pages/blogData.tsx', 
      'src/pages/blogDataKo.tsx', 
      'src/pages/blogDataJa.tsx'
    ],
    bundle: true,
    outdir: 'temp_build',
    format: 'cjs',
    jsx: 'automatic',
    external: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    outExtension: { '.js': '.cjs' }
  });
  console.log('Build success');
  const { blogArticles } = require('./temp_build/blogData.cjs');
  const React = require('react');
  const ReactDOMServer = require('react-dom/server');
  const firstKey = Object.keys(blogArticles)[0];
  const html = ReactDOMServer.renderToString(blogArticles[firstKey]);
  console.log('Render success, length:', html.length);
} catch (e) {
  console.error(e);
}
