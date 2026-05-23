let resolved = "tier: 'GOLD' | 'SILVER' | 'BRONZE';";
resolved = resolved.replace(/:\\s*(['"][^'"]+['"])(?:\\s*\\|\\s*(?:['"][^'"]+['"]))+/g, ': $1');
console.log(resolved);
