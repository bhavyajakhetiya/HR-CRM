import prisma from '../utils/prisma.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const totalClients = await prisma.client.count();
    const totalEmployees = await prisma.employee.count();
    const totalCandidates = await prisma.candidate.count();
    
    // Recent activities (last 5)
    const recentActivities = await prisma.activityLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: { select: { name: true } },
        candidate: { select: { name: true } }
      }
    });

    res.json({
      metrics: {
        totalClients,
        totalEmployees,
        totalCandidates
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    const { id: employeeId } = req.user;

    const myClientsCount = await prisma.client.count({
      where: { employeeId }
    });

    const recentActivities = await prisma.activityLog.findMany({
      where: { employeeId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: { select: { name: true } }
      }
    });

    res.json({
      metrics: {
        myClientsCount
      },
      recentActivities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
