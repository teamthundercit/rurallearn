/**
 * Adaptive Learning Service
 * Adjusts content and recommendations based on student performance and pace
 */

/**
 * Analyze student's learning performance
 * @param {Array} progressData - Student's progress records
 * @returns {Object} Performance analysis
 */
export const analyzePerformance = (progressData) => {
  if (!progressData || progressData.length === 0) {
    return {
      level: 'beginner',
      averageScore: 0,
      completionRate: 0,
      pace: 'normal',
      strengths: [],
      weaknesses: [],
      recommendedDifficulty: 'beginner'
    };
  }

  const completedLessons = progressData.filter(p => p.status === 'completed');
  const quizScores = completedLessons
    .filter(p => p.quizScore !== null && p.quizScore !== undefined)
    .map(p => p.quizScore);

  // Calculate average score
  const averageScore = quizScores.length > 0
    ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length
    : 0;

  // Calculate completion rate
  const completionRate = progressData.length > 0
    ? (completedLessons.length / progressData.length) * 100
    : 0;

  // Determine learning pace (based on time spent vs lessons completed)
  const totalTimeSpent = completedLessons.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const avgTimePerLesson = completedLessons.length > 0
    ? totalTimeSpent / completedLessons.length
    : 0;

  let pace = 'normal';
  if (avgTimePerLesson < 10) pace = 'fast';
  else if (avgTimePerLesson > 30) pace = 'slow';

  // Determine current level based on performance
  let level = 'beginner';
  let recommendedDifficulty = 'beginner';

  if (averageScore >= 85 && completedLessons.length >= 5) {
    level = 'advanced';
    recommendedDifficulty = 'advanced';
  } else if (averageScore >= 70 && completedLessons.length >= 3) {
    level = 'intermediate';
    recommendedDifficulty = 'intermediate';
  } else if (averageScore >= 60 && completedLessons.length >= 2) {
    level = 'intermediate';
    recommendedDifficulty = 'beginner'; // Still recommend beginner to build confidence
  }

  // Identify strengths and weaknesses by difficulty
  const beginnerLessons = completedLessons.filter(p => p.lessonId?.difficulty === 'beginner');
  const intermediateLessons = completedLessons.filter(p => p.lessonId?.difficulty === 'intermediate');
  const advancedLessons = completedLessons.filter(p => p.lessonId?.difficulty === 'advanced');

  const strengths = [];
  const weaknesses = [];

  const avgBeginnerScore = beginnerLessons.length > 0
    ? beginnerLessons.reduce((sum, p) => sum + (p.quizScore || 0), 0) / beginnerLessons.length
    : 0;

  const avgIntermediateScore = intermediateLessons.length > 0
    ? intermediateLessons.reduce((sum, p) => sum + (p.quizScore || 0), 0) / intermediateLessons.length
    : 0;

  const avgAdvancedScore = advancedLessons.length > 0
    ? advancedLessons.reduce((sum, p) => sum + (p.quizScore || 0), 0) / advancedLessons.length
    : 0;

  if (avgBeginnerScore >= 80) strengths.push('beginner');
  else if (avgBeginnerScore < 60 && beginnerLessons.length > 0) weaknesses.push('beginner');

  if (avgIntermediateScore >= 80) strengths.push('intermediate');
  else if (avgIntermediateScore < 60 && intermediateLessons.length > 0) weaknesses.push('intermediate');

  if (avgAdvancedScore >= 80) strengths.push('advanced');
  else if (avgAdvancedScore < 60 && advancedLessons.length > 0) weaknesses.push('advanced');

  return {
    level,
    averageScore: Math.round(averageScore),
    completionRate: Math.round(completionRate),
    pace,
    strengths,
    weaknesses,
    recommendedDifficulty,
    totalLessonsCompleted: completedLessons.length,
    avgTimePerLesson: Math.round(avgTimePerLesson)
  };
};

/**
 * Generate adaptive recommendations based on performance
 * @param {Object} performance - Performance analysis
 * @param {Array} allLessons - All available lessons
 * @param {Array} completedLessonIds - IDs of completed lessons
 * @returns {Array} Adaptive lesson recommendations
 */
