import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/SEO";
import { FileCode, ArrowRight, Copy, Check, Trash2, Wand2, FileJson, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { useParams } from "react-router-dom";
import { cn } from "../lib/utils";

function generateTypeScriptInterfaces(
  jsonString: string,
  rootName: string = "Root",
): string {
  try {
    let sanitizedInput = jsonString.replace(/:\s*"([^"]+)"\s*\|\s*[^\n,]+/g, ': "$1"');
    // Also strip union primitive numbers if any
    sanitizedInput = sanitizedInput.replace(/:\s*([0-9]+)\s*\|\s*[^\n,]+/g, ': $1');

    const obj = JSON.parse(sanitizedInput);
    let interfaces: Record<string, string[]> = {};
    let currentInterfaceName = rootName;

    function getType(val: any, arrayName: string): string {
      if (val === null) return "any | null";
      if (Array.isArray(val)) {
        if (val.length === 0) return "any[]";
        const type = getType(val[0], arrayName);
        return `${type.includes("|") ? `(${type})` : type}[]`;
      }
      if (typeof val === "object") {
        const interfaceName =
          arrayName.charAt(0).toUpperCase() + arrayName.slice(1);
        parseObject(val, interfaceName);
        return interfaceName;
      }
      return typeof val;
    }

    function parseObject(obj: Record<string, any>, name: string) {
      if (interfaces[name]) return; // avoid duplicates if possible, though simple
      let fields: string[] = [];
      for (const key in obj) {
        const type = getType(obj[key], key);
        // Check if key is valid identifier
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
          ? key
          : `"${key}"`;
        fields.push(`  ${safeKey}: ${type};`);
      }
      interfaces[name] = fields;
    }

    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
      return `type ${rootName} = ${getType(obj, rootName)};`;
    }

    parseObject(obj, rootName);

    let output = "";
    for (const [name, fields] of Object.entries(interfaces)) {
      output += `export interface ${name} {\n${fields.join("\n")}\n}\n\n`;
    }
    return output.trim();
  } catch (error) {
    return "Invalid JSON";
  }
}

