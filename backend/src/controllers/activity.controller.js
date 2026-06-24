import prisma from '../utils/prisma.js';

// Get all activities (Admin sees all, Employee sees only theirs)
export const getActivities = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    const where = role === 'employee' ? { employeeId: userId } : {};

    const activities = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: { select: { name: true } },
        candidate: { select: { name: true } }
      }
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log an activity (Employee/Admin can log)
export const createActivity = async (req, res) => {
  try {
    const { action, details, candidateId } = req.body;
    
    // Admin doesn't necessarily log employee actions directly like this, but we allow it if needed.
    // Usually it's employee logging their own actions.
    const employeeId = req.user.role === 'employee' ? req.user.id : req.body.employeeId;

    if (!action || !employeeId) {
      return res.status(400).json({ message: 'Action and employeeId are required' });
    }

    const activity = await prisma.activityLog.create({
      data: {
        action,
        details,
        employeeId,
        candidateId: candidateId || null
      },
      include: {
        employee: { select: { name: true } },
        candidate: { select: { name: true } }
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
