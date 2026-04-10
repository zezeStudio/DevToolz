import React, { useState, useMemo, useRef } from 'react';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, FileJson, Info, ListTree, Code, AlertCircle, CheckCircle2, Wand2, Upload, Download, Shield, Braces } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JsonViewer } from '../components/JsonViewer';
import { jsonrepair } from 'jsonrepair';
import yaml from 'js-yaml';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text');
  const [showAutoFixDialog, setShowAutoFixDialog] = useState(false);
  const [activeHelpGroup, setActiveHelpGroup] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const parsedJson = useMemo(() => {
    if (!output) return null;
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  }, [output]);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      setIsValid(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsValid(false);
      
      // Check if it can be repaired
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const formatted = JSON.stringify(parsedRepaired, null, 2);
            setInput(formatted);
            setOutput(formatted);
            setError(null);
            setIsValid(true);
          });
          setShowAutoFixDialog(true);
        }
      } catch {
        // If repair also fails, just show the original error
      }
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsValid(false);

      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const minified = JSON.stringify(parsedRepaired);
            setInput(JSON.stringify(parsedRepaired, null, 2));
            setOutput(minified);
            setError(null);
            setIsValid(true);
          });
          setShowAutoFixDialog(true);
        }
      } catch {
        // Ignore
      }
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setIsValid(null);
      setError(null);
      return;
    }
    try {
      JSON.parse(input);
      setIsValid(true);
      setError(null);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setIsValid(false);
      setError(errorMessage);

      // Check if it can be repaired
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const formatted = JSON.stringify(parsedRepaired, null, 2);
            setInput(formatted);
            setOutput(formatted);
            setError(null);
            setIsValid(true);
          });
          setShowAutoFixDialog(true);
        }
      } catch {
        // Ignore
      }
    }
  };

  const fixJson = () => {
    if (!input.trim()) return;
    try {
      const repaired = jsonrepair(input);
      const parsed = JSON.parse(repaired);
      const formatted = JSON.stringify(parsed, null, 2);
      setInput(formatted);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  };

  const toYaml = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const yamlString = yaml.dump(parsed);
      setOutput(yamlString);
      setError(null);
      setIsValid(true);
      setViewMode('text');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsValid(false);

      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const yamlString = yaml.dump(parsedRepaired);
            setInput(JSON.stringify(parsedRepaired, null, 2));
            setOutput(yamlString);
            setError(null);
            setIsValid(true);
            setViewMode('text');
          });
          setShowAutoFixDialog(true);
        }
      } catch {
        // Ignore
      }
    }
  };

  const fromYaml = () => {
    if (!input.trim()) return;
    try {
      const parsed = yaml.load(input);
      const jsonString = JSON.stringify(parsed, null, 2);
      setInput(jsonString);
      setOutput(jsonString);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  };

  const sortKeys = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      
      const sortObject = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        
        return Object.keys(obj)
          .sort()
          .reduce((acc: any, key) => {
            acc[key] = sortObject(obj[key]);
            return acc;
          }, {});
      };

      const sorted = sortObject(parsed);
      const formatted = JSON.stringify(sorted, null, 2);
      setInput(formatted);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsValid(false);

      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const sortObject = (obj: any): any => {
              if (obj === null || typeof obj !== 'object') return obj;
              if (Array.isArray(obj)) return obj.map(sortObject);
              return Object.keys(obj).sort().reduce((acc: any, key) => {
                acc[key] = sortObject(obj[key]);
                return acc;
              }, {});
            };
            const sorted = sortObject(parsedRepaired);
            const formatted = JSON.stringify(sorted, null, 2);
            setInput(formatted);
            setOutput(formatted);
            setError(null);
            setIsValid(true);
          });
          setShowAutoFixDialog(true);
        }
      } catch {
        // Ignore
      }
    }
  };

  const maskData = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      
      const maskValue = (key: string, value: any): any => {
        if (value === null || value === undefined) return value;
        if (typeof value === 'object') {
          if (Array.isArray(value)) return value.map(v => maskValue(key, v));
          return Object.keys(value).reduce((acc: any, k) => {
            acc[k] = maskValue(k, value[k]);
            return acc;
          }, {});
        }

        const lowerKey = key.toLowerCase();
        const strVal = String(value).trim();
        
        if (lowerKey.includes('email')) {
          const [local, domain] = strVal.split('@');
          if (!domain) return '****@****';
          if (local.length <= 2) return local[0] + '*@' + domain;
          return local.slice(0, 2) + '*'.repeat(local.length - 2) + '@' + domain;
        }
        if (lowerKey.includes('phone') || lowerKey.includes('tel') || lowerKey.includes('mobile')) {
          const digits = strVal.replace(/\D/g, '');
          if (digits.length < 7) return strVal.slice(0, 3) + '****';
          return strVal.slice(0, 3) + '-****-' + strVal.slice(-4);
        }
        if (lowerKey.includes('name')) {
          if (strVal.length <= 1) return strVal;
          if (strVal.length === 2) return strVal[0] + '*';
          return strVal[0] + '*'.repeat(strVal.length - 2) + strVal[strVal.length - 1];
        }
        if (lowerKey.includes('password') || lowerKey.includes('pwd')) return '********';
        if (lowerKey.includes('token') || lowerKey.includes('secret') || lowerKey.includes('key')) {
          if (strVal.length <= 6) return '******';
          return strVal.slice(0, 3) + '****' + strVal.slice(-3);
        }
        if (lowerKey.includes('address')) {
          if (strVal.length <= 10) return strVal.slice(0, 4) + ' ****';
          return strVal.slice(0, 6) + ' **** ' + strVal.slice(-4);
        }
        if (lowerKey.includes('ssn') || lowerKey.includes('resident')) {
          const clean = strVal.replace(/\D/g, '');
          if (clean.length < 7) return '******-*******';
          return clean.slice(0, 6) + '-*******';
        }
        if (lowerKey.includes('birth')) {
          if (strVal.length < 4) return '****-**-**';
          return strVal.slice(0, 4) + '-**-**';
        }
        
        return value;
      };

      const masked = maskValue('', parsed);
      const formatted = JSON.stringify(masked, null, 2);
      setInput(formatted);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsValid(false);
      
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const maskValue = (key: string, value: any): any => {
              if (value === null || typeof value !== 'object') {
                const lowerKey = key.toLowerCase();
                const strVal = String(value).trim();
                
                if (lowerKey.includes('email')) {
                  const [local, domain] = strVal.split('@');
                  if (!domain) return '****@****';
                  if (local.length <= 2) return local[0] + '*@' + domain;
                  return local.slice(0, 2) + '*'.repeat(local.length - 2) + '@' + domain;
                }
                if (lowerKey.includes('phone')) {
                  return strVal.slice(0, 3) + '-****-' + strVal.slice(-4);
                }
                if (lowerKey.includes('name')) {
                  if (strVal.length <= 1) return strVal;
                  if (strVal.length === 2) return strVal[0] + '*';
                  return strVal[0] + '*'.repeat(strVal.length - 2) + strVal[strVal.length - 1];
                }
                return value;
              }
              if (Array.isArray(value)) return value.map(v => maskValue(key, v));
              return Object.keys(value).reduce((acc: any, k) => {
                acc[k] = maskValue(k, value[k]);
                return acc;
              }, {});
            };
            const masked = maskValue('', parsedRepaired);
            const formatted = JSON.stringify(masked, null, 2);
            setInput(formatted);
            setOutput(formatted);
            setError(null);
            setIsValid(true);
          });
          setShowAutoFixDialog(true);
        }
      } catch { /* Ignore */ }
    }
  };

  const toTypeScript = () => {
    if (!input.trim()) return;

    const generateInterface = (obj: any, name: string = 'RootObject'): string => {
      if (obj === null) return `export type ${name} = null;`;
      if (Array.isArray(obj)) {
        if (obj.length === 0) return `export type ${name} = any[];`;
        const itemType = typeof obj[0];
        if (itemType === 'object') {
          return generateInterface(obj[0], name.endsWith('s') ? name.slice(0, -1) : name + 'Item') + `\nexport type ${name} = ${name.endsWith('s') ? name.slice(0, -1) : name + 'Item'}[];`;
        }
        return `export type ${name} = ${itemType}[];`;
      }
      
      let result = `export interface ${name} {\n`;
      const subInterfaces: string[] = [];
      
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const type = typeof value;
        
        if (value === null) {
          result += `  ${key}: any | null;\n`;
        } else if (type === 'object') {
          const subName = key.charAt(0).toUpperCase() + key.slice(1);
          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object') {
              const itemSubName = subName.endsWith('s') ? subName.slice(0, -1) : subName + 'Item';
              result += `  ${key}: ${itemSubName}[];\n`;
              subInterfaces.push(generateInterface(value[0], itemSubName));
            } else {
              result += `  ${key}: any[];\n`;
            }
          } else {
            result += `  ${key}: ${subName};\n`;
            subInterfaces.push(generateInterface(value, subName));
          }
        } else {
          result += `  ${key}: ${type};\n`;
        }
      });
      
      result += `}`;
      return subInterfaces.length > 0 ? subInterfaces.join('\n\n') + '\n\n' + result : result;
    };

    try {
      const parsed = JSON.parse(input);
      const tsCode = generateInterface(parsed);
      setOutput(tsCode);
      setError(null);
      setIsValid(true);
      setViewMode('text');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setIsValid(false);
      
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const tsCode = generateInterface(parsedRepaired);
            setInput(JSON.stringify(parsedRepaired, null, 2));
            setOutput(tsCode);
            setError(null);
            setIsValid(true);
            setViewMode('text');
          });
          setShowAutoFixDialog(true);
        }
      } catch { /* Ignore */ }
    }
  };

  const loadSample = () => {
    const sample = {
      project: "DevToolz",
      version: "1.0.0",
      features: ["JSON Formatter", "Validator", "Fixer", "YAML Converter"],
      author: {
        name: "Developer",
        email: "dev@example.com"
      },
      active: true,
      stats: {
        users: 1000,
        rating: 4.8
      }
    };
    const jsonString = JSON.stringify(sample, null, 2);
    setInput(jsonString);
    setOutput(jsonString);
    setError(null);
    setIsValid(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
      try {
        const parsed = JSON.parse(content);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
        setIsValid(true);
      } catch (err) {
        setOutput(content);
        setError((err as Error).message);
        setIsValid(false);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devtoolz_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const escapeJson = () => {
    if (!input.trim()) return;
    try {
      // If it's valid JSON, minify it first for cleaner escape
      let toEscape = input;
      try {
        const parsed = JSON.parse(input);
        toEscape = JSON.stringify(parsed);
      } catch {
        // Not valid JSON, just escape the raw text
      }
      const escaped = JSON.stringify(toEscape);
      // Remove the surrounding quotes added by JSON.stringify
      const result = escaped.substring(1, escaped.length - 1);
      setOutput(result);
      setError(null);
      setIsValid(true);
      setViewMode('text');
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  };

  const unescapeJson = () => {
    if (!input.trim()) return;
    try {
      // Wrap in quotes to make it a valid JSON string for parsing
      const wrapped = `"${input}"`;
      const unescaped = JSON.parse(wrapped);
      setInput(unescaped);
      try {
        const parsed = JSON.parse(unescaped);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
        setIsValid(true);
      } catch {
        setOutput(unescaped);
        setError(null);
        setIsValid(true);
      }
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
  };

  const handleAutoFix = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowAutoFixDialog(false);
    setPendingAction(null);
  };

  return (
    <>
      <SEO 
        title={`${t('json.title')} - DevToolz`}
        description={t('json.desc')}
        url="/json-formatter"
        schema={[
          {
            "@type": "SoftwareApplication",
            "name": t('json.title'),
            "description": t('json.desc'),
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          },
          {
            "@type": "HowTo",
            "name": t('json.help.title'),
            "step": [
              { "@type": "HowToStep", "text": t('json.help.1') },
              { "@type": "HowToStep", "text": t('json.help.2') },
              { "@type": "HowToStep", "text": t('json.help.3') }
            ]
          }
        ]}
      />

      {/* Auto-Fix Dialog Modal */}
      {showAutoFixDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4 mx-auto">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {t('json.autoFix.title')}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {t('json.autoFix.desc')}
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-6 text-xs font-mono text-red-700 break-all">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAutoFix}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  {t('json.autoFix.confirm')}
                </button>
                <button
                  onClick={() => {
                    setShowAutoFixDialog(false);
                    setPendingAction(null);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all"
                >
                  {t('json.autoFix.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto h-full flex flex-col px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileJson className="mr-3 h-8 w-8 text-blue-600" />
            {t('json.title')}
          </h1>
          <p className="text-gray-500 mt-2">{t('json.desc')}</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transform Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><Wand2 className="w-3 h-3 mr-1" /> {t('json.group.transform')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'transform' ? null : 'transform')}
                  className={`p-1 rounded-full transition-colors ${activeHelpGroup === 'transform' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              {activeHelpGroup === 'transform' && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg text-[11px] text-blue-800 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.formatBtn')}:</strong> {t('json.tip.format')}</p>
                  <p className="mt-1"><strong>{t('json.minifyBtn')}:</strong> {t('json.tip.minify')}</p>
                  <p className="mt-1"><strong>{t('json.fixBtn')}:</strong> {t('json.tip.fix')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={formatJson}
                  title={t('json.tip.format')}
                  className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  {t('json.formatBtn')}
                </button>
                <button
                  onClick={minifyJson}
                  title={t('json.tip.minify')}
                  className="flex-1 h-9 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 flex items-center justify-center"
                >
                  {t('json.minifyBtn')}
                </button>
                <button
                  onClick={fixJson}
                  className="h-9 w-9 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors border border-purple-200 flex items-center justify-center shrink-0"
                  title={t('json.tip.fix')}
                >
                  <Wand2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversion Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><Code className="w-3 h-3 mr-1" /> {t('json.group.conversion')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'conversion' ? null : 'conversion')}
                  className={`p-1 rounded-full transition-colors ${activeHelpGroup === 'conversion' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              {activeHelpGroup === 'conversion' && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg text-[11px] text-blue-800 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.toYamlBtn')}:</strong> {t('json.tip.toYaml')}</p>
                  <p className="mt-1"><strong>{t('json.fromJsonBtn')}:</strong> {t('json.tip.fromYaml')}</p>
                  <p className="mt-1"><strong>{t('json.toTsBtn')}:</strong> {t('json.tip.toTs')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={toYaml}
                  title={t('json.tip.toYaml')}
                  className="flex-1 h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  {t('json.toYamlBtn')}
                </button>
                <button
                  onClick={toTypeScript}
                  title={t('json.tip.toTs')}
                  className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  <Braces className="w-3.5 h-3.5 mr-1" />
                  {t('json.toTsBtn')}
                </button>
              </div>
            </div>

            {/* Tools Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('json.group.tools')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'tools' ? null : 'tools')}
                  className={`p-1 rounded-full transition-colors ${activeHelpGroup === 'tools' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              {activeHelpGroup === 'tools' && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg text-[11px] text-blue-800 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.validateBtn')}:</strong> {t('json.tip.validate')}</p>
                  <p className="mt-1"><strong>{t('json.sortBtn')}:</strong> {t('json.tip.sort')}</p>
                  <p className="mt-1"><strong>{t('json.maskBtn')}:</strong> {t('json.tip.mask')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={validateJson}
                  title={t('json.tip.validate')}
                  className="flex-1 h-9 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  {t('json.validateBtn')}
                </button>
                <button
                  onClick={maskData}
                  title={t('json.tip.mask')}
                  className="flex-1 h-9 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {t('json.maskBtn')}
                </button>
                <button
                  onClick={sortKeys}
                  title={t('json.tip.sort')}
                  className="h-9 w-9 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors border border-indigo-200 flex items-center justify-center shrink-0"
                >
                  <ListTree className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Data Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><Upload className="w-3 h-3 mr-1" /> {t('json.group.data')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'data' ? null : 'data')}
                  className={`p-1 rounded-full transition-colors ${activeHelpGroup === 'data' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              {activeHelpGroup === 'data' && (
                <div className="mb-3 p-2 bg-blue-50 rounded-lg text-[11px] text-blue-800 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.sampleBtn')}:</strong> {t('json.tip.sample')}</p>
                  <p className="mt-1"><strong>{t('json.uploadBtn')}:</strong> {t('json.tip.upload')}</p>
                  <p className="mt-1"><strong>{t('json.downloadBtn')}:</strong> {t('json.tip.download')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={loadSample}
                  title={t('json.tip.sample')}
                  className="flex-1 h-9 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  {t('json.sampleBtn')}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title={t('json.tip.upload')}
                  className="flex-1 h-9 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-3 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  {t('json.uploadBtn')}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json,.txt"
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
          {/* Input Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700">{t('json.inputLabel')}</label>
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" /> {t('json.clear')}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base resize-none shadow-inner"
              placeholder={t('json.placeholder')}
              spellCheck="false"
            />
          </div>

          {/* Output Area */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 flex items-center">
                {t('json.outputLabel')}
                {output && !error && (
                  <div className="ml-4 flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('text')}
                      className={`px-3 py-1 text-xs font-medium rounded-md flex items-center transition-colors ${
                        viewMode === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Code className="w-3 h-3 mr-1" /> Code
                    </button>
                    <button
                      onClick={() => setViewMode('tree')}
                      className={`px-3 py-1 text-xs font-medium rounded-md flex items-center transition-colors ${
                        viewMode === 'tree' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <ListTree className="w-3 h-3 mr-1" /> Tree
                    </button>
                  </div>
                )}
              </label>
              <div className="flex items-center">
                <button
                  onClick={copyToClipboard}
                  disabled={!output}
                  title={t('json.tip.copy')}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t('json.copied') : t('json.copy')}
                </button>
                <button
                  onClick={downloadJson}
                  disabled={!output}
                  title={t('json.tip.download')}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t('json.downloadBtn')}
                </button>
              </div>
            </div>
            <div className="relative flex-1 bg-gray-50 border border-gray-300 rounded-lg overflow-hidden shadow-inner">
              {viewMode === 'text' || error || !parsedJson ? (
                <textarea
                  value={output}
                  readOnly
                  className={`w-full h-full p-4 font-mono text-base resize-none focus:outline-none bg-transparent text-gray-800`}
                  placeholder=""
                />
              ) : (
                <div className="w-full h-full p-4 overflow-auto bg-white">
                  <JsonViewer data={parsedJson} />
                </div>
              )}
              
              {isValid === true && (
                <div className="absolute top-4 right-4 flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 animate-in fade-in zoom-in duration-300 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('json.valid')}
                </div>
              )}

              {isValid === false && error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 text-red-700 p-3 text-sm font-mono overflow-x-auto flex items-start shadow-lg">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>{t('json.error')}</strong> {error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm">
          <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
            <Info className="h-6 w-6 mr-3" />
            {t('json.help.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <Wand2 className="w-4 h-4 mr-2" /> {t('json.group.transform')}
              </h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>{t('json.formatBtn')}:</strong> {t('json.tip.format')}</li>
                <li><strong>{t('json.minifyBtn')}:</strong> {t('json.tip.minify')}</li>
                <li><strong>{t('json.fixBtn')}:</strong> {t('json.tip.fix')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <Code className="w-4 h-4 mr-2" /> {t('json.group.conversion')}
              </h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>{t('json.toYamlBtn')}:</strong> {t('json.tip.toYaml')}</li>
                <li><strong>{t('json.fromJsonBtn')}:</strong> {t('json.tip.fromYaml')}</li>
                <li><strong>{t('json.toTsBtn')}:</strong> {t('json.tip.toTs')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" /> {t('json.group.tools')}
              </h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>{t('json.validateBtn')}:</strong> {t('json.tip.validate')}</li>
                <li><strong>{t('json.sortBtn')}:</strong> {t('json.tip.sort')}</li>
                <li><strong>{t('json.maskBtn')}:</strong> {t('json.tip.mask')}</li>
                <li><strong>{t('json.escapeBtn')}/{t('json.unescapeBtn')}:</strong> {t('json.tip.escape')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                <Upload className="w-4 h-4 mr-2" /> {t('json.group.data')}
              </h4>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li><strong>{t('json.sampleBtn')}:</strong> {t('json.tip.sample')}</li>
                <li><strong>{t('json.uploadBtn')}:</strong> {t('json.tip.upload')}</li>
                <li><strong>{t('json.downloadBtn')}:</strong> {t('json.tip.download')}</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">{t('json.help.title')}</h4>
            <ul className="space-y-2 text-blue-800 text-sm list-disc list-inside">
              <li>{t('json.help.1')}</li>
              <li>{t('json.help.2')}</li>
              <li>{t('json.help.3')}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
