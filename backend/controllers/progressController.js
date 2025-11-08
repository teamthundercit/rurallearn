import * as progressService from '../services/progressService.js';

/**
 * Get user's progress records
 * GET /api/progress
 */
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    
    const progressRecords = await progressService.getProgress(userId);
    const summary = await progressService.getProgressSummary(userId);
    
    res.json({
      success: true,
      data: {
        progress: progressRecords,
        summary
      }
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'PROGRESS_FETCH_ERROR',
        message: error.message || 'Failed to fetch progress'
      }
    });
  }
};

/**
 * Record lesson completion
 * POST /api/progress/lesson/:id
 */
export const recordLessonCompletion = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const lessonId = req.params.id;
    const { timeSpent } = req.body;
    
    // Validate timeSpent if provided
    const validTimeSpent = timeSpent && !isNaN(timeSpent) && timeSpent >= 0 
      ? Number(timeSpent) 
      : 0;
    
    const progress = await progressService.recordLessonCompletion(
      userId, 
      lessonId, 
      validTimeSpent
    );
    
    res.json({
      success: true,
      data: progress,
      message: 'Lesson completion recorded successfully'
    });
  } catch (error) {
    console.error('Error recording lesson completion:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LESSON_NOT_FOUND',
          message: error.message
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'LESSON_COMPLETION_ERROR',
        message: error.message || 'Failed to record lesson completion'
      }
    });
  }
};

/**
 * Submit quiz answers
 * POST /api/progress/quiz/:id
 */
export const submitQuiz = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const lessonId = req.params.id;
    const { answers } = req.body;
    
    // Validate answers
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Answers must be provided as an array'
        }
      });
    }
    
    const result = await progressService.submitQuiz(userId, lessonId, answers);
    
    res.json({
      success: true,
      data: result,
      message: result.quizResults.passed 
        ? 'Quiz passed! Great job!' 
        : 'Quiz submitted. Keep practicing!'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LESSON_NOT_FOUND',
          message: error.message
        }
      });
    }
    
    if (error.message.includes('Invalid answers') || error.message.includes('does not have a quiz')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: error.message
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'QUIZ_SUBMISSION_ERROR',
        message: error.message || 'Failed to submit quiz'
      }
    });
  }
};
