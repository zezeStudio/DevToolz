import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import JsonWorker from '../lib/jsonWorker?worker';
import { SEO } from '../components/SEO';
import { Copy, Check, Trash2, FileJson, Info, ListTree, Code, AlertCircle, CheckCircle2, Wand2, Upload, Download, Shield, Braces, Quote, FileCode, Shrink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JsonViewer } from '../components/JsonViewer';
import { useParams } from 'react-router-dom';
import { jsonrepair } from 'jsonrepair';
import yaml from 'js-yaml';

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new JsonWorker();
    return () => workerRef.current?.terminate();
  }, []);

  const processInWorker = useCallback((type: string, payload: string | object) => {
    return new Promise<any>((resolve, reject) => {
      if (!workerRef.current) return reject(new Error("Worker not initialized"));
      const id = Date.now() + Math.random();
      const handler = (e: MessageEvent) => {
        if (e.data.id === id) {
          workerRef.current!.removeEventListener("message", handler);
          if (e.data.success) resolve(e.data.result);
          else reject(new Error(e.data.error));
        }
      };
      workerRef.current.addEventListener("message", handler);
      workerRef.current.postMessage({ id, type, payload });
    });
  }, []);
  const [history, setHistory] = useState<string[]>([]);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'tree'>('text');
  const [showAutoFixDialog, setShowAutoFixDialog] = useState(false);
  const [activeHelpGroup, setActiveHelpGroup] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';

  const parsedJson = useMemo(() => {
    if (!output) return null;
    try {
      return JSON.parse(output);
    } catch {
      return null;
    }
  }, [output]);

  
  const saveToHistory = (currentInput: string) => {
    setHistory(prev => {
      if (prev.length > 0 && prev[prev.length - 1] === currentInput) return prev;
      return [...prev, currentInput].slice(-20);
    });
  };

  const undo = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousState = newHistory.pop()!;
      setInput(previousState);
      try {
        const parsed = JSON.parse(previousState);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
        setIsValid(true);
      } catch {
        // Leave output empty or keep parsing
      }
      return newHistory;
    });
  };

  
  const getErrorLine = (errMessage: string, jsonInput: string): number | null => {
    const lineMatch = errMessage.match(/line (\d+)/i);
    if (lineMatch) return parseInt(lineMatch[1], 10);
    const posMatch = errMessage.match(/position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const textUpToPos = jsonInput.substring(0, pos);
      return textUpToPos.split('\n').length;
    }
    return null;
  };
  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
    setErrorLine(null);
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
      setErrorLine(getErrorLine(errorMessage, input));
      setIsValid(false);
      
      // Check if it can be repaired
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const formatted = JSON.stringify(parsedRepaired, null, 2);
            saveToHistory(input);
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
      setErrorLine(getErrorLine(errorMessage, input));
      setIsValid(false);

      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const minified = JSON.stringify(parsedRepaired);
            saveToHistory(input);
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
      setErrorLine(getErrorLine(errorMessage, input));

      // Check if it can be repaired
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const formatted = JSON.stringify(parsedRepaired, null, 2);
            saveToHistory(input);
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
      saveToHistory(input);
      setInput(formatted);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
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
      setErrorLine(getErrorLine(errorMessage, input));
      setIsValid(false);

      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const yamlString = yaml.dump(parsedRepaired);
            saveToHistory(input);
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
      saveToHistory(input);
      setInput(jsonString);
      setOutput(jsonString);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
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
      saveToHistory(input);
      setInput(formatted);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setErrorLine(getErrorLine(errorMessage, input));
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
      saveToHistory(input);
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
      saveToHistory(input);
      setInput(formatted);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setErrorLine(getErrorLine(errorMessage, input));
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
      saveToHistory(input);
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
      setErrorLine(getErrorLine(errorMessage, input));
      setIsValid(false);
      
      try {
        const repaired = jsonrepair(input);
        if (repaired !== input) {
          setPendingAction(() => () => {
            const parsedRepaired = JSON.parse(repaired);
            const tsCode = generateInterface(parsedRepaired);
            saveToHistory(input);
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
      let finalInput = content;
      try {
        const parsed = JSON.parse(content);
        finalInput = JSON.stringify(parsed, null, 2);
        setOutput(finalInput);
        setError(null);
        setIsValid(true);
      } catch (err) {
        setOutput(content);
        const errMessage = (err as Error).message;
        setError(errMessage);
        setErrorLine(getErrorLine(errMessage, content));
        setIsValid(false);
      }
      setInput(finalInput);
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
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
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
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
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
    setErrorLine(null);
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
        title={t('json.seoTitle')}
        description={t('json.desc')}
        url={`/${currentLang}/json-formatter`}
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4 mx-auto">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
                {t('json.autoFix.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                {t('json.autoFix.desc')}
              </p>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-100 rounded-lg p-3 mb-6 text-xs font-mono text-red-700 dark:text-red-400 break-all">
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
                  className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all"
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FileJson className="mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
            {t('json.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('json.desc')}</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Toolbar */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transform Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><Wand2 className="w-3 h-3 mr-1" /> {t('json.group.transform')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'transform' ? null : 'transform')}
                  className={`p-1.5 rounded-full transition-all inline-flex items-center justify-center ${activeHelpGroup === 'transform' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeHelpGroup === 'transform' && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[11px] text-blue-600 dark:text-blue-400 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.formatBtn')}:</strong> {t('json.tip.format')}</p>
                  <p className="mt-1"><strong>{t('json.minifyBtn')}:</strong> {t('json.tip.minify')}</p>
                  <p className="mt-1"><strong>{t('json.fixBtn')}:</strong> {t('json.tip.fix')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={formatJson}
                  title={t('json.tip.format')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-sm"
                >
                  {t('json.formatBtn')}
                </button>
                <button
                  onClick={fixJson}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  title={t('json.tip.fix')}
                >
                  <Wand2 className="w-3.5 h-3.5 mr-1" />
                  {t('json.fixBtn')}
                </button>
              </div>
            </div>

            {/* Conversion Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><Code className="w-3 h-3 mr-1" /> {t('json.group.conversion')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'conversion' ? null : 'conversion')}
                  className={`p-1.5 rounded-full transition-all inline-flex items-center justify-center ${activeHelpGroup === 'conversion' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeHelpGroup === 'conversion' && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[11px] text-blue-600 dark:text-blue-400 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.toYamlBtn')}:</strong> {t('json.tip.toYaml')}</p>
                  <p className="mt-1"><strong>{t('json.fromJsonBtn')}:</strong> {t('json.tip.fromYaml')}</p>
                  <p className="mt-1"><strong>{t('json.toTsBtn')}:</strong> {t('json.tip.toTs')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={toYaml}
                  title={t('json.tip.toYaml')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  {t('json.toYamlBtn')}
                </button>
                <button
                  onClick={toTypeScript}
                  title={t('json.tip.toTs')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <Braces className="w-3.5 h-3.5 mr-1" />
                  {t('json.toTsBtn')}
                </button>
              </div>
            </div>

            {/* Tools Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> {t('json.group.tools')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'tools' ? null : 'tools')}
                  className={`p-1.5 rounded-full transition-all inline-flex items-center justify-center ${activeHelpGroup === 'tools' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeHelpGroup === 'tools' && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[11px] text-blue-600 dark:text-blue-400 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.validateBtn')}:</strong> {t('json.tip.validate')}</p>
                  <p className="mt-1"><strong>{t('json.sortBtn')}:</strong> {t('json.tip.sort')}</p>
                  <p className="mt-1"><strong>{t('json.maskBtn')}:</strong> {t('json.tip.mask')}</p>
                  <p className="mt-1"><strong>{t('json.escapeBtn')}:</strong> {t('json.tip.escape')}</p>
                  <p className="mt-1"><strong>{t('json.unescapeBtn')}:</strong> {t('json.tip.unescape')}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={validateJson}
                  title={t('json.tip.validate')}
                  className="h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {t('json.validateBtn')}
                </button>
                <button
                  onClick={minifyJson}
                  title={t('json.tip.minify')}
                  className="h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <Shrink className="w-3.5 h-3.5 mr-1" />
                  {t('json.minifyBtn')}
                </button>
                <button
                  onClick={maskData}
                  title={t('json.tip.mask')}
                  className="h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {t('json.maskBtn')}
                </button>
                <button
                  onClick={sortKeys}
                  title={t('json.tip.sort')}
                  className="h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <ListTree className="w-3.5 h-3.5 mr-1" />
                  {t('json.sortBtn')}
                </button>
                <button
                  onClick={escapeJson}
                  title={t('json.tip.escape')}
                  className="h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <Quote className="w-3.5 h-3.5 mr-1" />
                  {t('json.escapeBtn')}
                </button>
                <button
                  onClick={unescapeJson}
                  title={t('json.tip.unescape')}
                  className="h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  <FileCode className="w-3.5 h-3.5 mr-1" />
                  {t('json.unescapeBtn')}
                </button>
              </div>
            </div>

            {/* Data Group */}
            <div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center"><Upload className="w-3 h-3 mr-1" /> {t('json.group.data')}</span>
                <button 
                  onClick={() => setActiveHelpGroup(activeHelpGroup === 'data' ? null : 'data')}
                  className={`p-1.5 rounded-full transition-all inline-flex items-center justify-center ${activeHelpGroup === 'data' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              {activeHelpGroup === 'data' && (
                <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-[11px] text-blue-600 dark:text-blue-400 animate-in slide-in-from-top-1 duration-200">
                  <p><strong>{t('json.sampleBtn')}:</strong> {t('json.tip.sample')}</p>
                  <p className="mt-1"><strong>{t('json.uploadBtn')}:</strong> {t('json.tip.upload')}</p>
                  <p className="mt-1"><strong>{t('json.downloadBtn')}:</strong> {t('json.tip.download')}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={loadSample}
                  title={t('json.tip.sample')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                >
                  {t('json.sampleBtn')}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title={t('json.tip.upload')}
                  className="flex-1 h-9 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium px-3 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 flex items-center justify-center"
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

        
        <div className="relative flex-1 lg:min-h-[600px] flex flex-col">
          {isProcessing && (
            <div className="absolute inset-0 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{t('json.ProcessingData') || "Processing..."}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 h-full">
          {/* Input Area */}
          <div className="flex flex-col min-h-[400px] lg:h-full lg:min-h-0">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300">{t('json.inputLabel')}</label>
              <div className="flex items-center">
              {history.length > 0 && (
                <button
                  onClick={undo}
                  className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center px-2 py-1 rounded hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors mr-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                  Undo
                </button>
              )}

              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 flex items-center px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" /> {t('json.clear')}
              </button>
            </div>
            </div>
            
            <div className="flex-1 relative w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 shadow-inner bg-white dark:bg-gray-800">
              <div 
                ref={backdropRef}
                className="absolute inset-0 pointer-events-none p-4 font-mono text-base whitespace-pre-wrap break-words overflow-hidden text-transparent"
                style={{ lineHeight: '1.5' }}
                aria-hidden="true"
              >
                {input.split('\n').map((line, i) => (
                  <span key={i} className={errorLine === i + 1 ? 'bg-red-200/50 dark:bg-red-900/50 inline-block w-full' : ''}>
                    {line || ' '}{'\n'}
                  </span>
                ))}
              </div>
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setErrorLine(null);
                }}
                onScroll={(e) => {
                  if (backdropRef.current) {
                    backdropRef.current.scrollTop = e.currentTarget.scrollTop;
                    backdropRef.current.scrollLeft = e.currentTarget.scrollLeft;
                  }
                }}
                spellCheck={false}
                className="absolute inset-0 w-full h-full p-4 font-mono text-base resize-none focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                style={{ lineHeight: '1.5' }}
                placeholder={t('json.placeholder') || 'Paste your JSON data here...'}
              />
            </div>
          </div>

          {/* Output Area */}
          <div className="flex flex-col min-h-[400px] lg:h-full lg:min-h-0">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                {t('json.outputLabel')}
                {output && !error && (
                  <div className="ml-4 flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('text')}
                      className={`px-3 py-1 text-xs font-medium rounded-md flex items-center transition-colors ${
                        viewMode === 'text' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Code className="w-3 h-3 mr-1" /> Code
                    </button>
                    <button
                      onClick={() => setViewMode('tree')}
                      className={`px-3 py-1 text-xs font-medium rounded-md flex items-center transition-colors ${
                        viewMode === 'tree' ? 'bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center h-8 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {copied ? <Check className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? t('json.copied') : t('json.copy')}
                </button>
                <button
                  onClick={downloadJson}
                  disabled={!output}
                  title={t('json.tip.download')}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 flex items-center h-8 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2 whitespace-nowrap"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t('json.downloadBtn')}
                </button>
              </div>
            </div>
            <div className="relative flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-inner">
              {viewMode === 'text' || error || !parsedJson ? (
                <textarea
                  value={output}
                  readOnly
                  className={`w-full h-full p-4 font-mono text-base resize-none focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder={t('json.outputPlaceholder')}
                />
              ) : (
                <div className="w-full h-full p-4 overflow-auto bg-white dark:bg-gray-800">
                  <JsonViewer data={parsedJson} />
                </div>
              )}
              
              {isValid === true && (
                <div className="absolute top-4 right-4 flex items-center bg-green-100 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 animate-in fade-in zoom-in duration-300 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {t('json.valid')}
                </div>
              )}

              {isValid === false && error && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-100 border-t border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 text-sm font-mono overflow-x-auto flex items-start shadow-lg">
                  <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>{t('json.error')}</strong> {error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6 xl:overflow-y-auto pb-6 custom-scrollbar px-1">
        {/* Help Section */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-8 border border-blue-100 dark:border-blue-900/50 shadow-sm">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-6 flex items-center">
            <Info className="h-6 w-6 mr-3" />
            {t('json.help.title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                <Wand2 className="w-4 h-4 mr-2" /> {t('json.group.transform')}
              </h4>
              <ul className="space-y-2 text-blue-600 dark:text-blue-400 text-sm">
                <li><strong>{t('json.formatBtn')}:</strong> {t('json.tip.format')}</li>
                <li><strong>{t('json.minifyBtn')}:</strong> {t('json.tip.minify')}</li>
                <li><strong>{t('json.fixBtn')}:</strong> {t('json.tip.fix')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                <Code className="w-4 h-4 mr-2" /> {t('json.group.conversion')}
              </h4>
              <ul className="space-y-2 text-blue-600 dark:text-blue-400 text-sm">
                <li><strong>{t('json.toYamlBtn')}:</strong> {t('json.tip.toYaml')}</li>
                <li><strong>{t('json.fromJsonBtn')}:</strong> {t('json.tip.fromYaml')}</li>
                <li><strong>{t('json.toTsBtn')}:</strong> {t('json.tip.toTs')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2" /> {t('json.group.tools')}
              </h4>
              <ul className="space-y-2 text-blue-600 dark:text-blue-400 text-sm">
                <li><strong>{t('json.validateBtn')}:</strong> {t('json.tip.validate')}</li>
                <li><strong>{t('json.sortBtn')}:</strong> {t('json.tip.sort')}</li>
                <li><strong>{t('json.maskBtn')}:</strong> {t('json.tip.mask')}</li>
                <li><strong>{t('json.escapeBtn')}/{t('json.unescapeBtn')}:</strong> {t('json.tip.escape')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                <Upload className="w-4 h-4 mr-2" /> {t('json.group.data')}
              </h4>
              <ul className="space-y-2 text-blue-600 dark:text-blue-400 text-sm">
                <li><strong>{t('json.sampleBtn')}:</strong> {t('json.tip.sample')}</li>
                <li><strong>{t('json.uploadBtn')}:</strong> {t('json.tip.upload')}</li>
                <li><strong>{t('json.downloadBtn')}:</strong> {t('json.tip.download')}</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-200">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3">{t('json.help.title')}</h4>
            <ul className="space-y-2 text-blue-600 dark:text-blue-400 text-sm list-disc list-inside">
              <li>{t('json.help.1')}</li>
              <li>{t('json.help.2')}</li>
              <li>{t('json.help.3')}</li>
            </ul>
          </div>
        </div>

        {/* SEO Detailed Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('json.longDesc.title')}</h2>
          <div className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <div>
              <p className="mb-4 leading-relaxed">
                {t('json.longDesc.p1').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mb-4 leading-relaxed">
                {t('json.longDesc.p2')}
              </p>
              <p className="leading-relaxed">
                {t('json.longDesc.p3').split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-gray-900 dark:text-gray-100">{part}</strong> : part
                )}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('json.longDesc.p4')}
              </p>
              <p className="mt-4 leading-relaxed">
                {t('json.longDesc.p5')}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}
