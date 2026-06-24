import express from 'express';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { getNotices, createNotice, deleteNotice } from '../controllers/notice.controller.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotices);
router.post('/', authorizeRoles('admin'), createNotice);
router.delete('/:id', authorizeRoles('admin'), deleteNotice);

export default router;
