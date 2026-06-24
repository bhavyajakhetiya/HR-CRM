import prisma from '../utils/prisma.js';

export const getEmployeeReport = async (req, res) => {
  try {
    const { employeeId } = req.params;
    let { startDate, endDate } = req.query;

    // Verify employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee/Recruiter not found' });
    }

    // Default date range: last 30 days
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(end.getDate() - 30);
    }

    // Format boundaries
    const startIso = start.toISOString().split('T')[0];
    const endIso = end.toISOString().split('T')[0];

    // 1. Fetch Candidates Handled (currently selected by employee)
    const candidates = await prisma.candidate.findMany({
      where: { selectedById: employeeId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        jobTitle: true,
        createdAt: true,
        joiningDate: true
      }
    });

    // 2. Compute Candidate Status Distribution
    const statusDistribution = {};
    candidates.forEach((c) => {
      statusDistribution[c.status] = (statusDistribution[c.status] || 0) + 1;
    });

    // 3. Fetch Activity Logs in Date Range
    const logs = await prisma.activityLog.findMany({
      where: {
        employeeId,
        createdAt: {
          gte: new Date(`${startIso}T00:00:00.000Z`),
          lte: new Date(`${endIso}T23:59:59.999Z`)
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: {
            name: true
          }
        }
      }
    });

    // 4. Construct Day-wise Activity Timeline
    const candidateLogs = await prisma.activityLog.findMany({
      where: {
        employeeId,
        action: { in: ['Candidate Selected', 'Candidate Deselected'] }
      },
      orderBy: { createdAt: 'asc' }
    });

    const clientLogs = await prisma.activityLog.findMany({
      where: {
        employeeId,
        action: { in: ['Client Assigned', 'Client Unassigned'] }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Synthesize logs for candidates currently selected if logs are missing
    candidates.forEach(c => {
      const hasLog = candidateLogs.some(log => log.candidateId === c.id && log.action === 'Candidate Selected');
      if (!hasLog) {
        candidateLogs.push({
          action: 'Candidate Selected',
          candidateId: c.id,
          employeeId,
          createdAt: c.createdAt
        });
      }
    });
    candidateLogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Fetch currently assigned clients to synthesize logs if missing
    const currentClients = await prisma.client.findMany({
      where: { employeeId },
      select: { id: true, createdAt: true }
    });

    currentClients.forEach(c => {
      const hasLog = clientLogs.some(log => log.clientId === c.id && log.action === 'Client Assigned');
      if (!hasLog) {
        clientLogs.push({
          action: 'Client Assigned',
          clientId: c.id,
          employeeId,
          createdAt: c.createdAt
        });
      }
    });
    clientLogs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // Helper functions to get active count on a given target date
    const getActiveCandidatesAtDate = (targetDate) => {
      const activeIds = new Set();
      for (const log of candidateLogs) {
        if (new Date(log.createdAt) > targetDate) {
          break;
        }
        if (log.action === 'Candidate Selected') {
          activeIds.add(log.candidateId);
        } else if (log.action === 'Candidate Deselected') {
          activeIds.delete(log.candidateId);
        }
      }
      return activeIds;
    };

    const getActiveClientsAtDate = (targetDate) => {
      const activeIds = new Set();
      for (const log of clientLogs) {
        if (new Date(log.createdAt) > targetDate) {
          break;
        }
        if (log.action === 'Client Assigned') {
          activeIds.add(log.clientId);
        } else if (log.action === 'Client Unassigned') {
          activeIds.delete(log.clientId);
        }
      }
      return activeIds;
    };

    const timeline = [];
    let curr = new Date(startIso);
    const stop = new Date(endIso);

    while (curr <= stop) {
      const dateStr = curr.toISOString().split('T')[0];
      const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

      const activeCandidates = getActiveCandidatesAtDate(endOfDay);
      const activeClients = getActiveClientsAtDate(endOfDay);

      timeline.push({
        date: dateStr,
        candidatesAssigned: activeCandidates.size,
        clientsAssigned: activeClients.size
      });

      curr.setUTCDate(curr.getUTCDate() + 1);
    }

    res.json({
      employee,
      candidates,
      statusDistribution,
      timeline,
      activityLogs: logs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
