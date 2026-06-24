import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { generateToken } from '../utils/jwt.js';

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await prisma.employee.findUnique({ where: { email } });

    if (employee && (await bcrypt.compare(password, employee.password))) {
      res.json({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: 'employee',
        token: generateToken(employee.id, 'employee'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin.id, 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
