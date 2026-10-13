import { Router } from 'express';
import { getMetrics } from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /dashboard/metrics:
 *   get:
 *     summary: Retrieve dashboard metrics for authenticated farmer
 *     description: Returns consolidated farm telemetry including Total Land (from profile), Active Crops, Weather Risk score, and estimated Revenue turnover. Tailored for DashboardView.tsx.
 *     tags:
 *       - Dashboard Analytics
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardMetricsResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Farmer profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/metrics', authenticateJWT, getMetrics);

export default router;
