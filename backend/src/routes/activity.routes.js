import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getActivities, createActivity } from '../controllers/activity.controller.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.post('/', createActivity);

export default router;
