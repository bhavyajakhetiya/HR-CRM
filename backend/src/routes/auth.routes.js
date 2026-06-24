import express from 'express';
import {
  loginEmployee,
  loginAdmin,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/employee/login', loginEmployee);
router.post('/admin/login', loginAdmin);

export default router;
