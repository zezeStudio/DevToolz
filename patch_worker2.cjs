const fs = require('fs');
let content = fs.readFileSync('src/pages/JsonFormatter.tsx', 'utf-8');

// replace formatJson
const oldFormat = `  const formatJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      let formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    }
  };`;

const newFormat = `  const formatJson = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('format', input);
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
content = content.replace(oldFormat, newFormat);

// minifyJson
const oldMinify = `  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      setIsValid(true);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    }
  };`;
const newMinify = `  const minifyJson = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('minify', input);
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
content = content.replace(oldMinify, newMinify);

// validateJson
const oldValidate = `  const validateJson = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setOutput(input);
      setError(null);
      setIsValid(true);
      setShowToast(t('json.msg.valid'));
      setTimeout(() => setShowToast(null), 3000);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    }
  };`;
const newValidate = `  const validateJson = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    try {
      const result = await processInWorker('validate', input);
      setOutput(result);
      setError(null);
      setIsValid(true);
      setShowToast(t('json.msg.valid'));
      setTimeout(() => setShowToast(null), 3000);
    } catch (err) {
      const errMessage = (err as Error).message;
      setError(errMessage);
      setErrorLine(getErrorLine(errMessage, input));
      setIsValid(false);
    } finally {
      setIsProcessing(false);
    }
  };`;
content = content.replace(oldValidate, newValidate);

fs.writeFileSync('src/pages/JsonFormatter.tsx', content);
