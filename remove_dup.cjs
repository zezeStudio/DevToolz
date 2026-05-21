const fs = require('fs');

let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

// Find the ones I added: they start with `  const escapeJson = () => {` at line 259
const myEscape = `  const escapeJson = () => {
    if (!input.trim()) return;
    try {
      try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        setOutput(JSON.stringify(minified));
        setIsValid(true);
        setError(null);
        setErrorLine(null);
      } catch {
        setOutput(JSON.stringify(input));
      }
    } catch (err) {
      // Ignore
    }
  };

  const unescapeJson = () => {
    if (!input.trim()) return;
    try {
      const parsedString = JSON.parse(input);
      if (typeof parsedString === 'string') {
        const parsedJson = JSON.parse(parsedString);
        setOutput(JSON.stringify(parsedJson, null, 2));
        setIsValid(true);
        setError(null);
        setErrorLine(null);
      } else {
        throw new Error("Input is not a valid escaped JSON string");
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setErrorLine(getErrorLine(errorMessage, input));
      setIsValid(false);
    }
  };
`;

if (content.includes(myEscape)) {
  content = content.replace(myEscape + '\n', "");
} else {
  // Let's just do a regex replace to catch any slight differences
  const pattern = /  const escapeJson = \(\) => {[\s\S]*?const errorMessage = \(err as Error\)\.message;\n      setError\(errorMessage\);\n      setErrorLine\(getErrorLine\(errorMessage, input\)\);\n      setIsValid\(false\);\n    }\n  };\n\n(?=  const sortKeys = \(\) => {)/;
  content = content.replace(pattern, '');
}

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);

console.log("Removed duplicated functions");
