import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';

// ── Get All Employees ─────────────────────────────────────────────
export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Create Employee (Admin Only) ──────────────────────────────────
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, Email, and Password are required' });
    }

    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Update Employee (Admin Only) ──────────────────────────────────
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, address } = req.body;

    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const dataToUpdate = { name, email, phone, address };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Delete Employee (Admin Only) ──────────────────────────────────
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Unassign clients assigned to this employee
    await prisma.client.updateMany({
      where: { employeeId: id },
      data: { employeeId: null },
    });

    // Delete activity logs
    await prisma.activityLog.deleteMany({
      where: { employeeId: id },
    });

    await prisma.employee.delete({ where: { id } });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
