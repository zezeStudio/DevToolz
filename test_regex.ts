const name = "ProductDetails";
const reg = new RegExp(`:\\s*${name}(?![a-zA-Z0-9_$])`);
const body = "  details: ProductDetails;";
console.log(reg);
console.log("matches?", reg.test(body));
