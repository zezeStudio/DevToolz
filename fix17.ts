import * as fs from 'fs';

let text = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

// The newlines are unescaped string literals. I use an advanced regex to fix them safely.
// Note: instead of finding all of them, I will just rewrite the broken sections to ensure correctness.

text = text.replace(/block \= block\.replace\(\/\[;\,\]\\s\*\(\?\=\\\}\)\/g\,\ .*/gs, (match) => {
    // This is getting complicated, let's just use string replace on the known literal lines
    return match;
});
