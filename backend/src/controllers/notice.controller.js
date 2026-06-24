import prisma from '../utils/prisma.js';

// Get all notices (visible to both admin and employee)
export const getNotices = async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { name: true }
        }
      }
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a notice (Admin only)
export const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        adminId: req.user.id
      },
      include: {
        admin: { select: { name: true } }
      }
    });

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notice (Admin only)
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await prisma.notice.delete({ where: { id } });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
