import * as lessonService from '../services/lessonService.js';

/**
 * Get all lessons with optional filtering and pagination
 */
export const getLessons = async (req, res) => {
  try {
    const { difficulty, tags, page, limit } = req.query;
    
    // Input validation
    const errors = [];
    
    if (difficulty && !['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      errors.push('Difficulty must be one of: beginner, intermediate, advanced');
    }
    
    if (page && (isNaN(page) || parseInt(page) < 1)) {
      errors.push('Page must be a positive integer');
    }
    
    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
      errors.push('Limit must be a positive integer between 1 and 100');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: errors
        }
      });
    }
    
    const result = await lessonService.getLessons(
      { difficulty, tags },
      { page, limit }
    );
    
    res.json({
      success: true,
      data: {
        lessons: result.lessons,
        pagination: result.pagination
      }
    });
  } catch (error) {
    console.error('Error in getLessons:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_LESSONS_ERROR',
        message: 'Failed to retrieve lessons'
      }
    });
  }
};

/**
 * Get lesson by ID
 */
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await lessonService.getLessonById(id);
    
    res.json({
      success: true,
      data: {
        lesson
      }
    });
  } catch (error) {
    console.error('Error in getLessonById:', error);
    
    if (error.code === 'LESSON_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LESSON_NOT_FOUND',
          message: 'Lesson not found'
        }
      });
    }
    
    if (error.code === 'INVALID_LESSON_ID') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_LESSON_ID',
          message: 'Invalid lesson ID format'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_LESSON_ERROR',
        message: 'Failed to retrieve lesson'
      }
    });
  }
};
