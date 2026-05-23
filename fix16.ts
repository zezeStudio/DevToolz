import * as fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// Replace literal newlines inside " " with '\\n'
 // These look like: .join("
 // ")
content = content.replace(/\.join\("[\r\n]+"\)/g, ".join('\\n')");

// We might also have replaces with literal newlines, like: 
// replace(/: "([^"]+)"/g, ": $1")  or something similar. Let me check the code.
fs.writeFileSync('src/pages/JsonToTsConverter.tsx', content, 'utf-8');
