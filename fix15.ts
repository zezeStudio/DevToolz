import fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// The file got literal newlines inside single quotes. We want to put back '\\n' or wrap in backticks.
// It's much easier to just put back '\\n'! 

content = content.replace(/\\{\\n  "error"/g, '{\\\\n  "error"');
content = content.replace(/No interface body found."\\n\\}';/g, 'No interface body found."\\\\n}\\';');
content = content.replace(/Unmatched braces."\\n\\}';/g, 'Unmatched braces."\\\\n}\\';');
content = content.replace(/Failed to parse. Please provide a valid TypeScript structure."\\n\\}';/g, 'Failed to parse. Please provide a valid TypeScript structure."\\\\n}\\';');

fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
