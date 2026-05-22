import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { Terminal, Copy, Check, Plus, Trash, Trash2, Wand2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface SchemaField {
  key: string;
  type: string;
  description: string;
}

export function SystemPromptGenerator() {
  const { t } = useTranslation();
  const [role, setRole] = useState('');
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [copied, setCopied] = useState(false);

  const addField = () => setFields([...fields, { key: '', type: 'string', description: '' }]);
  const updateField = (index: number, f: Partial<SchemaField>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...f };
    setFields(newFields);
  };
  const removeField = (index: number) => setFields(fields.filter((_, i) => i !== index));

  const generatePrompt = () => {
    let validFields = fields.filter(f => f.key.trim() !== '');
    let jsonLines = ['{'];
    validFields.forEach((f, index) => {
      const isLast = index === validFields.length - 1;
      const safeKey = JSON.stringify(f.key);
      const descPart = f.description ? ` ${f.description}` : '';
      jsonLines.push(`  ${safeKey}: "<${f.type}>${descPart}"${isLast ? '' : ','}`);
    });
    jsonLines.push('}');

    return `${role}

You must respond ONLY in valid JSON format. Do not include any other text, markdown formatting, or explanations. 

Your JSON response must follow this exact schema:
\`\`\`json
${jsonLines.join('\n')}
\`\`\`

Ensure that your output is properly formatted JSON that can be parsed by JSON.parse() without errors.
`;
  };

  const handleSample = () => {
    setRole('You are an advanced product data extraction assistant. Extract product details from the user text and structure it accordingly.');
    setFields([
      { key: 'productName', type: 'string', description: 'The exact name of the product' },
      { key: 'price', type: 'number', description: 'The price in USD (numeric only)' },
      { key: 'inStock', type: 'boolean', description: 'True if the item is in stock' },
      { key: 'tags', type: 'array', description: 'Array of category tags' }
    ]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setRole('');
    setFields([]);
  };

  const { lang } = useParams();
  const currentLang = lang || 'en';

  return (
    <div className="max-w-7xl mx-auto">
      <SEO 
        title={t('systemPrompt.seoTitle') || 'JSON System Prompt Generator | DevToolz'}
        description="Generate AI system prompts enforcing strict JSON output formats." 
        url={`/${currentLang}/system-prompt`}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <Terminal className="mr-3 h-8 w-8 text-amber-600" />
          {t('nav.systemPrompt') || 'JSON System Prompt Generator'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('systemPrompt.subtitle') || 'Create rock-solid System Prompts to force Claude, ChatGPT, or Gemini into returning strictly valid JSON.'}
        </p>
        <button onClick={handleSample} className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-sm font-medium flex items-center transition-colors border border-amber-200 dark:border-amber-800/50 w-fit">
          <Wand2 className="w-4 h-4 mr-2" /> {t('common.sample') || 'Sample Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('systemPrompt.role') || 'AI Role / Objective'}</label>
            <textarea value={role} onChange={e => setRole(e.target.value)} rows={3} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" placeholder={t('systemPrompt.rolePlaceholder') || "e.g. Extract user information from the input text..."}></textarea>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('systemPrompt.schema') || 'JSON Output Schema'}</label>
              <button onClick={addField} className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-1 rounded flex items-center">
                <Plus className="w-3 h-3 mr-1" /> {t('systemPrompt.addField') || 'Add Field'}
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((f, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input type="text" value={f.key} onChange={e => updateField(i, { key: e.target.value })} placeholder={t('systemPrompt.keyName') || "Key name"} className="w-1/4 p-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded" />
                  <select value={f.type} onChange={e => updateField(i, { type: e.target.value })} className="w-1/4 p-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="array">array</option>
                    <option value="object">object</option>
                  </select>
                  <input type="text" value={f.description} onChange={e => updateField(i, { description: e.target.value })} placeholder={t('systemPrompt.description') || "Description"} className="w-1/2 p-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded" />
                  <button onClick={() => removeField(i)} className="p-2 text-slate-400 hover:text-red-500 rounded bg-slate-100 dark:bg-slate-800">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full min-h-[500px]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">{t('systemPrompt.generated') || 'Generated System Prompt'}</h3>
            <div className="flex gap-2">
              <button onClick={handleClear} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700/50 dark:text-slate-300 rounded text-sm font-medium flex items-center transition-colors">
                <Trash2 className="w-4 h-4 mr-1" /> {t('common.clear') || 'Clear'}
              </button>
              <button onClick={handleCopy} className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 rounded text-sm font-medium flex items-center transition-colors">
                {copied ? <><Check className="w-4 h-4 mr-1" /> {t('common.copied') || 'Copied'}</> : <><Copy className="w-4 h-4 mr-1" /> {t('common.copy') || 'Copy'}</>}
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 relative">
            <textarea readOnly value={generatePrompt()} className="absolute inset-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 font-mono text-sm text-slate-800 dark:text-slate-200 outline-none resize-none" placeholder={t('systemPrompt.resultPlaceholder') || "Result will appear here..."}></textarea>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('systemPrompt.howToUseTitle')}</h2>
        
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 flex items-start text-amber-800 dark:text-amber-300">
          <p className="text-sm leading-relaxed">{t('systemPrompt.howToUseSample')}</p>
        </div>

        <ul className="list-none space-y-3 mb-8">
          <li className="flex items-start text-slate-600 dark:text-slate-400">
             <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-semibold text-sm">1</span>
            <span>{t('systemPrompt.howToUse1')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-semibold text-sm">2</span>
            <span>{t('systemPrompt.howToUse2')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-semibold text-sm">3</span>
            <span>{t('systemPrompt.howToUse3')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-semibold text-sm">4</span>
            <span>{t('systemPrompt.howToUse4')}</span>
          </li>
          <li className="flex items-start text-slate-600 dark:text-slate-400">
            <span className="shrink-0 mr-2 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-semibold text-sm">5</span>
            <span>{t('systemPrompt.howToUse5')}</span>
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('systemPrompt.aboutTitle')}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('systemPrompt.about1')}
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {t('systemPrompt.about2')}
        </p>
      </div>
    </div>
  );
}
