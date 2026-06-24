import 'dotenv/config';
import prisma from './src/utils/prisma.js';
import bcrypt from 'bcryptjs';

async function run() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    const adminEmail = 'admin@example.com';
    const adminExists = await prisma.admin.findUnique({ where: { email: adminEmail } });
    if (!adminExists) {
      await prisma.admin.create({
        data: {
          name: 'System Admin',
          email: adminEmail,
          password: hashedPassword,
        }
      });
      console.log('✅ Created default admin: admin@example.com / password123');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Create Employee
    const employeeEmail = 'recruiter@example.com';
    const employeeExists = await prisma.employee.findUnique({ where: { email: employeeEmail } });
    if (!employeeExists) {
      await prisma.employee.create({
        data: {
          name: 'Jane Recruiter',
          email: employeeEmail,
          password: hashedPassword,
        }
      });
      console.log('✅ Created default recruiter: recruiter@example.com / password123');
    } else {
      console.log('ℹ️ Recruiter already exists');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
