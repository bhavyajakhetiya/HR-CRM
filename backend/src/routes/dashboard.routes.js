import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { getAdminDashboard, getEmployeeDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.use(protect);

router.get('/admin', authorizeRoles('admin'), getAdminDashboard);
router.get('/employee', authorizeRoles('employee'), getEmployeeDashboard);

export default router;
