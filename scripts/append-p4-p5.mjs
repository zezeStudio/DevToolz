import fs from 'fs';
import path from 'path';

const tools = ['json', 'pass', 'text', 'base64', 'url', 'jwt', 'color', 'markdown', 'uuid', 'hash', 'unix', 'qr', 'regex', 'diff', 'imageCompressor'];
const pagesDir = 'src/pages';
const files = fs.readdirSync(pagesDir);

files.forEach(file => {
  if (!file.endsWith('.tsx')) return;
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  tools.forEach(tool => {
    if (content.includes(`t('${tool}.longDesc.p3')`)) {
      if (content.includes(`t('${tool}.longDesc.p4')`)) return; // already added

      // There are 3 variations of p3 render
      // 1: <p dangerouslySetInnerHTML={{ __html: t('uuid.longDesc.p3') }}></p>
      const v1 = new RegExp(`(<p dangerouslySetInnerHTML=\\{\\{ __html: t\\('${tool}\\.longDesc\\.p3'\\) \\}\\}\\><\\/p>)`);
      if (v1.test(content)) {
        content = content.replace(v1, `$1\n            <p dangerouslySetInnerHTML={{ __html: t('${tool}.longDesc.p4') }} className="mt-4"></p>\n            <p dangerouslySetInnerHTML={{ __html: t('${tool}.longDesc.p5') }} className="mt-4"></p>`);
      } 
      // 2: <p>{t('regex.longDesc.p3')}</p>
      else if (content.includes(`<p>{t('${tool}.longDesc.p3')}</p>`)) {
        const v2 = new RegExp(`(<p>\\{t\\('${tool}\\.longDesc\\.p3'\\)\\}<\\/p>)`);
        content = content.replace(v2, `$1\n          <p className="mt-4 leading-relaxed">{t('${tool}.longDesc.p4')}</p>\n          <p className="mt-4 leading-relaxed">{t('${tool}.longDesc.p5')}</p>`);
      }
      // 3: <Markdown>{t('color.longDesc.p3')}</Markdown>
      else if (content.includes(`<Markdown>{t('${tool}.longDesc.p3')}</Markdown>`)) {
        const v3 = new RegExp(`(<Markdown>\\{t\\('${tool}\\.longDesc\\.p3'\\)\\}\\<\\/Markdown>)`);
        content = content.replace(v3, `$1\n              <div className="mt-4"><Markdown>{t('${tool}.longDesc.p4')}</Markdown></div>\n              <div className="mt-4"><Markdown>{t('${tool}.longDesc.p5')}</Markdown></div>`);
      }
      // 4: complex split map
      else {
        const v4 = new RegExp(`(<p[^>]*>[\\s\\S]*?t\\('${tool}\\.longDesc\\.p3'[\\s\\S]*?<\\/p>)`);
        content = content.replace(v4, `$1\n              <p className="mt-4 leading-relaxed">\n                {t('${tool}.longDesc.p4')}\n              </p>\n              <p className="mt-4 leading-relaxed">\n                {t('${tool}.longDesc.p5')}\n              </p>`);
      }
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');
});
