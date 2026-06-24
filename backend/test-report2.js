import prisma from './src/utils/prisma.js';

async function test() {
  const employees = await prisma.employee.findMany();
  const emp = employees[0];
  
  const startOfDay = new Date("2026-06-24T00:00:00.000Z");
  const endOfDay = new Date("2026-06-24T23:59:59.999Z");

  const clientsCount = await prisma.client.count({
    where: {
      employeeId: emp.id,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  const clientsCountUpdated = await prisma.client.count({
    where: {
      employeeId: emp.id,
      updatedAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  console.log("Clients created today:", clientsCount);
  console.log("Clients updated today:", clientsCountUpdated);
  
  const candidatesCount = await prisma.activityLog.count({
    where: {
      employeeId: emp.id,
      action: 'Candidate Selected',
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });
  console.log("Candidates selected today (activity log):", candidatesCount);

  // New alternative for candidates
  const candidatesCountAlt = await prisma.candidate.count({
    where: {
      selectedById: emp.id,
      updatedAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });
  console.log("Candidates updated today:", candidatesCountAlt);

}
test().catch(console.error).finally(() => prisma.$disconnect());
