import * as fs from 'fs';

let resolved = \`
  "customer": {
    "id": "sample string",
    "tier": "GOLD" | "SILVER" | "BRONZE",
    "status": 1 | 2 | 3,
    "isVerified": true,
    "tags": ["sample string"]
  }
\`;

resolved = resolved.replace(/:\\s*(["'][^"']+["'])(?:\\s*\\|\\s*(?:["'][^"']+["']))+/g, ': $1');
resolved = resolved.replace(/:\\s*([0-9]+)(?:\\s*\\|\\s*[0-9]+)+/g, ': $1');

console.log(resolved);
