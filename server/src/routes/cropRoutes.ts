import { Router } from 'express';
import { recommendCrop } from '../controllers/cropController';
import { optionalAuthenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /crops/recommend:
 *   post:
 *     summary: Generate data-driven crop recommendations via Python ML Service
 *     description: Evaluates soil N-P-K nutrient values, pH, moisture, temperature, and rainfall using a trained Random Forest classifier. Supports standard parameters (N, P, K, humidity, ph) and frontend aliases (nitrogen, phosphorus, potassium, moisture, phLevel).
 *     tags:
 *       - Crop Recommendation (AI/ML)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - temperature
 *               - rainfall
 *             properties:
 *               nitrogen:
 *                 type: number
 *                 description: Nitrogen index in kg/ha (0-300)
 *                 example: 92
 *               phosphorus:
 *                 type: number
 *                 description: Phosphorus index in kg/ha (0-300)
 *                 example: 48
 *               potassium:
 *                 type: number
 *                 description: Potassium index in kg/ha (0-300)
 *                 example: 44
 *               temperature:
 *                 type: number
 *                 description: Ambient temperature in °C (-10 to 60)
 *                 example: 24.5
 *               moisture:
 *                 type: number
 *                 description: Relative humidity / moisture in % (0-100)
 *                 example: 38.0
 *               phLevel:
 *                 type: number
 *                 description: Soil pH level (0-14)
 *                 example: 6.8
 *               rainfall:
 *                 type: number
 *                 description: Rainfall in mm (0-5000)
 *                 example: 110.0
 *               soilType:
 *                 type: string
 *                 example: Black Soil
 *     responses:
 *       200:
 *         description: Crop recommendations generated successfully
 *       400:
 *         description: Validation error in soil/climate parameters
 *       503:
 *         description: Python ML microservice unavailable
 *       504:
 *         description: Python ML microservice timed out
 */
router.post('/recommend', optionalAuthenticateJWT, recommendCrop);
router.post('/', optionalAuthenticateJWT, recommendCrop);

export default router;
