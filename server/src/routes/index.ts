import { Router } from 'express';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import dashboardRoutes from './dashboardRoutes';
import weatherRoutes from './weatherRoutes';
import mandiRoutes from './mandiRoutes';
import schemesRoutes from './schemesRoutes';

const router = Router();

// Mount foundational routes
router.use('/health', healthRoutes);

// Mount authentication routes
router.use('/auth', authRoutes);

// Mount farmer user profile routes
router.use('/user', userRoutes);

// Mount dashboard metrics routes
router.use('/dashboard', dashboardRoutes);

// Mount weather intelligence routes
router.use('/weather', weatherRoutes);

// Mount Mandi wholesale price routes
router.use('/mandi', mandiRoutes);

// Mount Government Schemes routes
router.use('/schemes', schemesRoutes);

// Business routes will be mounted here in future steps:
// router.use('/crops', cropRoutes);
// router.use('/farms', farmRoutes);
// router.use('/sensors', sensorRoutes);

export default router;
