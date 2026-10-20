import { Router } from 'express';
import { getAlerts } from '../controllers/alertController';
import { optionalAuthenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /alerts:
 *   get:
 *     summary: Retrieve real-time farm alerts, weather advisories, and market intelligence
 *     description: Aggregates notifications across weather hazards, spray suitability, mandi price thresholds, and scheme enrollment windows. Every item explicitly declares its sourceType (live_telemetry, simulated_fallback, or official_advisory).
 *     tags:
 *       - Alerts & Advisories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           default: Indore
 *         description: District or station name for localized agro-climate alerts
 *     responses:
 *       200:
 *         description: Alerts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 4
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FarmAlert'
 */
router.get('/', optionalAuthenticateJWT, getAlerts);

export default router;
