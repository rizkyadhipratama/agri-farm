const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const [adminRole, operatorRole, guestRole] = await Promise.all([
    prisma.role.upsert({ where: { name: "admin" }, update: {}, create: { name: "admin" } }),
    prisma.role.upsert({ where: { name: "operator" }, update: {}, create: { name: "operator" } }),
    prisma.role.upsert({ where: { name: "guest" }, update: {}, create: { name: "guest" } }),
  ]);

  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@agrifarm.com" },
    update: {},
    create: { name: "Admin", email: "admin@agrifarm.com", passwordHash: hashedPassword, roleId: adminRole.id, emailVerified: new Date() },
  });

  const operatorPassword = await bcrypt.hash("operator123", 10);
  await prisma.user.upsert({
    where: { email: "operator@agrifarm.com" },
    update: {},
    create: { name: "Operator", email: "operator@agrifarm.com", passwordHash: operatorPassword, roleId: operatorRole.id, emailVerified: new Date() },
  });

  await prisma.product.createMany({
    data: [
      { name: "Rice Seeds", category: "Seeds", unit: "kg", minStock: 100 },
      { name: "Tomato Seeds", category: "Seeds", unit: "pcs", minStock: 50 },
      { name: "Lettuce Seeds", category: "Seeds", unit: "pcs", minStock: 50 },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
