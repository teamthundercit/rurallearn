import express from 'express';
import { checkJwt, extractUserInfo, logRequest } from '../middleware/auth.js';
import { handleAuthCallback } from '../controllers/userController.js';

const router = express.Router();

/**
 * POST /api/auth/callback
 * Handle authentication callback from Auth0
 * Creates or updates user in database
 */
router.post('/callback', logRequest, checkJwt, extractUserInfo, handleAuthCallback);

export default router;
