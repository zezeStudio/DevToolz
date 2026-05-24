import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SEO } from "../components/SEO";
import {
  FileCode,
  ArrowRight,
  Copy,
  Check,
  Trash2,
  Wand2,
  FileJson,
} from "lucide-react";
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
  const { t } = useTranslation();

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
    </div>
  );
}
