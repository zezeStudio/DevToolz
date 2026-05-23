const fs = require('fs');

let content = fs.readFileSync('src/pages/JsonToTsConverter.tsx', 'utf-8');

const oldRootLogic = `
    let rootName = interfaceOrder[0]; // fallback
    for (const name of interfaceOrder) {
      let isReferenced = false;
      for (const otherName of interfaceOrder) {
        if (name === otherName) continue;
        const body = interfaces[otherName];
        const reg = new RegExp(\`:\\s*\${name}(?![a-zA-Z0-9_$])\`);
        const regArray = new RegExp(\`:\\s*\${name}\\s*\\[\\]\`);
        if (reg.test(body) || regArray.test(body)) {
          isReferenced = true;
          break;
        }
      }
      if (!isReferenced) {
        rootName = name;
        break; // found the first unreferenced, assume it's Root
      }
    }
`.trim().replace(/\\s/g, 's').replace(/\\[\\]/g, '[]'); // just match the exact broken code.

// Wait, the broken code has `:\s*` and things like that.
