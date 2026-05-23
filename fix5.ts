import * as fs from 'fs';

let code = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// The base64 for "      // Literal Unions (e.g., \"GOLD\" | \"SILVER\")\n      resolved = resolved.replace(/:\\\\s*([\"\'][^\"\']+[\"\'])(?:\\\\s*\\\\|\\\\s*(?:[\"\'][^\"\']+[\"\']))+/g, ': $1');\n      \n      // Literal Number Unions (e.g., 1 | 2 | 3)\n      resolved = resolved.replace(/:\\\\s*([0-9]+)(?:\\\\s*\\\\|\\\\s*[0-9]+)+/g, ': $1');" is complex, let's just do search and split.

let marker1 = '      // Literal Unions (e.g., "GOLD" | "SILVER")';
let marker2 = '      // Primitives Arrays';

let startIndex = code.indexOf(marker1);
let endIndex = code.indexOf(marker2);

if (startIndex !== -1 && endIndex !== -1) {
    let before = code.substring(0, startIndex);
    let after = code.substring(endIndex);
    let mid = \`      // Literal Unions (e.g., "GOLD" | "SILVER")
      resolved = resolved.replace(/:\\s*(["'][a-zA-Z0-9_\\-\\s]+["'])(?:\\s*\\|\\s*(?:["'][a-zA-Z0-9_\\-\\s]+["']))+/g, ': $1');
      
      // Literal Number Unions (e.g., 1 | 2 | 3)
      resolved = resolved.replace(/:\\s*([0-9]+)(?:\\s*\\|\\s*[0-9]+)+/g, ': $1');

\`;
    fs.writeFileSync('src/pages/JsonToTsConverter.tsx', before + mid + after);
    console.log("Success");
} else {
    console.log("Not found");
}
