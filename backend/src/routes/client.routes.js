import express from 'express';
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  assignEmployee,
  getEmployees,
} from '../controllers/client.controller.js';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get clients - protected for admins and employees
router.get('/', protect, authorizeRoles('admin', 'employee'), getClients);

// Admin-only operations
router.get('/employees', protect, authorizeRoles('admin'), getEmployees);
router.post('/', protect, authorizeRoles('admin'), createClient);
router.put('/:id', protect, authorizeRoles('admin'), updateClient);
router.delete('/:id', protect, authorizeRoles('admin'), deleteClient);
router.patch('/:id/assign', protect, authorizeRoles('admin'), assignEmployee);

export default router;
