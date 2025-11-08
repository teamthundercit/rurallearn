import express from 'express';
import { checkJwt, extractUserInfo } from '../middleware/auth.js';
import { getCurrentUser, updateCurrentUser, updateUserPreferences } from '../controllers/userController.js';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current authenticated user profile
 */
router.get('/me', checkJwt, extractUserInfo, getCurrentUser);

/**
 * PUT /api/users/me
 * Update current authenticated user profile
 */
router.put('/me', checkJwt, extractUserInfo, updateCurrentUser);

/**
 * POST /api/users/me/preferences
 * Update user preferences (onboarding)
 */
router.post('/me/preferences', checkJwt, extractUserInfo, updateUserPreferences);

export default router;
