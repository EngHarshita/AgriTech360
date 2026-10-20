import { Router, Request, Response } from 'express';
import { config } from '../config';
import { sendSuccess } from '../utils/apiResponse';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import dashboardRoutes from './dashboardRoutes';
import weatherRoutes from './weatherRoutes';
import mandiRoutes from './mandiRoutes';
import schemesRoutes from './schemesRoutes';
import farmRoutes from './farmRoutes';
import cropRoutes from './cropRoutes';
import alertRoutes from './alertRoutes';

const router = Router();

// API v1 Discovery Root Endpoint
router.get('/', (_req: Request, res: Response) => {
  sendSuccess(res, 'AgriTech360 API v1 is operational', {
    version: '1.0.0',
    documentation: `${config.apiPrefix}/docs`,
    health: `${config.apiPrefix}/health`,
    endpoints: {
      alerts: `${config.apiPrefix}/alerts`,
      auth: `${config.apiPrefix}/auth`,
      crops: `${config.apiPrefix}/crops`,
      dashboard: `${config.apiPrefix}/dashboard`,
      farms: `${config.apiPrefix}/farms`,
      health: `${config.apiPrefix}/health`,
      mandi: `${config.apiPrefix}/mandi`,
      schemes: `${config.apiPrefix}/schemes`,
      user: `${config.apiPrefix}/user`,
      weather: `${config.apiPrefix}/weather`
    }
  });
});

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

// Mount Farm & Field Parcel Management routes
router.use('/farms', farmRoutes);

// Mount Crop Recommendation (AI/ML) routes
router.use('/crops', cropRoutes);
router.use('/crop', cropRoutes); // Alias for singular path compatibility

// Mount Farm Alerts & Advisories routes
router.use('/alerts', alertRoutes);


// Business routes will be mounted here in future steps:
// router.use('/sensors', sensorRoutes);

export default router;

