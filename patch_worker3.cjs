const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

// replace escapeJson
const oldEscape = `  const escapeJson = () => {
    if (!input.trim()) return;
    try {
      // If it's valid JSON, minify it first for cleaner escape
      let toEscape = input;
      try {
        const parsed = JSON.parse(input);
        toEscape = JSON.stringify(parsed);
      } catch {
        // Not valid JSON, just escape raw string
      }
      
      const escaped = JSON.stringify(toEscape).slice(1, -1);
      setOutput(escaped);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };`;
const newEscape = `  const escapeJson = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('escape', input);
      setOutput(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };`;
content = content.replace(oldEscape, newEscape);

// unescapeJson
const oldUnescape = `  const unescapeJson = () => {
    if (!input.trim()) return;
    try {
      // Re-add quotes and parse the escaped JSON string
      const unescapedString = JSON.parse('"' + input + '"');
      // Now format if it's valid JSON
      try {
        const parsed = JSON.parse(unescapedString);
        setOutput(JSON.stringify(parsed, null, 2));
        setError(null);
        setIsValid(true);
      } catch {
        // Not valid JSON, output raw
        setOutput(unescapedString);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };`;
const newUnescape = `  const unescapeJson = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('unescape', input);
      setOutput(result);
      setError(null);
      setIsValid(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };`;
content = content.replace(oldUnescape, newUnescape);

// sortKeys
const oldSort = `  const sortKeys = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const sortObject = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        return Object.keys(obj)
          .sort()
          .reduce((result: any, key) => {
            result[key] = sortObject(obj[key]);
            return result;
          }, {});
      };
      setOutput(JSON.stringify(sortObject(parsed), null, 2));
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    }
  };`;
const newSort = `  const sortKeys = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('sort', input);
      setOutput(result);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    } finally {
      setIsProcessing(false);
    }
  };`;
content = content.replace(oldSort, newSort);

// maskData
const oldMask = `  const maskData = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const maskObject = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(maskObject);
        
        const maskedObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object') {
            maskedObj[key] = maskObject(value);
          } else if (typeof value === 'string') {
            if (value.includes('@')) {
              const [name, domain] = value.split('@');
              maskedObj[key] = \`\${name.charAt(0)}***@\${domain}\`;
            } else if (value.length > 4) {
              maskedObj[key] = \`\${value.substring(0, 2)}***\${value.substring(value.length - 2)}\`;
            } else {
              maskedObj[key] = '***';
            }
          } else if (typeof value === 'number') {
            maskedObj[key] = Number(value.toString().replace(/\\d/g, '9'));
          } else {
            maskedObj[key] = value;
          }
        }
        return maskedObj;
      };
      setOutput(JSON.stringify(maskObject(parsed), null, 2));
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    }
  };`;
const newMask = `  const maskData = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('mask', input);
      setOutput(result);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    } finally {
      setIsProcessing(false);
    }
  };`;
content = content.replace(oldMask, newMask);

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
