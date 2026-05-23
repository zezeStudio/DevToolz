import fs from 'fs';

let text = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// The file has actual unescaped newline characters in places where it should be a \n.
// This was caused by my attempts to fix things with regex replace. Let's fix the specific places:

text = text.replace(/=> \`: \\\[\\n\\{([^\n]+)\\}\\n\\\]\`,/g, '=> `: [\\n{${resolveBody(innerBody, depth + 1)}}\\n]`,');
text = text.replace(/=> \`: \\{\\n([^\n]+)\\n\\}\`,/g, '=> `: {\\n${resolveBody(innerBody, depth + 1)}\\n}`,');

// Wait, the template literals are actually fine if they are enclosed in backticks (`).
// If they are enclosed in `...`, unescaped newlines ARE allowed in TS/JS.
// BUT wait, looking closely at 183: 
//         resolved = resolved.replace(
//           arrayRegex,
//           () => `: [
// {${resolveBody(innerBody, depth + 1)}}
// ]`,
//         );

// This is perfectly valid! Why is there a syntax error?
// Ah! It's `[;,]\\s*(?=\\})/g, "` followed by a newline followed by `");`
// And `/(^|[\\{\\,` followed by a newline followed by `]\\s*)([a-zA-Z0-9_$]+)\\s*\\??\\s*:/g,`
// And `block = \`{\` followed by a newline followed by `${block}` and another newline and `}\`;`
// And in the `placeholder` below.

// So the literal newlines are inside double quotes or regexes!

text = text.replace('block = block.replace(/[;,]\\s*(?=\\})/g, "\\n");', 'block = block.replace(/[;,]\\\\s*(?=\\\\\\})/g, "\\\\n");');
text = text.replace(/(block\.replace\(\/\[;,\]\\s\*\(\?\=\\\}\)\/g,\s*")\n("\);)/g, '$1\\n$2');
text = text.replace(/(block\.replace\(\n\s*\/\(\^\|\[\\\{\\\,\n\]\\s\*\)\(\[a-zA-Z0-9_\$\]\+\)\\s\*\?\?\\s\*:\/g,)/, 'block.replace(/(^|[\\\\{\\\\,\\\\n]\\\\s*)([a-zA-Z0-9_$]+)\\\\s*\\\\??\\\\s*:/g,');

// For block = {\n${block}\n}; it must be backticks, let's see.
text = text.replace(/block = `\\{\\n\$\{block\}\\n\\}`;/g, 'block = `{\\n${block}\\n}`;');
text = text.replace(/block = "\{\n\$\{block\}\n\}";/g, 'block = `{\\n${block}\\n}`;'); // just in case it got double quotes.
// Let's print problematic areas first to just write them correctly.
fs.writeFileSync('src/pages/JsonToTsConverter.tsx', text);

