import prisma from './src/utils/prisma.js';

async function test() {
  const employees = await prisma.employee.findMany();
  const emp = employees[0];
  
  const startOfDay = new Date("2026-06-21T00:00:00.000Z");
  const endOfDay = new Date("2026-06-25T23:59:59.999Z");

  const candidateLogs = await prisma.activityLog.findMany({
    where: {
      employeeId: emp.id,
      action: 'Candidate Selected',
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      },
      candidate: {
        selectedById: emp.id
      }
    },
    select: { candidateId: true }
  });
  const uniqueCandidates = new Set(candidateLogs.map(l => l.candidateId));
  console.log("Candidates still selected:", uniqueCandidates.size);

  const clientsCount = await prisma.client.count({
    where: {
      employeeId: emp.id,
      updatedAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });
  console.log("Clients updated/assigned in range:", clientsCount);
}
test().catch(console.error).finally(() => prisma.$disconnect());
