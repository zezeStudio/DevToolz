import React, { useState, useCallback, useEffect } from 'react';
import { Play, Copy, CheckCircle2, Upload, FileJson, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { useLocation, useParams } from 'react-router-dom';

export function JsonSchemaGenerator() {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams();
  const [inputData, setInputData] = useState<string>('');
  const [outputData, setOutputData] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleJson = `{
  "user": {
    "name": "Jane",
    "age": 30,
    "email": "jane@example.com"
  },
  "isActive": true,
  "roles": ["admin", "user"]
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    setInputData('');
    setOutputData('');
    setError(null);
  };

  const insertSample = () => {
    setInputData(sampleJson);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputData(content);
    };
    reader.readAsText(file);
  };

  const convertToJsonSchema = useCallback((input: string) => {
    if (!input.trim()) {
      setOutputData('');
      setError(null);
      return;
    }

    try {
      // First try parsing as JSON
      const parsedJson = JSON.parse(input);
      const schema = generateSchemaFromJson(parsedJson);
      setOutputData(JSON.stringify(schema, null, 2));
      setError(null);
    } catch (err) {
      // Very basic TS interface parsing fallback (naive)
      try {
         const schema = generateSchemaFromTs(input);
         if (schema) {
            setOutputData(JSON.stringify(schema, null, 2));
            setError(null);
         } else {
            setError(t('jsonSchema.error.invalidJson') || 'Invalid input: Please provide a valid JSON object.');
            setOutputData('');
         }
      } catch (tsErr) {
         setError(t('jsonSchema.error.invalidJson') || 'Invalid input: Please provide a valid JSON object or TS interface.');
         setOutputData('');
      }
    }
  }, [t]);

  // Naive TS Interface parser
  const generateSchemaFromTs = (tsCode: string) => {
     // Simplified heuristic approach
     if (!tsCode.includes("interface") && !tsCode.includes("type")) return null;
     
     // Fallback to error for complex TS parsing since full AST parsing is out of scope 
     // for a pure frontend regex heuristic without dependencies like typescript compiler.
     // But we will give a helpful hint.
     throw new Error("TS parsing not fully supported yet.");
  }

  const generateSchemaFromJson = (data: any): any => {
    const typeOf = (obj: any): string => {
      if (obj === null) return 'null';
      if (Array.isArray(obj)) return 'array';
      return typeof obj;
    };

    const type = typeOf(data);

    if (type === 'object') {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const key in data) {
        properties[key] = generateSchemaFromJson(data[key]);
        required.push(key);
      }

      return {
        type: 'object',
        properties,
        required,
        additionalProperties: false
      };
    } else if (type === 'array') {
      let itemsSchema = {};
      if (data.length > 0) {
        // Assume homogeneous array based on first element
        itemsSchema = generateSchemaFromJson(data[0]);
      } else {
         // Default empty array item schema to string
         itemsSchema = { type: 'string' };
      }
      return {
        type: 'array',
        items: itemsSchema
      };
    } else if (type === 'number') {
      // Check if it's an integer
      return { type: Number.isInteger(data) ? 'integer' : 'number' };
    } else if (type === 'string' || type === 'boolean' || type === 'null') {
      return { type: type };
    } else {
      return { type: 'string' }; // Fallback
    }
  };

  useEffect(() => {
    const defaultTimer = setTimeout(() => {
        if (inputData) {
            convertToJsonSchema(inputData);
        } else {
            setOutputData('');
            setError(null);
        }
    }, 500);
    return () => clearTimeout(defaultTimer);
  }, [inputData, convertToJsonSchema]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SEO 
        title={t('jsonSchema.seoTitle') || 'LLM Structured Output JSON Schema Generator | DevToolz'}
        description={t('jsonSchema.desc') || 'Generate strict, additionalProperties: false JSON Schemas for OpenAI and Gemini Structured Outputs.'}
        url={`/${lang === 'en' ? '' : lang + '/'}json-schema-generator`}
      />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('jsonSchema.title') || 'LLM Structured Output Schema Generator'}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t('jsonSchema.desc') || 'Generate strict, additionalProperties: false JSON Schemas for OpenAI and Gemini Structured Outputs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-indigo-500" />
              {t('jsonSchema.inputJson') || 'Input (JSON)'}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={insertSample}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title="Load Sample"
              >
                {t('common.sample')}
              </button>
              <label className="cursor-pointer px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">{t('jsonSchema.uploadFile') || 'Upload JSON'}</span>
                <input
                  type="file"
                  accept=".json,.txt,.ts"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.clear')}</span>
              </button>
            </div>
          </div>
          
          <div className="relative">
             <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={t('jsonSchema.pastePrompt') || 'Paste sample JSON data here...'}
              className="w-full h-[500px] p-4 text-sm font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
            />
          </div>
          {error && (
             <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg text-sm text-red-600 dark:text-red-400 mt-2 whitespace-pre-wrap">
               {error}
             </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              {t('jsonSchema.generatedSchema') || 'Generated Structured Output Schema'}
            </h2>
            <button
              onClick={handleCopy}
              disabled={!outputData}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('common.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('common.copy')}</span>
                </>
              )}
            </button>
          </div>
          <textarea
            value={outputData}
            readOnly
            className="w-full h-[500px] p-4 text-sm font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder={t('jsonSchema.outputPlaceholder') || 'Schema will appear here...'}
          />
        </div>
      </div>

       {/* Detailed Description Section for SEO */}
       <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('jsonSchema.longDesc.title') || 'About Structured Output Schema Generator'}
        </h2>
        
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {t('jsonSchema.longDesc.p1') || "This tool is specifically designed to help AI engineers and backend developers generate strict JSON Schemas compatible with the 'Structured Output' feature from OpenAI and Gemini."}
          </p>
          <p>
             {t('jsonSchema.longDesc.p2') || "Unlike standard JSON Schema, LLM Structured Outputs impose strict constraints: additionalProperties: false must be set at every object level, and all fields must be explicitly listed in the required array. Writing this manually is extremely error-prone and time-consuming. This tool automates the process completely locally in your browser."}
          </p>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {t('jsonSchema.help.title') || 'How to use this tool'}
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('jsonSchema.help.1') || 'Paste your sample JSON data into the left editor.'}</li>
              <li>{t('jsonSchema.help.2') || 'The tool will instantly parse the JSON structure.'}</li>
              <li>{t('jsonSchema.help.3') || 'A strict JSON Schema with required fields and `additionalProperties: false` is output on the right.'}</li>
              <li>{t('jsonSchema.help.4') || 'Click "Sample Data" to see a complex JSON response parsed instantly.'}</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
