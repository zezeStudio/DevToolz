const text = \`tier: "GOLD" | "SILVER" | "BRONZE";
status: 1 | 2 | 3;
type: 'A' | 'B';\`;
console.log(text.replace(/:\\s*(['"][^'"]+['"])(?:\\s*\\|\\s*(?:['"][^'"]+['"]))+/g, ": $1"));
console.log(text.replace(/:\\s*(['"][a-zA-Z0-9_]+['"])(?:\\s*\\|\\s*(?:['"][a-zA-Z0-9_]+['"]))+/g, ": $1"));

