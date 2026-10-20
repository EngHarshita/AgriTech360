import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateJWT, validateUpdateProfile } from '../middleware';

const router = Router();

/**
 * @openapi
 * /user/profile:
 *   get:
 *     summary: Retrieve authenticated farmer profile
 *     description: Returns the full profile details for the currently logged-in farmer. Sensitive fields like passwords are systematically excluded.
 *     tags:
 *       - Farmer Profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Farmer profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       401:
 *         description: Unauthorized - missing or invalid JWT Bearer token
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
router.get('/profile', authenticateJWT, getProfile);

/**
 * @openapi
 * /user/profile:
 *   put:
 *     summary: Update authenticated farmer profile
 *     description: Updates mutable farmer attributes (name, phone, district, state, landHolding, soilType, irrigationType). Modifications to password, email, or role are strictly rejected.
 *     tags:
 *       - Farmer Profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Farmer profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileUpdateResponse'
 *       400:
 *         description: Validation error or attempt to modify restricted fields (password, email, role)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
router.put('/profile', authenticateJWT, validateUpdateProfile, updateProfile);

export default router;
