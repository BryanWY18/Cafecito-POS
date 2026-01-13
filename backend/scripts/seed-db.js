//node scripts/seed-db.js

import { connectDB } from "../src/config/database.js";
import  Product from "../src/models/product.js";
import Client from "../src/models/client.js";
import Sale from "../src/models/sell.js";

const seedDB = async () => {
  await connectDB();

  // Limpiar (opcional)
  await Product.deleteMany();
  await Client.deleteMany();
  await Sale.deleteMany();

  // Crear productos
  const products = await Product.insertMany([
    { name: "Café Americano", price: 5.0, stock: 50 },
    { name: "Café Cortado", price: 4.5, stock: 40 },
    { name: "Espresso", price: 3.5, stock: 60 },
  ]);

  // Crear clientes
  const customers = await Client.insertMany([
    {
      name: "Juan García",
      phoneOrEmail: "juan@example.com",
      purchasesCount: 5,
    },
    {
      name: "María López",
      phoneOrEmail: "maria@example.com",
      purchasesCount: 2,
    },
  ]);

  console.log("✅ Base de datos seeded");
  process.exit(0);
};

seedDB().catch((err) => {
  console.error("❌ Error seeding:", err);
  process.exit(1);
});