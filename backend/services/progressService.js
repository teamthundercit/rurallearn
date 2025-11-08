import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';

/**
 * Get all progress records for a user
 * @param {String} userId - User's MongoDB ObjectId
 * @returns {Promise<Array>} Array of progress records
 */
export const getProgress = async (userId) => {
  try {
    const progressRecords = await Progress.find({ userId })
      .populate('lessonId', 'title description difficulty tags')
      .sort({ lastAccessedAt: -1 });
    
    return progressRecords;
  } catch (error) {
    throw new Error(`Failed to retrieve progress: ${error.message}`);
  }
};

/**
 * Record lesson completion for a user
 * @param {String} userId - User's MongoDB ObjectId
 * @param {String} lessonId - Lesson's MongoDB ObjectId
 * @param {Number} timeSpent - Time spent on lesson in minutes (optional)
 * @returns {Promise<Object>} Updated progress record
 */
export const recordLessonCompletion = async (userId, lessonId, timeSpent = 0) => {
  try {
    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Find or create progress record
    let progress = await Progress.findOne({ userId, lessonId });
    
    if (!progress) {
      progress = new Progress({
        userId,
        lessonId,
        status: 'completed',
        completedAt: new Date(),
        timeSpent
      });
    } else {
      progress.status = 'completed';
      progress.completedAt = new Date();
      progress.timeSpent += timeSpent;
    }

    await progress.save();
    
    // Populate lesson details before returning
    await progress.populate('lessonId', 'title description difficulty tags');
    
    return progress;
  } catch (error) {
    throw new Error(`Failed to record lesson completion: ${error.message}`);
  }
};

/**
 * Submit quiz and calculate score
 * @param {String} userId - User's MongoDB ObjectId
 * @param {String} lessonId - Lesson's MongoDB ObjectId
 * @param {Array<Number>} answers - Array of answer indices
 * @returns {Promise<Object>} Quiz results with score and correct answers
 */
export const submitQuiz = async (userId, lessonId, answers) => {
  try {
    // Verify lesson exists and get quiz data
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    if (!lesson.quiz || !lesson.quiz.questions || lesson.quiz.questions.length === 0) {
      throw new Error('Lesson does not have a quiz');
    }

    // Validate answers array
    if (!Array.isArray(answers) || answers.length !== lesson.quiz.questions.length) {
      throw new Error('Invalid answers format or length');
    }

    // Calculate score
    let correctCount = 0;
    const results = lesson.quiz.questions.map((question, index) => {
      const isCorrect = answers[index] === question.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation || null
      };
    });

    const score = Math.round((correctCount / lesson.quiz.questions.length) * 100);

    // Find or create progress record
    let progress = await Progress.findOne({ userId, lessonId });
    
    if (!progress) {
      progress = new Progress({
        userId,
        lessonId,
        status: 'in_progress',
        quizScore: score,
        quizAttempts: 1
      });
    } else {
      progress.quizScore = score;
      progress.quizAttempts += 1;
      
      // Mark as completed if quiz passed (score >= 70%)
      if (score >= 70 && progress.status !== 'completed') {
        progress.status = 'completed';
        progress.completedAt = new Date();
      }
    }

    await progress.save();
    
    // Populate lesson details
    await progress.populate('lessonId', 'title description difficulty tags');

    return {
      progress,
      quizResults: {
        score,
        correctCount,
        totalQuestions: lesson.quiz.questions.length,
        passed: score >= 70,
        results
      }
    };
  } catch (error) {
    throw new Error(`Failed to submit quiz: ${error.message}`);
  }
};

/**
 * Get progress summary for a user
 * @param {String} userId - User's MongoDB ObjectId
 * @returns {Promise<Object>} Progress summary with statistics
 */
export const getProgressSummary = async (userId) => {
  try {
    const progressRecords = await Progress.find({ userId });
    
    const completedLessons = progressRecords.filter(p => p.status === 'completed').length;
    const inProgressLessons = progressRecords.filter(p => p.status === 'in_progress').length;
    
    // Calculate average quiz score (only for completed quizzes)
    const quizScores = progressRecords
      .filter(p => p.quizScore !== null && p.quizScore !== undefined)
      .map(p => p.quizScore);
    
    const averageQuizScore = quizScores.length > 0
      ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length)
      : 0;
    
    // Calculate total time spent
    const totalTimeSpent = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    return {
      totalLessons: progressRecords.length,
      completedLessons,
      inProgressLessons,
      averageQuizScore,
      totalTimeSpent,
      quizzesTaken: quizScores.length
    };
  } catch (error) {
    throw new Error(`Failed to get progress summary: ${error.message}`);
  }
};
