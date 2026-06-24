import bcrypt from 'bcryptjs';
import prisma from './src/utils/prisma.js';

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin with email ${adminEmail} already exists. Skipping seed.`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  const admin = await prisma.admin.create({
    data: {
      name: 'System Admin',
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log(`Successfully seeded Admin: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
