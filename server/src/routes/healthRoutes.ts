import { Router } from 'express';
import { getHealth } from '../controllers/healthController';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check and subsystem status
 * @access  Public
 */
router.get('/', getHealth);

export default router;
