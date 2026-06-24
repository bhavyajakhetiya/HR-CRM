import prisma from './src/utils/prisma.js';

async function test() {
  const emp = await prisma.employee.findFirst();
  const clients = await prisma.client.findMany({ where: { employeeId: emp.id } });
  console.log("Client created:", clients[0]?.createdAt, "updated:", clients[0]?.updatedAt);
  
  const activities = await prisma.activityLog.findMany({ where: { employeeId: emp.id, action: 'Candidate Selected' } });
  console.log("Candidate activity dates:");
  activities.forEach(a => console.log(a.createdAt));
}
test().catch(console.error).finally(() => prisma.$disconnect());
