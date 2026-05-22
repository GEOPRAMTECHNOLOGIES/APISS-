import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);
router.get('/:id', getService);
router.post('/', adminAuth, createService);
router.put('/:id', adminAuth, updateService);
router.delete('/:id', adminAuth, deleteService);

export default router;