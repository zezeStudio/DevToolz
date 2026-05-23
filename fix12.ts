import fs from 'fs';

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

const startToken = '      // Literal Unions (e.g., "GOLD" | "SILVER")';
const endToken = '      // Primitives Arrays';

const startIndex = content.indexOf(startToken);
const endIndex = content.indexOf(endToken);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    const middle = startToken + '\\n' +
                   '      resolved = resolved.replace(/:\\\\s*(["\'][a-zA-Z0-9_\\\\-\\\\s]+["\'])(?:\\\\s*\\\\|\\\\s*(?:["\'][a-zA-Z0-9_\\\\-\\\\s]+["\']))+/g, ": $1");\\n' +
                   '      \\n' +
                   '      // Literal Number Unions (e.g., 1 | 2 | 3)\\n' +
                   '      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ": $1");\\n\\n';
    
    fs.writeFileSync('src/pages/JsonToTsConverter.tsx', before + middle + after, 'utf-8');
    console.log("Success");
} else {
    console.log("Tokens not found");
}
