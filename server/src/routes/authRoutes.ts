import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validateRegister, validateLogin, authenticateJWT } from '../middleware';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new AgriTech360 user
 *     description: Registers a new farmer, expert, or buyer with their agricultural profile attributes and issues a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - district
 *               - state
 *               - landHolding
 *               - soilType
 *               - irrigationType
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ramesh Patel
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ramesh.patel@example.com
 *               phone:
 *                 type: string
 *                 example: '+919876543210'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123
 *               district:
 *                 type: string
 *                 example: Nashik
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               landHolding:
 *                 type: number
 *                 example: 4.5
 *               soilType:
 *                 type: string
 *                 example: Black Soil
 *               irrigationType:
 *                 type: string
 *                 example: Drip Irrigation
 *               role:
 *                 type: string
 *                 enum: [farmer, expert, buyer, admin]
 *                 example: farmer
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User registered successfully }
 *                 token: { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *                 user: { $ref: '#/components/schemas/SafeUser' }
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already registered
 */
router.post('/register', validateRegister, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates user credentials using email and password, returning an access JWT.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ramesh.patel@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Login successful }
 *                 token: { type: string, example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... }
 *                 user: { $ref: '#/components/schemas/SafeUser' }
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get('/me', authenticateJWT, getMe);

export default router;
