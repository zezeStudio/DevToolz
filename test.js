const text = \`
  tier: "GOLD" | "SILVER" | "BRONZE",
  status: 1 | 2 | 3,
  type: 'A' | 'B'
\`;

let resolved = text.replace(/:\\s*(["'][a-zA-Z0-9_\\-\\s]+["'])(?:\\s*\\|\\s*(?:["'][a-zA-Z0-9_\\-\\s]+["']))+/g, ': $1');
resolved = resolved.replace(/:\\s*([0-9]+)(?:\\s*\\|\\s*[0-9]+)+/g, ': $1');
console.log(resolved);
