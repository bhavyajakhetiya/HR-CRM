import express from 'express';
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  uploadCandidateResume,
  selectCandidate,
  deselectCandidate,
} from '../controllers/candidate.controller.js';
import { protect, authorizeRoles } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require admin or employee role
router.use(protect);
router.use(authorizeRoles('admin', 'employee'));

router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.post('/', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), createCandidate);
router.put('/:id', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), updateCandidate);
router.delete('/:id', deleteCandidate);
router.post('/:id/resume', upload.single('resume'), uploadCandidateResume);
router.post('/:id/select', authorizeRoles('employee'), selectCandidate);
router.post('/:id/deselect', authorizeRoles('employee'), deselectCandidate);

export default router;
