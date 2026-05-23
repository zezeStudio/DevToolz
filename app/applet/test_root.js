const interfaces = {
    ProductDetails: "  brand: string;\n  sku: string;\n  dimensions: string;",
    OrderItem: "  productId: string;\n  title: string;\n  price: number;\n  quantity: number;\n  details: ProductDetails;",
    CustomerProfile: "  id: string;\n  tier: \"GOLD\" | \"SILVER\";",
    DashboardPayload: "  customer: CustomerProfile;\n  items: OrderItem[];"
};

const interfaceOrder = Object.keys(interfaces);
let rootName = interfaceOrder[interfaceOrder.length - 1];
for (const name of interfaceOrder) {
  let isReferenced = false;
  for (const otherName of interfaceOrder) {
    if (name === otherName) continue;
    const body = interfaces[otherName];
    const reg = new RegExp(`:\\\\s*\${name}(?![a-zA-Z0-9_$])`);
    const regArray = new RegExp(`:\\\\s*\${name}\\\\s*\\\\[\\\\]`);
    if (reg.test(body) || regArray.test(body)) {
      isReferenced = true;
      break;
    }
  }
  if (!isReferenced) {
    rootName = name;
    break;
  }
}
console.log("Rootname", rootName);
