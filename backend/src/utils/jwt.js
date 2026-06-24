import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'hrcrm-secret-key-123',
    { expiresIn: '30d' }
  );
};
