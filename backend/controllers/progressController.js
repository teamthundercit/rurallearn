import * as progressService from '../services/progressService.js';
import * as gamificationService from '../services/gamificationService.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

/**
 * Get user's progress records with gamification data
 * GET /api/progress
 */
export const getUserProgress = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    
    // Find user in database
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const userId = user._id;
    
    const progressRecords = await progressService.getProgress(userId);
    const summary = await progressService.getProgressSummary(userId);
    
    // Get gamification data with error handling
    let weeklyActivity = [];
    let recentAchievements = [];
    let goalProgress = { weeklyProgress: 0, monthlyProgress: 0 };
    
    try {
      weeklyActivity = await gamificationService.getWeeklyActivity(userId);
    } catch (error) {
      console.error('Error getting weekly activity:', error.message);
    }
    
    try {
      recentAchievements = await gamificationService.getRecentAchievements(userId);
    } catch (error) {
      console.error('Error getting recent achievements:', error.message);
    }
    
    try {
      goalProgress = await gamificationService.getGoalProgress(userId);
    } catch (error) {
      console.error('Error getting goal progress:', error.message);
    }
    
    // Get last lesson
    const lastProgress = await Progress.findOne({ userId })
      .sort({ updatedAt: -1 })
      .populate('lessonId', 'title')
      .lean();
    
    // Get failed quizzes
    const failedQuizzes = await Progress.find({
      userId,
      quizScore: { $lt: 70, $ne: null }
    })
      .populate('lessonId', 'title')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();
    
    // Get next lessons (lessons not started yet)
    const completedLessonIds = progressRecords
      .filter(p => p.status === 'completed')
      .map(p => p.lessonId?._id || p.lessonId);
    
    res.json({
      success: true,
      data: {
        progress: progressRecords,
        summary,
        weeklyActivity,
        recentAchievements,
        weeklyProgress: goalProgress.weeklyProgress,
        monthlyProgress: goalProgress.monthlyProgress,
        lastLesson: lastProgress?.lessonId || null,
        failedQuizzes: failedQuizzes.map(q => q.lessonId).filter(Boolean),
        nextLessons: [], // Can be populated with recommended lessons
        reviewLessons: failedQuizzes.map(q => q.lessonId).filter(Boolean)
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
 * Record lesson completion with gamification updates
 * POST /api/progress/lesson/:id
 */
export const recordLessonCompletion = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    
    // Find user in database
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const userId = user._id;
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
    
    // Update gamification
    const streak = await gamificationService.updateStreak(userId);
    const newBadges = await gamificationService.checkAndAwardBadges(userId);
    await gamificationService.updateTotalPoints(userId);
    
    res.json({
      success: true,
      data: progress,
      gamification: {
        streak,
        newBadges
      },
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
 * Submit quiz answers with gamification updates
 * POST /api/progress/quiz/:id
 */
export const submitQuiz = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    
    // Find user in database
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const userId = user._id;
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
    
    // Update gamification
    const streak = await gamificationService.updateStreak(userId);
    const newBadges = await gamificationService.checkAndAwardBadges(userId);
    await gamificationService.updateTotalPoints(userId);
    
    res.json({
      success: true,
      data: result,
      gamification: {
        streak,
        newBadges
      },
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

/**
 * Get leaderboard
 * GET /api/progress/leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = 'week' } = req.query;
    const auth0Id = req.auth.payload.sub;
    
    // Find user in database
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const userId = user._id;
    
    const leaderboard = await gamificationService.getLeaderboard(timeframe);
    
    // Find user's rank
    const userRank = leaderboard.findIndex(entry => entry.userId.toString() === userId) + 1;
    
    res.json({
      success: true,
      data: {
        leaderboard: leaderboard.slice(0, 10), // Top 10
        userRank: userRank || null,
        topLearners: leaderboard.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LEADERBOARD_ERROR',
        message: error.message || 'Failed to fetch leaderboard'
      }
    });
  }
};
