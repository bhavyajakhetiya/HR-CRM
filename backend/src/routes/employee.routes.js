import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employee.controller.js';

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorizeRoles('admin'));

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.route('/:id')
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
