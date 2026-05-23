const interfaces = {
    Profile: '  avatarUrl: string;\n  lastLogin: Date;\n  brand: string;',
    User: '  id: string;\n  profile: Profile;\n  couponApplied?: boolean;',
    ApiResponse: '  data: User;\n  items: Profile[];\n  tier: "GOLD" | "SILVER";'
};

function resolveBody(body, depth = 0) {
    if (!body) return "";
    let resolved = body.replace(/\?/g, "");

    resolved = resolved.replace(/:\s*(["'][a-zA-Z0-9_\-\s]+["'])(?:\s*\|\s*(?:["'][a-zA-Z0-9_\-\s]+["']))+/g, ": $1");
    resolved = resolved.replace(/:\s*([0-9]+)(?:\s*\|\s*[0-9]+)+/g, ": $1");

    resolved = resolved.replace(/:\s*string\s*\[\]/g, ': ["sample string"]');
    resolved = resolved.replace(/:\s*string/g, ': "sample string"').replace(/:\s*Date/g, ': "2026-05-22T00:00:00Z"').replace(/:\s*boolean/g, ': true');

    for (const [name, innerBody] of Object.entries(interfaces)) {
        const arrayRegex = new RegExp(`:\\s*${name}\\s*\\[\\]`, "g");
        resolved = resolved.replace(
            arrayRegex,
            () => `: [\n{${resolveBody(innerBody, depth + 1)}}\n]`
        );

        const typeRegex = new RegExp(`:\\s*${name}(?![a-zA-Z0-9_$])`, "g");
        resolved = resolved.replace(
            typeRegex,
            () => `: {\n${resolveBody(innerBody, depth + 1)}\n}`
        );
    }
    
    // key wrapper filter for EVERY depth!
    resolved = resolved.replace(/(^|[\{\,\n\[])\s*([a-zA-Z0-9_$]+)\s*:/g, '$1 "$2":');

    return resolved;
}

let block = resolveBody(interfaces['ApiResponse']);
block = block.replace(/[;,]\s*(?=\})/g, "\n");
block = block.replace(/;/g, ",");
block = block.replace(/,\s*\}/g, "}");
block = `{\n${block}\n}`;

console.log(block);
