import React, { useState, useCallback, useEffect } from 'react';
import { Play, Copy, CheckCircle2, Upload, FileJson, Trash2, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '../components/SEO';
import { useLocation, useParams } from 'react-router-dom';

export function JsonSchemaGenerator() {
  const { t, i18n } = useTranslation();
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

    
      
      {/* 하드코딩된 SEO 텍스트 콘텐츠 */}
      <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700 max-w-4xl mx-auto space-y-12 pb-12">
        
        {/* FAQ Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '자주 묻는 질문 (FAQ)' : i18n.language === 'ja' ? 'よくある質問 (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON Schema Generator 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                JSON Schema Generator 도구는 generate json schemas 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON Schema Generator 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! JSON Schema Generator의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. JSON Schema Generator 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON Schema Generator ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                JSON Schema Generator ツールは、generate json schemas するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON Schema Generator を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！JSON Schema Generator のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。JSON Schema Generator ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the JSON Schema Generator tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The JSON Schema Generator is a specialized utility designed to generate json schemas. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the JSON Schema Generator?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the JSON Schema Generator happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The JSON Schema Generator is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
              </p>
            </div>
            </div>
          )}
        </section>

        {/* Use Cases Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '이 툴이 필요한 구체적인 실무 사례 3가지' : i18n.language === 'ja' ? 'このツールが必要な3つの具体的な実務ケース' : '3 Specific Practical Use Cases'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 generate json schemas 작업이 필요할 때 매우 유용합니다.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                클라이언트의 민감한 데이터를 다루고 있어 서버 측 도구를 사용할 수 없을 때 안전하게 사용할 수 있습니다.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                교육적 목적으로 학생이나 초보자들이 관련 프로세스가 시각적으로 어떻게 작동하는지 이해하는 데 도움을 줍니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                プロジェクトの作業中に、開発環境を離れることなく迅速に generate json schemas したい場合に非常に便利です。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                クライアントの機密データを扱っており、サーバー側のツールを使用して処理できない場合に安全に使用できます。
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                教育目的で、学生や初心者が関連するプロセスが視覚的にどのように機能するかを理解するのに役立ちます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When you are working on a project and need to quickly generate json schemas without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to generate json schemas.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how generate processes work visually.
              </p>
            </div>
            </div>
          )}
        </section>

        {/* Precautions Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">
              {i18n.language === 'ko' ? '사용 시 주의사항 및 에러 해결법' : i18n.language === 'ja' ? '使用上の注意とエラー解決策' : 'Precautions & Error Resolution'}
            </h2>
          </div>
          
          {i18n.language === 'ko' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">대용량 데이터를 처리할 때 성능 저하를 방지하려면 브라우저를 최신 버전으로 업데이트하여 사용하시기 바랍니다.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">입력 데이터가 너무 커서 브라우저 메모리 한계를 초과하면 도구가 응답하지 않을 수 있습니다. 이 경우 데이터를 더 작은 크기로 나누어 시도하세요.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">다른 도구로 전환할 때 예기치 않은 서식 문제나 레이아웃 버그가 발생하면 브라우저 캐시를 삭제해 보세요.</span>
              </li>
              </ul>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">大量のデータを処理する際のパフォーマンス低下を防ぐため、ブラウザを最新バージョンにアップデートしてご使用ください。</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">入力データが大きすぎてブラウザのメモリ制限を超えると、ツールが応答しなくなる可能性があります。その場合は、データを小さく分割してお試しください。</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">別のツールに切り替える際に予期しないフォーマットの問題やレイアウトのバグが発生した場合は、ブラウザのキャッシュをクリアしてみてください。</span>
              </li>
              </ul>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-900/30">
              <ul className="space-y-4">
                
              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">Ensure your browser is updated to the latest version to avoid performance issues while processing large inputs.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">If the tool becomes unresponsive, check if the input size exceeds typical browser memory limits. Try splitting your data into smaller chunks.</span>
              </li>

              <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 mt-2 shrink-0"></div>
                <span className="leading-relaxed text-sm">Clear your browser cache if you experience unexpected formatting or layout bugs when switching between different tools.</span>
              </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}