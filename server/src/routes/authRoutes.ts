import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validateRegister, validateLogin, authenticateJWT } from '../middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user (farmer, expert, buyer, etc.)
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user credentials and return JWT token
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Private
 */
router.get('/me', authenticateJWT, getMe);

export default router;
