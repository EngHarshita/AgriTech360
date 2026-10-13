import { Router } from 'express';
import { getWeather } from '../controllers/weatherController';
import { authenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /weather:
 *   get:
 *     summary: Retrieve agricultural weather intelligence
 *     description: Returns live microclimate data, agro-meteorological indices (spray suitability, soil temperature, evapotranspiration), agricultural advisories, and 24-hour/7-day forecasts. Uses OpenWeatherMap API with 10-minute caching and localized fallback.
 *     tags:
 *       - Weather Intelligence
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: false
 *         description: District or city name (defaults to authenticated farmer district if omitted, e.g. Nashik, Pune)
 *         example: Nashik
 *     responses:
 *       200:
 *         description: Weather intelligence data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherResponse'
 *       401:
 *         description: Unauthorized - missing or invalid JWT Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticateJWT, getWeather);

export default router;
