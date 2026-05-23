import { useState } from 'react';

// For simplicity, let's just make a file that runs the TS to JSON convert functionality on the provided example.
const tsCode = \`
export interface Item {
  tier: "GOLD" | "SILVER" | "BRONZE";
}
\`;

function generateMockFromTs(tsCode: string): string {
    // copied logic
    // not necessary to run full UI, I'll just check if it compiles.
}
