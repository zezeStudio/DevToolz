import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Copy, CheckCircle2, Bot, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { useLocation, useParams } from 'react-router-dom';

type DataType = 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object';
type Provider = 'openai' | 'anthropic' | 'gemini';

interface Parameter {
  id: string;
  name: string;
  type: DataType;
  description: string;
  isRequired: boolean;
  enumValues?: string;
}

interface ToolDef {
  id: string;
  name: string;
  description: string;
  parameters: Parameter[];
  isExpanded: boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export function FunctionCallingBuilder() {
  const { t } = useTranslation();
  const { lang = 'en' } = useParams();
  
  const [provider, setProvider] = useState<Provider>('openai');
  const [copied, setCopied] = useState(false);
  const [tools, setTools] = useState<ToolDef[]>([
    {
      id: generateId(),
      name: '',
      description: '',
      isExpanded: true,
      parameters: []
    }
  ]);

  const loadSample = () => {
    setTools([
      {
        id: generateId(),
        name: 'get_weather',
        description: t('functionBuilder.sample.desc') || 'Get the current weather in a given location',
        isExpanded: true,
        parameters: [
          {
            id: generateId(),
            name: 'location',
            type: 'string',
            description: t('functionBuilder.sample.param1Desc') || 'The city and state, e.g. San Francisco, CA',
            isRequired: true,
          },
          {
            id: generateId(),
            name: 'unit',
            type: 'string',
            description: t('functionBuilder.sample.param2Desc') || 'The temperature unit to use. Infer this from the users location.',
            isRequired: false,
            enumValues: 'celsius, fahrenheit'
          }
        ]
      }
    ]);
  };

  const addTool = () => {
    setTools([
      ...tools,
      {
        id: generateId(),
        name: '',
        description: '',
        isExpanded: true,
        parameters: [],
      }
    ]);
  };

  const updateTool = (id: string, updates: Partial<ToolDef>) => {
    setTools(tools.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTool = (id: string) => {
    setTools(tools.filter(t => t.id !== id));
  };

  const toggleToolExpand = (id: string) => {
    setTools(tools.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t));
  };

  const addParameter = (toolId: string) => {
    setTools(tools.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          parameters: [
            ...t.parameters,
            {
              id: generateId(),
              name: '',
              type: 'string',
              description: '',
              isRequired: false,
              enumValues: ''
            }
          ]
        };
      }
      return t;
    }));
  };

  const updateParameter = (toolId: string, paramId: string, updates: Partial<Parameter>) => {
    setTools(tools.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          parameters: t.parameters.map(p => p.id === paramId ? { ...p, ...updates } : p)
        };
      }
      return t;
    }));
  };

  const removeParameter = (toolId: string, paramId: string) => {
    setTools(tools.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          parameters: t.parameters.filter(p => p.id !== paramId)
        };
      }
      return t;
    }));
  };

  const generatedPayload = useMemo(() => {
    const buildParametersObj = (params: Parameter[]) => {
      const properties: Record<string, any> = {};
      const required: string[] = [];

      params.forEach(p => {
        if (!p.name.trim()) return;

        properties[p.name] = {
          type: p.type,
          description: p.description,
        };

        if (p.type === 'array') {
          properties[p.name].items = { type: 'string' }; // basic fallback
        }

        if (p.enumValues && p.enumValues.trim() !== '') {
          properties[p.name].enum = p.enumValues.split(',').map(e => e.trim()).filter(e => e !== '');
        }

        if (p.isRequired) {
          required.push(p.name);
        }
      });

      return {
        type: 'object',
        properties,
        ...(required.length > 0 ? { required } : {})
      };
    };

    if (provider === 'openai') {
      const formattedTools = tools.map((tool) => {
        return {
          type: 'function',
          function: {
            name: tool.name || 'unnamed_function',
            description: tool.description,
            parameters: buildParametersObj(tool.parameters)
          }
        };
      });
      return JSON.stringify(formattedTools, null, 2);
    } 
    
    if (provider === 'anthropic') {
      const formattedTools = tools.map((tool) => {
        return {
          name: tool.name || 'unnamed_function',
          description: tool.description,
          input_schema: buildParametersObj(tool.parameters)
        };
      });
      return JSON.stringify(formattedTools, null, 2);
    }

    if (provider === 'gemini') {
      const formattedTools = tools.map((tool) => {
        return {
          name: tool.name || 'unnamed_function',
          description: tool.description,
          parameters: buildParametersObj(tool.parameters)
        };
      });
      return JSON.stringify([{ functionDeclarations: formattedTools }], null, 2);
    }

    return '';
  }, [tools, provider]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <SEO 
        title={t('functionBuilder.seoTitle') || 'LLM Function Calling Payload Builder | DevToolz'}
        description={t('functionBuilder.desc') || 'Visually build and format tools array for OpenAI, Anthropic, and Gemini function calling.'}
        url={`/${lang === 'en' ? '' : lang + '/'}function-calling-builder`}
      />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Wrench className="w-8 h-8 text-indigo-500" />
          {t('functionBuilder.title') || 'LLM Function Calling Builder'}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t('functionBuilder.desc') || 'Visually build and format tools array for OpenAI, Anthropic, and Gemini function calling.'}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Side: GUI Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('functionBuilder.functions') || 'Functions'}</h2>
            <div className="flex gap-2">
              <button
                onClick={loadSample}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
              >
                {t('jsonSchema.loadSample') || 'Load Sample'}
              </button>
              <button
                onClick={addTool}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('functionBuilder.addFunction') || 'Add Function'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div key={tool.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all">
                <div 
                  className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleToolExpand(tool.id)}
                >
                  <div className="flex items-center gap-3">
                    {tool.isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {tool.name || t('functionBuilder.functionN', { n: index + 1 }) || `Function ${index + 1}`}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTool(tool.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {tool.isExpanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('functionBuilder.functionName') || 'Function Name'}</label>
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateTool(tool.id, { name: e.target.value })}
                          placeholder={t('functionBuilder.exName') || 'e.g., get_weather'}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('functionBuilder.descLabel') || 'Description'}</label>
                        <input
                          type="text"
                          value={tool.description}
                          onChange={(e) => updateTool(tool.id, { description: e.target.value })}
                          placeholder={t('functionBuilder.descPlaceholder') || 'What does this function do?'}
                          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{t('functionBuilder.params') || 'Parameters'}</h4>
                        <button
                          onClick={() => addParameter(tool.id)}
                          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          {t('functionBuilder.addParam') || 'Add Parameter'}
                        </button>
                      </div>

                      {tool.parameters.length === 0 ? (
                        <p className="text-sm text-slate-500 italic py-2 text-center">{t('functionBuilder.noParams') || 'No parameters added.'}</p>
                      ) : (
                        <div className="space-y-3">
                          {tool.parameters.map((param) => (
                            <div key={param.id} className="relative bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 pr-10">
                              <button
                                onClick={() => removeParameter(tool.id, param.id)}
                                className="absolute top-3 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-4 space-y-1">
                                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('functionBuilder.paramName') || 'Name'}</label>
                                  <input
                                    type="text"
                                    value={param.name}
                                    onChange={(e) => updateParameter(tool.id, param.id, { name: e.target.value })}
                                    placeholder={t('functionBuilder.exParamName') || 'e.g., location'}
                                    className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('functionBuilder.paramType') || 'Type'}</label>
                                  <select
                                    value={param.type}
                                    onChange={(e) => updateParameter(tool.id, param.id, { type: e.target.value as DataType })}
                                    className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white appearance-none"
                                  >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="integer">integer</option>
                                    <option value="boolean">boolean</option>
                                    <option value="array">array</option>
                                    <option value="object">object</option>
                                  </select>
                                </div>
                                <div className="md:col-span-3 space-y-1 flex flex-col justify-end">
                                  <label className="flex items-center gap-2 cursor-pointer py-1.5">
                                    <input
                                      type="checkbox"
                                      checked={param.isRequired}
                                      onChange={(e) => updateParameter(tool.id, param.id, { isRequired: e.target.checked })}
                                      className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">{t('functionBuilder.required') || 'Required'}</span>
                                  </label>
                                </div>
                                
                                <div className="md:col-span-12 space-y-1 mt-1">
                                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('functionBuilder.descLabel') || 'Description'}</label>
                                  <input
                                    type="text"
                                    value={param.description}
                                    onChange={(e) => updateParameter(tool.id, param.id, { description: e.target.value })}
                                    placeholder={t('functionBuilder.explainParam') || 'Explain parameter...'}
                                    className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                                  />
                                </div>

                                {param.type === 'string' && (
                                  <div className="md:col-span-12 space-y-1">
                                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{t('functionBuilder.enumValues') || 'Enum Values (comma separated, optional)'}</label>
                                    <input
                                      type="text"
                                      value={param.enumValues || ''}
                                      onChange={(e) => updateParameter(tool.id, param.id, { enumValues: e.target.value })}
                                      placeholder={t('functionBuilder.exEnum') || 'e.g., celsius, fahrenheit'}
                                      className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-white"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {tools.length === 0 && (
               <div className="text-center py-12 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                  <Bot className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">{t('functionBuilder.noFunctions') || 'No Functions Defined'}</h3>
                  <p className="text-sm text-slate-500 mb-4">{t('functionBuilder.addFirst') || 'Add your first function to start building the tools payload.'}</p>
                  <button
                    onClick={addTool}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    + {t('functionBuilder.addFunction') || 'Add Function'}
                  </button>
               </div>
            )}
          </div>
        </div>

        {/* Right Side: Payload Output */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('functionBuilder.generatedPayload') || 'Generated Payload'}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                {(['openai', 'anthropic', 'gemini'] as Provider[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                      provider === p
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                disabled={!generatedPayload}
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
          </div>
          <div className="relative">
            <div className="absolute top-0 right-0 p-2 pointer-events-none">
              <span className="px-2 py-1 text-xs font-mono font-medium rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize">
                {provider} {t('functionBuilder.format') || 'Format'}
              </span>
            </div>
            <textarea
              value={generatedPayload}
              readOnly
              className="w-full h-[600px] p-4 pt-10 text-sm font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-[#0d1117] border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none shadow-inner"
              placeholder={t('functionBuilder.payloadPlaceholder') || 'Your tools JSON payload will appear here...'}
            />
          </div>
        </div>
      </div>
      
       {/* Detailed Description Section for SEO */}
       <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t('functionBuilder.longDesc.title') || 'About the Function Calling Builder'}
        </h2>
        
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            {t('functionBuilder.longDesc.p1') || "When building AI Agents using major LLM providers, you often need to provide a 'tools' or 'functions' array so the model knows which external APIs or local functions it can invoke. Writing this JSON payload by hand is tedious and error-prone due to deep nesting and specific schema rules."}
          </p>
          <p>
             {t('functionBuilder.longDesc.p2') || "This builder provides a visual GUI to define your functions, descriptions, and parameters. As you type, it instantly generates the correct, perfectly formatted JSON payload tailored for OpenAI (Chat Completions API), Anthropic (Messages API), or Google Gemini (Function Declarations)."}
          </p>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {t('functionBuilder.help.title') || 'Supported Providers & Formats'}
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>OpenAI:</strong> {t('functionBuilder.help.openai') || 'Uses the tools array format wrapping a type: "function" and the parameters object in standard JSON Schema.'}</li>
              <li><strong>Anthropic:</strong> {t('functionBuilder.help.anthropic') || 'Uses the tools array but with an input_schema instead of parameters.'}</li>
              <li><strong>Gemini:</strong> {t('functionBuilder.help.gemini') || 'Uses functionDeclarations nested inside the tools array.'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
