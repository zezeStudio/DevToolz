const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

const oldUpload = `  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const errMessage = (err as Error).message;
        setError(errMessage);
        setErrorLine(getErrorLine(errMessage, content));
        setIsValid(false);
      }
      setInput(finalInput);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };`;
const newUpload = `  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setIsProcessing(true);
      try {
        const result = await processInWorker('format', content);
        setInput(result);
        setOutput(result);
        setError(null);
        setIsValid(true);
      } catch (err) {
        const errMessage = (err as Error).message;
        setInput(content);
        setError(errMessage);
        setErrorLine(getErrorLine(errMessage, content));
        setIsValid(false);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };`;
content = content.replace(oldUpload, newUpload);

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
