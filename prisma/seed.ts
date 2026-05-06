import { db as prisma } from "@/lib/client";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const existing = await prisma.adminUsers.findUnique({
    where: {
      email: "admin@testing.com",
    },
  });

  if (existing) {
    console.log("Seed admin already exists");
    return;
  }

  await prisma.adminUsers.create({
    data: {
      name: "Super Admin",
      username: "admin",
      email: "admin@testing.com",
      password: hashedPassword,
      image: null,
    },
  });

  console.log("✅ Admin user seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });