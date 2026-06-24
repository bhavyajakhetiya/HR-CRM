import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { getEmployeeReport } from '../controllers/reports.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/employee/:employeeId', getEmployeeReport);

export default router;
