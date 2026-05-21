const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

if (!content.includes('import JsonWorker from')) {
    content = content.replace(
        "import React, { useState, useRef, useMemo, useEffect } from 'react';",
        "import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';\nimport JsonWorker from '../lib/jsonWorker?worker';"
    );
}

// Add state for worker
if (!content.includes('const [isProcessing')) {
    content = content.replace(
        '  const [input, setInput] = useState(\'\');',
        '  const [input, setInput] = useState(\'\');\n  const [isProcessing, setIsProcessing] = useState(false);\n  const workerRef = useRef<Worker | null>(null);\n\n  useEffect(() => {\n    workerRef.current = new JsonWorker();\n    return () => workerRef.current?.terminate();\n  }, []);\n\n  const processInWorker = useCallback((type: string, payload: string | object) => {\n    return new Promise<any>((resolve, reject) => {\n      if (!workerRef.current) return reject(new Error("Worker not initialized"));\n      const id = Date.now() + Math.random();\n      const handler = (e: MessageEvent) => {\n        if (e.data.id === id) {\n          workerRef.current!.removeEventListener("message", handler);\n          if (e.data.success) resolve(e.data.result);\n          else reject(new Error(e.data.error));\n        }\n      };\n      workerRef.current.addEventListener("message", handler);\n      workerRef.current.postMessage({ id, type, payload });\n    });\n  }, []);'
    );
}

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