export const getAdaptiveRecommendations = (performance, allLessons, completedLessonIds) => {
  const availableLessons = allLessons.filter(
    lesson => !completedLessonIds.includes(lesson._id.toString())
  );

  if (availableLessons.length === 0) {
    return [];
  }

  // Filter lessons based on recommended difficulty
  let recommendedLessons = availableLessons.filter(
    lesson => lesson.difficulty === performance.recommendedDifficulty
  );

  // If not enough lessons at recommended difficulty, include adjacent levels
  if (recommendedLessons.length < 3) {
    if (performance.recommendedDifficulty === 'beginner') {
      recommendedLessons = [
        ...recommendedLessons,
        ...availableLessons.filter(l => l.difficulty === 'intermediate')
      ];
    } else if (performance.recommendedDifficulty === 'intermediate') {
      recommendedLessons = [
        ...recommendedLessons,
        ...availableLessons.filter(l => l.difficulty === 'beginner' || l.difficulty === 'advanced')
      ];
    } else {
      recommendedLessons = [
        ...recommendedLessons,
        ...availableLessons.filter(l => l.difficulty === 'intermediate')
      ];
    }
  }

  // If still not enough, add any available lessons
  if (recommendedLessons.length < 3) {
    recommendedLessons = availableLessons.slice(0, 5);
  }

  // Sort by difficulty match and limit to top 5
  return recommendedLessons.slice(0, 5);
};

/**
 * Generate personalized feedback message
 * @param {Object} performance - Performance analysis
 * @returns {String} Personalized feedback message
 */
export const generateFeedback = (performance) => {
  const { level, averageScore, pace, totalLessonsCompleted, weaknesses } = performance;

  // First-time learner
  if (totalLessonsCompleted === 0) {
    return "Welcome! Start your learning journey with beginner-friendly lessons. Take your time and enjoy learning!";
  }

  // Early stage (1-2 lessons)
  if (totalLessonsCompleted <= 2) {
    if (averageScore >= 80) {
      return "Excellent start! You're doing great. Keep up the momentum!";
    } else if (averageScore >= 60) {
      return "Good progress! You're on the right track. Practice makes perfect!";
    } else {
      return "You're learning! Don't worry about the scores - focus on understanding the concepts.";
    }
  }

  // Experienced learner (3+ lessons)
  let message = '';

  // Performance-based message
  if (averageScore >= 85) {
    message = `Outstanding performance! You're scoring ${averageScore}% on average. `;
    if (level === 'advanced') {
      message += "You've mastered the fundamentals - ready for advanced challenges!";
    } else {
      message += "Consider trying more challenging lessons!";
    }
  } else if (averageScore >= 70) {
    message = `Great work! You're maintaining a solid ${averageScore}% average. `;
    if (pace === 'fast') {
      message += "You're learning quickly - keep the pace!";
    } else {
      message += "Steady progress is the key to mastery!";
    }
  } else if (averageScore >= 50) {
    message = `You're making progress with ${averageScore}% average. `;
    if (weaknesses.length > 0) {
      message += `Focus on strengthening your ${weaknesses.join(' and ')} skills.`;
    } else {
      message += "Take time to review and practice - you'll improve!";
    }
  } else {
    message = "Learning takes time! ";
    message += "Consider reviewing previous lessons and don't hesitate to take breaks.";
  }

  // Pace-based addition
  if (pace === 'slow' && averageScore >= 70) {
    message += " Your thorough approach is paying off!";
  } else if (pace === 'fast' && averageScore < 70) {
    message += " Try slowing down to absorb the material better.";
  }

  return message;
};

/**
 * Determine if student should advance to next difficulty level
 * @param {Object} performance - Performance analysis
 * @returns {Object} Advancement recommendation
 */
export const shouldAdvance = (performance) => {
  const { level, averageScore, totalLessonsCompleted, recommendedDifficulty } = performance;

  // Need at least 3 completed lessons to consider advancement
  if (totalLessonsCompleted < 3) {
    return {
      shouldAdvance: false,
      reason: 'Complete more lessons to unlock higher difficulty levels',
      currentLevel: level,
      nextLevel: level
    };
  }

  // Check if ready to advance
  if (level === 'beginner' && averageScore >= 75 && totalLessonsCompleted >= 3) {
    return {
      shouldAdvance: true,
      reason: 'Your strong performance shows you\'re ready for intermediate challenges!',
      currentLevel: 'beginner',
      nextLevel: 'intermediate'
    };
  }

  if (level === 'intermediate' && averageScore >= 80 && totalLessonsCompleted >= 5) {
    return {
      shouldAdvance: true,
      reason: 'Excellent work! You\'re ready for advanced topics!',
      currentLevel: 'intermediate',
      nextLevel: 'advanced'
    };
  }

  // Should stay at current level
  return {
    shouldAdvance: false,
    reason: averageScore < 70 
      ? 'Focus on mastering current level before advancing'
      : 'Keep building your skills at this level',
    currentLevel: level,
    nextLevel: level
  };
};

export default {
  analyzePerformance,
  getAdaptiveRecommendations,
  generateFeedback,
  shouldAdvance
};
