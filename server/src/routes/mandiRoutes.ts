import { Router } from 'express';
import { getPrices, estimateRevenue, seedPrices } from '../controllers/mandiController';
import { authenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /mandi:
 *   get:
 *     summary: Retrieve live Mandi wholesale prices
 *     description: Returns wholesale APMC agricultural commodity prices across India with search, category filtering, state filtering, MSP comparisons, and pagination.
 *     tags:
 *       - Mandi APMC Prices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword across commodity, market, district, or variety (e.g. Wheat, Soybean, Nashik)
 *         example: Wheat
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [All, Grains, Pulses, Oilseeds, Commercial, Spices, Vegetables, Fruits]
 *         description: Filter by agricultural crop classification
 *         example: Grains
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by Indian state (e.g. Maharashtra, Punjab, Madhya Pradesh)
 *         example: Maharashtra
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Mandi price records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MandiPricesResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticateJWT, getPrices);

/**
 * @openapi
 * /mandi/estimate:
 *   get:
 *     summary: Calculate estimated revenue based on APMC rates and MSP
 *     description: Computes gross turnover, Government MSP valuation, and net gain above MSP for a specified crop and quantity in Quintals.
 *     tags:
 *       - Mandi APMC Prices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: commodity
 *         schema:
 *           type: string
 *         required: true
 *         description: Crop commodity name (e.g. Wheat, Soybean, Mustard)
 *         example: Wheat
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: number
 *         required: true
 *         description: Total harvest quantity in Quintals (1 Quintal = 100 kg)
 *         example: 50
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         required: false
 *         description: Optional custom price per quintal (defaults to latest modal APMC rate)
 *         example: 2850
 *     responses:
 *       200:
 *         description: Crop revenue estimate computed successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/estimate', authenticateJWT, estimateRevenue);

/**
 * @openapi
 * /mandi/seed:
 *   post:
 *     summary: Seed Mandi price collection with 50+ APMC records
 *     description: Seeds the MongoDB database with initial benchmark records covering major Indian wholesale markets.
 *     tags:
 *       - Mandi APMC Prices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *         description: If true, clears existing records and replaces them
 *     responses:
 *       200:
 *         description: Records seeded successfully
 */
router.post('/seed', authenticateJWT, seedPrices);

export default router;
