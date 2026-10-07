import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Mount foundational routes
router.use('/health', healthRoutes);

// Mount authentication routes
router.use('/auth', authRoutes);

// Business routes will be mounted here in future steps:
// router.use('/crops', cropRoutes);
// router.use('/farms', farmRoutes);
// router.use('/sensors', sensorRoutes);

export default router;
