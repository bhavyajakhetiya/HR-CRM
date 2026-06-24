import prisma from './src/utils/prisma.js';

async function test() {
  const employees = await prisma.employee.findMany();
  if (employees.length === 0) {
    console.log("No employees found");
    return;
  }
  const emp = employees[0];
  console.log("Testing for employee:", emp.id);

  const candidatesCount = await prisma.activityLog.count({
    where: {
      employeeId: emp.id,
      action: 'Candidate Selected',
    }
  });

  const clientsCount = await prisma.client.count({
    where: {
      employeeId: emp.id,
    }
  });

  console.log("Total candidate selections:", candidatesCount);
  console.log("Total clients assigned:", clientsCount);
}
test().catch(console.error).finally(() => prisma.$disconnect());
