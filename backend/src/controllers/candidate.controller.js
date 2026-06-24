import prisma from '../utils/prisma.js';

// ── Get All Candidates (Search & Filter) ──────────────────────────

export const getCandidates = async (req, res) => {
  try {
    const { search, location, status, minExperience } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { skills: { contains: search } },
        { education: { contains: search } },
      ];
    }

    if (location) {
      where.location = { contains: location };
    }

    if (status) {
      where.status = status;
    }

    if (minExperience) {
      where.experience = { gte: parseInt(minExperience) };
    }

    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        documents: true,
        selectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Get Candidate By ID ───────────────────────────────────────────

export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        documents: true,
        activityLogs: true,
        selectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Create Candidate ──────────────────────────────────────────────

export const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, skills, experience, education, location, jobTitle, noticePeriod, linkedin, portfolio, joiningDate } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    const exists = await prisma.candidate.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'A candidate with this email already exists' });
    }

    let fileUrl = null;
    let originalName = null;
    if (req.files && req.files.resume && req.files.resume[0]) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.resume[0].filename}`;
      originalName = req.files.resume[0].originalname;
    }

    let photoUrl = null;
    if (req.files && req.files.photo && req.files.photo[0]) {
      photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.photo[0].filename}`;
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        skills,
        experience, // string
        jobTitle,
        noticePeriod,
        linkedin,
        portfolio,
        education,
        location,
        resumeUrl: fileUrl,
        photoUrl,
        joiningDate: (joiningDate && joiningDate !== 'null' && joiningDate !== '') ? new Date(joiningDate) : null,
      },
      include: {
        documents: true,
        selectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (fileUrl) {
      await prisma.candidateDocument.create({
        data: {
          candidateId: candidate.id,
          name: originalName || 'Resume',
          fileUrl,
          documentType: 'Resume',
        },
      });
    }

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Candidate ──────────────────────────────────────────────

export const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, skills, experience, education, location, status, jobTitle, noticePeriod, linkedin, portfolio, joiningDate } = req.body;

    const existing = await prisma.candidate.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    let fileUrl = existing.resumeUrl;
    let originalName = null;
    if (req.files && req.files.resume && req.files.resume[0]) {
      fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.resume[0].filename}`;
      originalName = req.files.resume[0].originalname;
      await prisma.candidateDocument.create({
        data: {
          candidateId: id,
          name: originalName || 'Resume',
          fileUrl,
          documentType: 'Resume',
        },
      });
    }

    let photoUrl = existing.photoUrl;
    if (req.files && req.files.photo && req.files.photo[0]) {
      photoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.files.photo[0].filename}`;
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        skills,
        experience, // string
        jobTitle,
        noticePeriod,
        linkedin,
        portfolio,
        education,
        location,
        resumeUrl: fileUrl,
        photoUrl,
        status: status || existing.status,
        joiningDate: (joiningDate && joiningDate !== 'null' && joiningDate !== '') ? new Date(joiningDate) : null,
      },
      include: {
        documents: true,
        selectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete Candidate ──────────────────────────────────────────────

export const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.candidate.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Delete related documents first
    await prisma.candidateDocument.deleteMany({ where: { candidateId: id } });
    // Delete related activity logs
    await prisma.activityLog.deleteMany({ where: { candidateId: id } });

    // Delete the candidate
    await prisma.candidate.delete({ where: { id } });

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Upload Resume for Candidate ───────────────────────────────────

export const uploadCandidateResume = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const existing = await prisma.candidate.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Update candidate resumeUrl
    await prisma.candidate.update({
      where: { id },
      data: { resumeUrl: fileUrl },
    });

    // Create document record
    await prisma.candidateDocument.create({
      data: {
        candidateId: id,
        name: req.file.originalname,
        fileUrl,
        documentType: 'Resume',
      },
    });

    res.json({ message: 'Resume uploaded successfully', resumeUrl: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Select Candidate ──────────────────────────────────────────────
export const selectCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.id;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        selectedBy: {
          select: {
            name: true
          }
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (candidate.selectedById) {
      if (candidate.selectedById === employeeId) {
        return res.status(400).json({ message: 'You have already selected this candidate' });
      } else {
        return res.status(400).json({ message: `Candidate is already selected by another employee: ${candidate.selectedBy?.name || 'Another Employee'}` });
      }
    }

    // Select candidate
    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        selectedById: employeeId
      },
      include: {
        documents: true,
        selectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'Candidate Selected',
        details: `Selected candidate ${candidate.name}`,
        employeeId,
        candidateId: id
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Deselect Candidate ────────────────────────────────────────────
export const deselectCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.id;

    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (!candidate.selectedById) {
      return res.status(400).json({ message: 'Candidate is not selected' });
    }

    if (candidate.selectedById !== employeeId) {
      return res.status(403).json({ message: 'You cannot deselect a candidate selected by another employee' });
    }

    // Deselect candidate
    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        selectedById: null
      },
      include: {
        documents: true,
        selectedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'Candidate Deselected',
        details: `Deselected candidate ${candidate.name}`,
        employeeId,
        candidateId: id
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
