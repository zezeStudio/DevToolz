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
  Type,
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

function generateMockFromTs(tsCode: string): string {
  try {
    const cleanCode = tsCode.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

    // Extract all interfaces
    const interfaces: Record<string, string> = {};
    const interfaceOrder: string[] = [];

    let current = 0;
    while (true) {
      const match = cleanCode
        .substring(current)
        .match(/interface\s+([A-Za-z0-9_$]+)\s*\{/);
      if (!match) break;

      const name = match[1];
      const startIdx = current + match.index! + match[0].length - 1; // '{' position

      let depth = 0;
      let endIdx = -1;
      for (let i = startIdx; i < cleanCode.length; i++) {
        if (cleanCode[i] === "{") depth++;
        else if (cleanCode[i] === "}") {
          depth--;
          if (depth === 0) {
            endIdx = i;
            break;
          }
        }
      }

      if (endIdx === -1) break;

      const body = cleanCode.substring(startIdx + 1, endIdx);
      interfaces[name] = body;
      interfaceOrder.push(name);
      current = endIdx + 1;
    }

    if (interfaceOrder.length === 0) {
      // Default to parsing whatever braces exist if no 'interface' keyword is present
      let start = cleanCode.indexOf("{");
      if (start === -1) return '{\n  "error": "No interface body found."\n}';

      let depth = 0;
      let end = -1;
      for (let i = start; i < cleanCode.length; i++) {
        if (cleanCode[i] === "{") depth++;
        else if (cleanCode[i] === "}") {
          depth--;
          if (depth === 0) {
            end = i;
            break;
          }
        }
      }

      if (end === -1) return '{\n  "error": "Unmatched braces."\n}';

      let body = cleanCode.substring(start + 1, end);
      interfaces["Root"] = body;
      interfaceOrder.push("Root");
    }

    // Find root (heuristic: interface not used natively as a type in other interfaces)
    let rootName = interfaceOrder[0]; // fallback
    for (const name of interfaceOrder) {
      let isReferenced = false;
      for (const otherName of interfaceOrder) {
        if (name === otherName) continue;
        const body = interfaces[otherName];
        const reg = new RegExp(`:\s*${name}(?![a-zA-Z0-9_$])`);
        const regArray = new RegExp(`:\s*${name}\s*\[\]`);
        if (reg.test(body) || regArray.test(body)) {
          isReferenced = true;
          break;
        }
      }
      if (!isReferenced) {
        rootName = name;
        break; // found the first unreferenced, assume it's Root
      }
    }

    function resolveBody(body: string, depth: number = 0): string {
      if (!body) return "";
      if (depth > 10) return '"{circular reference}"';
      let resolved = body.replace(/\?/g, "");

      // Generic Union Type Processor
      resolved = resolved.replace(/:\s*([^;,\n]+)/g, (match, typeValue) => {
        if (typeof typeValue === 'string' && typeValue.includes('|')) {
          const firstValue = typeValue.split('|')[0].trim().replace(/["']/g, '');
          if (["string", "number", "boolean", "any", "Date"].includes(firstValue) || firstValue.endsWith('[]')) {
            return ": " + firstValue;
          }
          if (interfaces[firstValue]) {
            return ": " + firstValue;
          }
          return `: "${firstValue}"`;
        }
        return match;
      });

      // Primitives Arrays
      resolved = resolved
        .replace(/:\s*string\s*\[\]/g, ': ["sample string"]')
        .replace(/:\s*number\s*\[\]/g, ": [123]")
        .replace(/:\s*boolean\s*\[\]/g, ": [true]")
        .replace(/:\s*any\s*\[\]/g, ": [null]");

      // Primitives
      resolved = resolved
        .replace(/:\s*string/g, ': "sample string"')
        .replace(/:\s*number/g, ": 123")
        .replace(/:\s*boolean/g, ": true")
        .replace(/:\s*Date/g, ': "2026-05-22T00:00:00Z"')
        .replace(/:\s*any/g, ": null");

      // Custom Types
      for (const [name, innerBody] of Object.entries(interfaces)) {
        // match array structure
        const arrayRegex = new RegExp(`:\s*${name}\s*\[\]`, "g");
        resolved = resolved.replace(
          arrayRegex,
          () => `: [
{${resolveBody(innerBody, depth + 1)}}
]`,
        );

        // match object
        const typeRegex = new RegExp(`:\s*${name}(?![a-zA-Z0-9_$])`, "g");
        resolved = resolved.replace(
          typeRegex,
          () => `: {
${resolveBody(innerBody, depth + 1)}
}`,
        );
      }

      // Fallback for unhandled custom types (like external or missing types)
      resolved = resolved.replace(/:\s*[A-Z][a-zA-Z0-9_$]*\s*\[\]/g, ": [{}]");
      resolved = resolved.replace(/:\s*[A-Z][a-zA-Z0-9_$]*/g, ": {}");

      // Wrap local keys for this depth level
      resolved = resolved.replace(/(^|[\{\,\n\[])\s*([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');

      return resolved;
    }

    let block = resolveBody(interfaces[rootName]);

    block = block.replace(/[;,]\s*(?=\})/g, "\n");
    block = block.replace(/;/g, ",");
    block = block.replace(/,\s*\}/g, "}");

    // Make sure we form a valid JSON object
    block = `{\n${block}\n}`;

    let parsed;
    try {
      block = block.replace(/,\s*\]/g, "]");
      block = block.replace(/,\s*\}/g, "}");

      parsed = JSON.parse(block);
    } catch (parseError) {
      return block; // fallback just return the raw attempt if we can't parse it
    }

    return JSON.stringify(parsed, null, 2);
  } catch (e: any) {
    return '{\n  "error": "Failed to parse. Please provide a valid TypeScript structure."\n}';
  }
}

export function JsonToTsConverter() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"jsonToTs" | "tsToJson">(
    "jsonToTs",
  );

  const [jsonInput, setJsonInput] = useState("");
  const [interfaceName, setInterfaceName] = useState("Root");
  const [tsOutput, setTsOutput] = useState("");

  const [tsInput, setTsInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { lang } = useParams();
  const currentLang = lang || "en";

  useEffect(() => {
    if (activeTab === "jsonToTs") {
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
    } else {
      setError(null);
      if (!tsInput.trim()) {
        setJsonOutput("");
        return;
      }
      const result = generateMockFromTs(tsInput);
      setJsonOutput(result);
    }
  }, [jsonInput, interfaceName, tsInput, activeTab]);

  const handleCopy = useCallback(async () => {
    const textToCopy = activeTab === "jsonToTs" ? tsOutput : jsonOutput;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  }, [tsOutput, jsonOutput, activeTab]);

  const handleClear = () => {
    if (activeTab === "jsonToTs") {
      setJsonInput("");
      setTsOutput("");
    } else {
      setTsInput("");
      setJsonOutput("");
    }
    setError(null);
  };

  const handleSampleData = () => {
    if (activeTab === "jsonToTs") {
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
    } else {
      setTsInput(`export interface ApiResponse {
  status: string;
  data: Data;
}

export interface Data {
  user: User;
  preferences: Preferences;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  profile: Profile;
}

export interface Profile {
  avatarUrl: string;
  lastLogin: string;
}

export interface Preferences {
  theme: string;
  notificationsEnabled: boolean;
}`);
    }
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

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab("jsonToTs")}
          className={cn(
            "px-6 py-3 font-medium text-sm flex items-center border-b-2 transition-colors",
            activeTab === "jsonToTs"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
          )}
        >
          <FileJson className="w-4 h-4 mr-2" />
          JSON → TS
        </button>
        <button
          onClick={() => setActiveTab("tsToJson")}
          className={cn(
            "px-6 py-3 font-medium text-sm flex items-center border-b-2 transition-colors",
            activeTab === "tsToJson"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300",
          )}
        >
          <Type className="w-4 h-4 mr-2" />
          TS → JSON (Mock)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 h-[500px]">
        {/* Input Section */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-3 w-full">
              <span className="font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {activeTab === "jsonToTs" ? "Input JSON" : "Input TypeScript"}
              </span>
              {activeTab === "jsonToTs" && (
                <input
                  type="text"
                  placeholder="Root Interface Name (e.g. User)"
                  value={interfaceName}
                  onChange={(e) => setInterfaceName(e.target.value)}
                  className="flex-1 text-sm bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 border rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={activeTab === "jsonToTs" ? jsonInput : tsInput}
              onChange={(e) =>
                activeTab === "jsonToTs"
                  ? setJsonInput(e.target.value)
                  : setTsInput(e.target.value)
              }
              className="w-full h-full p-4 resize-none bg-transparent focus:outline-none focus:ring-0 dark:text-slate-200 font-mono text-sm leading-relaxed"
              placeholder={
                activeTab === "jsonToTs"
                  ? '{\n  "id": 1,\n  "name": "DevToolz",\n  "features": ["conversion", "formatting"]\n}'




                  : `interface User {\n  id: string;\n  name: string;\n  isActive: boolean;\n}`




              }
              spellCheck={false}
            />
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
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
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {activeTab === "jsonToTs"
                ? "TypeScript Interfaces"
                : "Mock JSON Data"}
            </span>
            <button
              onClick={handleCopy}
              disabled={activeTab === "jsonToTs" ? !tsOutput : !jsonOutput}
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
            {error && activeTab === "jsonToTs" ? (
              <div className="p-4 text-rose-500 dark:text-rose-400 font-mono text-sm leading-relaxed">
                Error: {error}
              </div>
            ) : (activeTab === "jsonToTs" ? tsOutput : jsonOutput) ? (
              <pre className="p-4 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300 w-full">
                {activeTab === "jsonToTs" ? tsOutput : jsonOutput}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 font-mono text-sm">
                {activeTab === "jsonToTs"
                  ? "Generated types will appear here"
                  : "Mock JSON will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Long Description for SEO and Guide */}
      <div className="prose dark:prose-invert max-w-none mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-4">
          {t("jsonTs.longDesc.title") ||
            "About JSON to TypeScript Converter (with Mock Generator)"}
        </h2>

        <p>
          {t("jsonTs.longDesc.p1") ||
            "The JSON to TypeScript Converter is a specialized local tool designed to help frontend developers and AI engineers instantly generate strictly typed interfaces from JSON objects or AI API responses. It now additionally supports bi-directional TS to JSON mock generator for robust client-side development."}
        </p>

        <p>
          {t("jsonTs.longDesc.p2") ||
            "Our implementation uses a Pure JS algorithm locally in your browser. This means your private JSON payloads, proprietary schema structures, and actual API response data are never transmitted to an external server—ensuring 100% absolute data privacy and immediate live transformation."}
        </p>

        <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 p-5 rounded-lg my-6">
          <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-200">
            {t("jsonTs.help.title") || "How to use this tool"}
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>
              <strong>Step 1:</strong> Use the Tab menu to switch between "JSON
              to TS" and "TS to JSON (Mock)" mode.
            </li>
            <li>
              <strong>Step 2:</strong>{" "}
              {t("jsonTs.help.1") ||
                "Paste your JSON data into the left editor."}
            </li>
            <li>
              <strong>Step 3 (JSON to TS):</strong>{" "}
              {t("jsonTs.help.2") ||
                "You can define the custom name for your Root Interface in the input field above the JSON editor."}
            </li>
            <li>
              <strong>Step 3:</strong>{" "}
              {t("jsonTs.help.3") ||
                "The tool will instantly parse the structure and map it into perfect output code on the right."}
            </li>
            <li>
              <strong>Tip:</strong>{" "}
              {t("jsonTs.help.4") ||
                'Click "Sample Data" to see a complex response and quickly verify how nested objects are automatically extracted.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