export function JsonToTsConverter() {
  const { t, i18n } = useTranslation();

  const [jsonInput, setJsonInput] = useState("");
  const [interfaceName, setInterfaceName] = useState("Root");
  const [tsOutput, setTsOutput] = useState("");

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { lang } = useParams();
  const currentLang = lang || "en";

  useEffect(() => {
    setError(null);
    if (!jsonInput.trim()) {
      setTsOutput("");
      return;
    }
    try {
      let sanitizedInput = jsonInput.replace(/:\s*"([^"]+)"\s*\|\s*[^\n,]+/g, ': "$1"');
      sanitizedInput = sanitizedInput.replace(/:\s*([0-9]+)\s*\|\s*[^\n,]+/g, ': $1');

      JSON.parse(sanitizedInput);
      const result = generateTypeScriptInterfaces(
        sanitizedInput,
        interfaceName || "Root",
      );
      setTsOutput(result);
    } catch (e: any) {
      setError(e.message || "Invalid JSON format");
      setTsOutput("");
    }
  }, [jsonInput, interfaceName]);

  const handleCopy = useCallback(async () => {
    if (!tsOutput) return;
    try {
      await navigator.clipboard.writeText(tsOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  }, [tsOutput]);

  const handleClear = () => {
    setJsonInput("");
    setTsOutput("");
    setError(null);
  };

  const handleSampleData = () => {
    setInterfaceName("ApiResponse");
    setJsonInput(`{
  "status": "success",
  "data": {
    "user": {
      "id": "USR-123",
      "name": "Alex Developer",
      "email": "alex@example.com",
      "roles": ["admin", "editor"],
      "profile": {
        "avatarUrl": "https://example.com/avatar.png",
        "lastLogin": "2026-05-22T17:19:00Z"
      }
    },
    "preferences": {
      "theme": "dark",
      "notificationsEnabled": true
    }
  }
}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <SEO
        title={
          t("jsonTs.seoTitle") || "JSON to TypeScript Converter | DevToolz"
        }
        description={
          t("jsonTs.desc") ||
          "Convert JSON objects to TypeScript interfaces instantly."
        }
        url={`/${currentLang}/json-to-ts`}
      />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
          <FileCode className="mr-3 h-8 w-8 text-blue-600" />
          {t("nav.jsonTs") || "JSON to TS Converter"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("jsonTs.desc") ||
            "Convert JSON objects to TypeScript interfaces instantly. Perfect for strongly typing your AI API responses."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-[500px]">
        {/* Input Section */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center space-x-3 w-full">
              <span className="font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                Input JSON
              </span>
              <input
                type="text"
                placeholder="Root Interface Name (e.g. User)"
                value={interfaceName}
                onChange={(e) => setInterfaceName(e.target.value)}
                className="flex-1 text-sm dark:bg-slate-800 border-slate-300 dark:border-slate-700 border rounded px-2 py-1 focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-full p-4 resize-none focus:outline-none focus:ring-0 dark:text-slate-200 font-mono text-sm leading-relaxed bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/[0.06]"
              placeholder={
                '{\n  "id": 1,\n  "name": "DevToolz",\n  "features": ["conversion", "formatting"]\n}'
              }
              spellCheck={false}
            />
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSampleData}
                className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center px-2 py-1"
              >
                <Wand2 className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">
                  {t("common.sampleData") || "Sample Data"}
                </span>
              </button>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <button
                onClick={handleClear}
                className="text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors flex items-center px-2 py-1"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline">
                  {t("common.clear") || "Clear"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              TypeScript Interfaces
            </span>
            <button
              onClick={handleCopy}
              disabled={!tsOutput}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors disabled:opacity-50 flex items-center"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex-1 relative bg-slate-50 dark:bg-slate-900 overflow-auto">
            {error ? (
              <div className="p-4 text-rose-500 dark:text-rose-400 font-mono text-sm leading-relaxed">
                Error: {error}
              </div>
            ) : tsOutput ? (
              <pre className="p-4 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300 w-full">
                {tsOutput}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-400 font-mono text-sm">
                Generated types will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Long Description for SEO and Guide */}
      <div className="prose dark:prose-invert max-w-none mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          {t("jsonTs.seo.title")}
        </h2>

        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {t("jsonTs.seo.p1")}
        </p>

        <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
          {t("jsonTs.seo.h2")}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {t("jsonTs.seo.p2")}
        </p>
        
        <h3 className="text-xl font-bold mt-8 mb-3 text-slate-900 dark:text-white">
          {t("jsonTs.seo.h3")}
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          {t("jsonTs.seo.p3")}
        </p>

        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl my-6">
          <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
            {t("jsonTs.help.title") || "Practical Usage Examples"}
          </h3>
          <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Direct Input:</strong>{" "}
              Simply paste the raw JSON response received from Postman, curl, or your network tab directly into the left editor pane.
            </li>
            <li>
              <strong>Custom Root Interface:</strong>{" "}
              Use the input field in the header bar above the editor (defaulted to 'Root') to name your primary parent interface. For example, enter `ProductListResponse`.
            </li>
            <li>
              <strong>Instant Compilation:</strong>{" "}
              As you adjust the JSON, the recursive parser instantly updates the TypeScript definitions on the right pane in real-time.
            </li>
            <li>
              <strong>Clipboard Ready:</strong>{" "}
              Click the 'Copy' icon to place the resulting interfaces into your clipboard, ready to be pasted instantly into your `types.ts` or `.d.ts` declaration files.
            </li>
          </ul>
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
                JSON to TS Converter 도구는 어디에 사용되나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                JSON to TS Converter 도구는 convert json to typescript interfaces 작업을 수행하기 위해 특별히 설계된 유틸리티입니다. 개발자와 전문가들이 외부 소프트웨어 설치 없이 브라우저에서 직접 간편하게 사용하여 작업 흐름을 개선할 수 있도록 돕습니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON to TS Converter 사용 시 내 데이터는 안전한가요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                네, 안전합니다! JSON to TS Converter의 모든 데이터 처리는 사용자의 로컬 브라우저 내에서만 이루어집니다. 입력된 텍스트, 코드, 파일 등은 외부 서버로 전송되지 않으므로 민감한 데이터의 완벽한 프라이버시와 보안이 보장됩니다.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                모바일 기기에서도 이 도구를 사용할 수 있나요?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                물론입니다. JSON to TS Converter 도구는 데스크톱 및 모바일 웹 브라우저 모두에 최적화된 반응형 디자인을 제공합니다. 스마트폰이나 태블릿에서도 모든 기능을 원활하게 사용할 수 있습니다.
              </p>
            </div>
            </div>
          )}
          
          {i18n.language === 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON to TS Converter ツールは何に使用されますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                JSON to TS Converter ツールは、convert json to typescript interfaces するために特別に設計されたユーティリティです。外部ソフトウェアをインストールすることなく、ブラウザ上で直接簡単に使用できるため、開発者や専門家のワークフローを効率化するのに役立ちます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                JSON to TS Converter を使用する際、私のデータは安全ですか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                はい、安全です！JSON to TS Converter のすべての処理は、ローカルのブラウザ内のみで行われます。入力されたテキスト、コード、ファイルなどは外部サーバーに送信されないため、機密データの完全なプライバシーとセキュリティが保証されます。
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                モバイルデバイスでもこのツールを使用できますか？
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                もちろんです。JSON to TS Converter ツールは、デスクトップおよびモバイルのウェブブラウザの両方に最適化されたレスポンシブデザインを提供します。スマートフォンやタブレットでもすべての機能をスムーズに利用できます。
              </p>
            </div>
            </div>
          )}
          
          {i18n.language !== 'ko' && i18n.language !== 'ja' && (
            <div className="space-y-6">
              
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                What is the JSON to TS Converter tool used for?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                The JSON to TS Converter is a specialized utility designed to convert json to typescript interfaces. It helps developers and professionals streamline their workflow by providing an easy-to-use interface directly in the browser, without needing to install external software.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Is my data safe when using the JSON to TS Converter?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Yes! All processing for the JSON to TS Converter happens entirely within your local browser. We do not send your inputted text, code, or files to any external servers, ensuring complete privacy and security for your sensitive data.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">Q.</span>
                Can I use this tool on mobile devices?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">A.</span>
                Absolutely. The JSON to TS Converter is fully responsive and optimized for both desktop and mobile web browsers. You can access all its features seamlessly on your smartphone or tablet.
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
                프로젝트 작업 중 개발 환경을 벗어나지 않고 신속하게 convert json to typescript interfaces 작업이 필요할 때 매우 유용합니다.
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
                プロジェクトの作業中に、開発環境を離れることなく迅速に convert json to typescript interfaces したい場合に非常に便利です。
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
                When you are working on a project and need to quickly convert json to typescript interfaces without leaving your development environment.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                When dealing with sensitive client data where you cannot risk using server-side tools to convert json to typescript interfaces.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                For educational purposes, helping students and beginners understand how convert processes work visually.
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