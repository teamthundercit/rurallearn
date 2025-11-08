import express from 'express';
import { getRecommendations, handleChat } from '../controllers/aiController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All AI routes require authentication
router.use(auth);

/**
 * @route   POST /api/ai/recommendations
 * @desc    Generate personalized lesson recommendations
 * @access  Private
 */
router.post('/recommendations', getRecommendations);

/**
 * @route   POST /api/ai/chat
 * @desc    Handle chatbot conversation
 * @access  Private
 */
router.post('/chat', handleChat);

export default router;
