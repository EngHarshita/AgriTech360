import { Router } from 'express';
import {
  getSchemes,
  getSchemeById,
  bookmarkScheme,
  checkEligibility,
  seedSchemes
} from '../controllers/schemesController';
import { authenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /schemes:
 *   get:
 *     summary: Retrieve Government Agriculture Schemes
 *     description: Returns central and state government agricultural schemes, financial assistance programs, and crop subsidies with category filtering, search, and pagination.
 *     tags:
 *       - Government Schemes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [All, Financial Assistance, Crop Insurance, Irrigation & Machinery, Soil & Fertilizers, Organic Farming, Solar Energy, Credit & Loans, Infrastructure]
 *         description: Scheme thematic classification
 *         example: Financial Assistance
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword across title, short code, department, and description
 *         example: PM-KISAN
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
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Schemes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchemesResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, getSchemes);

/**
 * @openapi
 * /schemes/seed:
 *   post:
 *     summary: Seed GovernmentScheme collection with 25+ realistic schemes
 *     tags:
 *       - Government Schemes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: force
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Schemes seeded successfully
 */
router.post('/seed', authenticateJWT, seedSchemes);

/**
 * @openapi
 * /schemes/{id}:
 *   get:
 *     summary: Retrieve single scheme details
 *     description: Returns detailed guidelines, eligibility checklist, documentation needed, and official portal URL for a specific scheme by ID or short code.
 *     tags:
 *       - Government Schemes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ObjectId or short code (e.g. PM-KISAN, PMFBY, KCC)
 *         example: PM-KISAN
 *     responses:
 *       200:
 *         description: Scheme details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Scheme not found
 */
router.get('/:id', authenticateJWT, getSchemeById);

/**
 * @openapi
 * /schemes/{id}/bookmark:
 *   post:
 *     summary: Bookmark or unbookmark a government scheme
 *     description: Toggles bookmark status for the authenticated farmer and updates total bookmark count.
 *     tags:
 *       - Government Schemes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ObjectId or short code
 *         example: PM-KISAN
 *     responses:
 *       200:
 *         description: Bookmark toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookmarkResult'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Scheme not found
 */
router.post('/:id/bookmark', authenticateJWT, bookmarkScheme);

/**
 * @openapi
 * /schemes/{id}/check-eligibility:
 *   post:
 *     summary: Check farmer eligibility for a scheme
 *     description: Evaluates authenticated farmer profile (state, landHolding, irrigationType, soilType) against scheme criteria rules and returns eligibility status with comprehensive reasons.
 *     tags:
 *       - Government Schemes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scheme ObjectId or short code
 *         example: PM-KISAN
 *     responses:
 *       200:
 *         description: Eligibility evaluation completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EligibilityCheckResult'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Scheme or Farmer not found
 */
router.post('/:id/check-eligibility', authenticateJWT, checkEligibility);

export default router;
