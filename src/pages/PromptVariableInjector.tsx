import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Copy, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { cn } from '../lib/utils';

export function PromptVariableInjector() {
  const { t, i18n } = useTranslation();
  const [template, setTemplate] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isInitialLoad = React.useRef(true);

  // Set default sample data on mount or language change if untouched
  useEffect(() => {
    if (isInitialLoad.current) {
      setTemplate(t('promptInjector.defaultTemplate'));
      setVariables({
        "product_name": t('promptInjector.defaultProduct'),
        "key_features": t('promptInjector.defaultFeatures'),
        "tone_and_manner": t('promptInjector.defaultTone'),
        "target_audience": t('promptInjector.defaultAudience')
      });
      isInitialLoad.current = false;
    }
  }, [t]);

  // Extract variables from template
  const extractedVariables = useMemo(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = Array.from(template.matchAll(regex));
    const uniqueVars = Array.from(new Set(matches.map(m => m[1].trim())));
    return uniqueVars;
  }, [template]);

  // Pre-fill variable map
  useEffect(() => {
    setVariables(prev => {
      const newVars: Record<string, string> = { ...prev };
      extractedVariables.forEach(v => {
        if (newVars[v] === undefined) {
          newVars[v] = '';
        }
      });
      return newVars;
    });
  }, [extractedVariables]);

  const handleVariableChange = (name: string, value: string) => {
    setVariables(prev => ({ ...prev, [name]: value }));
  };

  const clearAll = () => {
    setTemplate("");
    setVariables({});
  };

  const generateOutput = () => {
    let output = template;
    extractedVariables.forEach(v => {
      const val = variables[v] || `{{${v}}}`;
      const escapedV = v.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
      output = output.replace(new RegExp(`\\{\\{\\s*${escapedV}\\s*\\}\\}`, 'g'), val);
    });
    return output;
  };

  const output = generateOutput();

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setCopied(false);
        setShowToast(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <>
      <SEO 
        title={t('promptInjector.pageTitle') || 'Prompt Variable Injector - DevToolz'}
        description={t('promptInjector.subtitle') || 'Dynamically inject variables into your AI prompt templates.'}
        url={`/${i18n.language}/prompt-variable-injector`}
      />
      <div className="max-w-5xl mx-auto relative">
        {/* Toast Notification */}
        <div 
          className={cn(
            "fixed top-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 pointer-events-none",
            showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{t('promptInjector.copyToast') || "Prompt copied to clipboard!"}</span>
        </div>

        <div className="mb-8 relative">
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-rose-500/10 dark:bg-rose-400/10 rounded-full blur-2xl"></div>
          <div className="flex items-center space-x-4 mb-4 relative">
            <div className="p-3 bg-rose-500/10 dark:bg-rose-400/10 rounded-xl">
              <Bot className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('promptInjector.title') || 'Prompt Variable Injector'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-lg">
                {t('promptInjector.subtitle') || 'Dynamically inject variables into your AI prompt templates.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column: Template Input */}
          <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center">
                Prompt Template
              </span>
              <button
                onClick={clearAll}
                className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                title="Clear Template"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 relative min-h-[300px]">
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.06]"
                placeholder="Enter your prompt template here. Use {{variable_name}} to define variables..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Right Column: Variables & Output */}
          <div className="flex flex-col h-full space-y-6">
            
            {/* Variables Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex-1">
               <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Variables
                </span>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: '250px' }}>
                {extractedVariables.length > 0 ? (
                  <div className="space-y-4">
                    {extractedVariables.map(variable => (
                      <div key={variable} className="flex flex-col">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                          <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-rose-500 text-xs">
                            {"{{"}{variable}{"}}"}
                          </code>
                        </label>
                        <textarea
                          rows={3}
                          value={variables[variable] || ''}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          placeholder={`Enter value for ${variable}`}
                          className="w-full dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:text-white dark:placeholder-slate-500 transition-colors resize-y min-h-[60px] bg-slate-50 dark:bg-slate-900"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-6 text-sm">
                    No variables detected. Use <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-rose-500">&#123;&#123;variable_name&#125;&#125;</code> in your template.
                  </div>
                )}
              </div>
            </div>

            {/* Output */}
             <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex-1 flex flex-col">
               <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Preview Output
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors text-sm font-medium"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex-1 relative min-h-[250px]">
                <textarea
                  readOnly
                  value={output}
                  className="absolute inset-0 w-full h-full p-4 resize-none focus:outline-none focus:ring-0 text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed dark:bg-black/20 border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900"
                />
              </div>
             </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="prose dark:prose-invert max-w-none mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-4">
            {t('promptInjector.aboutTitle') || "About Prompt Variable Injector"}
          </h2>
          <p>
            {t('promptInjector.about1') || "The Prompt Variable Injector is a flexible 'text preset' tool for developers who frequently design and test AI API prompts. If you repeatedly use the same prompt structures, organizing them by creating templates with dynamic variables saves a massive amount of time."}
          </p>
          <p>
            {t('promptInjector.about2') || "By inserting {{variable}} tags in your text, the interface automatically detects them and creates input fields. As you type into these fields, your variables are instantaneously injected into the template, preparing your final query or system message for copy-pasting into your API calls or ChatGPT/Claude interfaces."}
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4">
            {t('promptInjector.howToUseTitle') || "How to use"}
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Step 1:</strong> {t('promptInjector.howToUse1') || "Write your prompt template in the left pane."}
            </li>
            <li>
              <strong>Step 2:</strong> {t('promptInjector.howToUse2') || "Use the syntax {{variable_name}} to define a placeholder you want to inject dynamically later."}
            </li>
            <li>
              <strong>Step 3:</strong> {t('promptInjector.howToUse3') || "Variables will automatically appear on the right side as input fields."}
            </li>
            <li>
              <strong>Step 4:</strong> {t('promptInjector.howToUse4') || "Type the actual values into the generated form. The Preview Output will update instantly."}
            </li>
            <li>
              <strong>Step 5:</strong> {t('promptInjector.howToUse5') || "Click 'Copy' to copy your dynamically assembled prompt."}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
