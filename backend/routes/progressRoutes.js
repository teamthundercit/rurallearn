import express from 'express';
import { checkJwt, extractUserInfo } from '../middleware/auth.js';
import * as progressController from '../controllers/progressController.js';

const router = express.Router();

// All progress routes require authentication
router.use(checkJwt);
router.use(extractUserInfo);

// GET /api/progress - Get user's progress records
router.get('/', progressController.getUserProgress);

// POST /api/progress/lesson/:id - Record lesson completion
router.post('/lesson/:id', progressController.recordLessonCompletion);

// POST /api/progress/quiz/:id - Submit quiz answers
router.post('/quiz/:id', progressController.submitQuiz);

// GET /api/progress/leaderboard - Get leaderboard
router.get('/leaderboard', progressController.getLeaderboard);

export default router;
