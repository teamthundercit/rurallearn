import express from 'express';
import { checkJwt, extractUserInfo } from '../middleware/auth.js';
import { getLessons, getLessonById } from '../controllers/lessonController.js';

const router = express.Router();

/**
 * GET /api/lessons
 * Get all lessons with optional filtering and pagination
 * Query params: difficulty, tags, page, limit
 */
router.get('/', checkJwt, extractUserInfo, getLessons);

/**
 * GET /api/lessons/:id
 * Get specific lesson by ID
 */
router.get('/:id', checkJwt, extractUserInfo, getLessonById);

export default router;
