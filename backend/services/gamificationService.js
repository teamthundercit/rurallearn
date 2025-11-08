import User from '../models/User.js';
import Progress from '../models/Progress.js';

// Badge definitions
const BADGES = {
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    icon: '🎯',
    description: 'Complete your first lesson',
    condition: (stats) => stats.completedLessons >= 1
  },
  GETTING_STARTED: {
    id: 'getting_started',
    name: 'Getting Started',
    icon: '⭐',
    description: 'Complete 5 lessons',
    condition: (stats) => stats.completedLessons >= 5
  },
  DEDICATED_LEARNER: {
    id: 'dedicated_learner',
    name: 'Dedicated Learner',
    icon: '🌟',
    description: 'Complete 10 lessons',
    condition: (stats) => stats.completedLessons >= 10
  },
  KNOWLEDGE_SEEKER: {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    icon: '💫',
    description: 'Complete 20 lessons',
    condition: (stats) => stats.completedLessons >= 20
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    icon: '💯',
    description: 'Score 100% on a quiz',
    condition: (stats) => stats.hasPerfectScore
  },
  HIGH_ACHIEVER: {
    id: 'high_achiever',
    name: 'High Achiever',
    icon: '🏆',
    description: 'Maintain 90%+ average',
    condition: (stats) => stats.averageScore >= 90
  },
  STREAK_3: {
    id: 'streak_3',
    name: '3-Day Streak',
    icon: '🔥',
    description: 'Learn 3 days in a row',
    condition: (stats) => stats.currentStreak >= 3
  },
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: 'Week Warrior',
    icon: '🔥🔥',
    description: 'Learn 7 days in a row',
    condition: (stats) => stats.currentStreak >= 7
  },
  MONTH_MASTER: {
    id: 'month_master',
    name: 'Month Master',
    icon: '🔥🔥🔥',
    description: 'Learn 30 days in a row',
    condition: (stats) => stats.currentStreak >= 30
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    icon: '⚡',
    description: 'Complete 5 lessons in one day',
    condition: (stats) => stats.lessonsInOneDay >= 5
  },
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Quiz Master',
    icon: '🎓',
    description: 'Pass 10 quizzes',
    condition: (stats) => stats.passedQuizzes >= 10
  },
  COMEBACK_KID: {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    icon: '💪',
    description: 'Improve score by 20%+',
    condition: (stats) => stats.hasImprovement
  }
};

/**
 * Update user's learning streak
 */
export const updateStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const lastActivity = user.gamification?.streak?.lastActivityDate;
    const lastActivityDate = lastActivity ? new Date(lastActivity) : null;
    const lastActivityDay = lastActivityDate 
      ? new Date(lastActivityDate.getFullYear(), lastActivityDate.getMonth(), lastActivityDate.getDate())
      : null;

    // Initialize gamification if not exists
    if (!user.gamification) {
      user.gamification = {
        streak: { current: 0, longest: 0, lastActivityDate: null },
        badges: [],
        totalPoints: 0,
        weeklyGoal: 3,
        monthlyGoal: 12
      };
    }

    // Check if already updated today
    if (lastActivityDay && lastActivityDay.getTime() === today.getTime()) {
      return user.gamification.streak;
    }

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastActivityDay) {
      // First activity
      user.gamification.streak.current = 1;
    } else if (lastActivityDay.getTime() === yesterday.getTime()) {
      // Consecutive day
      user.gamification.streak.current += 1;
    } else if (lastActivityDay.getTime() < yesterday.getTime()) {
      // Streak broken
      user.gamification.streak.current = 1;
    }

    // Update longest streak
    if (user.gamification.streak.current > user.gamification.streak.longest) {
      user.gamification.streak.longest = user.gamification.streak.current;
    }

    user.gamification.streak.lastActivityDate = now;
    await user.save();

    return user.gamification.streak;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

/**
 * Calculate points for a progress entry
 */
export const calculatePoints = (progressData) => {
  let points = 0;

  // Base points for completion
  if (progressData.status === 'completed') {
    points += 10;
  }

  // Quiz score points
  if (progressData.quizScore !== null && progressData.quizScore !== undefined) {
    points += Math.floor(progressData.quizScore / 10); // 1 point per 10%
    
    // Bonus for perfect score
    if (progressData.quizScore === 100) {
      points += 20;
    }
    // Bonus for excellent score
    else if (progressData.quizScore >= 90) {
      points += 10;
    }
  }

  return points;
};

/**
 * Check and award badges to user
 */
export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Get user statistics
    const progress = await Progress.find({ userId }).populate('lessonId');
    
    const stats = {
      completedLessons: progress.filter(p => p.status === 'completed').length,
      averageScore: 0,
      hasPerfectScore: false,
      currentStreak: user.gamification?.streak?.current || 0,
      lessonsInOneDay: 0,
      passedQuizzes: 0,
      hasImprovement: false
    };

    // Calculate average score
    const quizScores = progress
      .filter(p => p.quizScore !== null && p.quizScore !== undefined)
      .map(p => p.quizScore);
    
    if (quizScores.length > 0) {
      stats.averageScore = quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length;
      stats.hasPerfectScore = quizScores.some(score => score === 100);
      stats.passedQuizzes = quizScores.filter(score => score >= 70).length;
    }

    // Check lessons in one day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayProgress = progress.filter(p => {
      const progressDate = new Date(p.completedAt || p.updatedAt);
      progressDate.setHours(0, 0, 0, 0);
      return progressDate.getTime() === today.getTime() && p.status === 'completed';
    });
    stats.lessonsInOneDay = todayProgress.length;

    // Check for improvement
    const lessonRetakes = {};
    progress.forEach(p => {
      const lessonId = p.lessonId?._id?.toString() || p.lessonId?.toString();
      if (!lessonRetakes[lessonId]) {
        lessonRetakes[lessonId] = [];
      }
      if (p.quizScore !== null) {
        lessonRetakes[lessonId].push(p.quizScore);
      }
    });

    for (const scores of Object.values(lessonRetakes)) {
      if (scores.length >= 2) {
        const improvement = scores[scores.length - 1] - scores[0];
        if (improvement >= 20) {
          stats.hasImprovement = true;
          break;
        }
      }
    }

    // Check each badge
    const newBadges = [];
    const existingBadgeIds = (user.gamification?.badges || []).map(b => b.id);

    for (const badge of Object.values(BADGES)) {
      if (!existingBadgeIds.includes(badge.id) && badge.condition(stats)) {
        newBadges.push({
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          description: badge.description,
          earnedAt: new Date()
        });
      }
    }

    // Award new badges
    if (newBadges.length > 0) {
      if (!user.gamification) {
        user.gamification = {
          streak: { current: 0, longest: 0, lastActivityDate: null },
          badges: [],
          totalPoints: 0,
          weeklyGoal: 3,
          monthlyGoal: 12
        };
      }
      user.gamification.badges.push(...newBadges);
      await user.save();
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    throw error;
  }
};

/**
 * Update user's total points
 */
export const updateTotalPoints = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const progress = await Progress.find({ userId });
    
    let totalPoints = 0;
    progress.forEach(p => {
      totalPoints += calculatePoints(p);
    });

    if (!user.gamification) {
      user.gamification = {
        streak: { current: 0, longest: 0, lastActivityDate: null },
        badges: [],
        totalPoints: 0,
        weeklyGoal: 3,
        monthlyGoal: 12
      };
    }

    user.gamification.totalPoints = totalPoints;
    await user.save();

    return totalPoints;
  } catch (error) {
    console.error('Error updating total points:', error);
    throw error;
  }
};

/**
 * Get weekly activity data
 */
export const getWeeklyActivity = async (userId) => {
  try {
    if (!userId) {
      console.warn('No userId provided for weekly activity');
      return [];
    }
    
    const progress = await Progress.find({ userId });
    
    // Get last 7 days
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayProgress = progress.filter(p => {
        const progressDate = new Date(p.completedAt || p.updatedAt);
        return progressDate >= date && progressDate < nextDate;
      });
      
      const completedLessons = dayProgress.filter(p => p.status === 'completed').length;
      const timeSpent = dayProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      
      days.push({
        date: dayNames[date.getDay()],
        lessonsCompleted: completedLessons,
        timeSpent: timeSpent
      });
    }
    
    return days;
  } catch (error) {
    console.error('Error getting weekly activity:', error);
    throw error;
  }
};

/**
 * Get recent achievements
 */
export const getRecentAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.warn('User not found for recent achievements:', userId);
      return [];
    }

    const progress = await Progress.find({ userId })
      .populate('lessonId')
      .sort({ updatedAt: -1 })
      .limit(10);
    
    const achievements = [];
    
    // Add recent badge earnings
    if (user.gamification?.badges) {
      user.gamification.badges
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 5)
        .forEach(badge => {
          achievements.push({
            type: 'badge',
            icon: badge.icon,
            title: `Earned: ${badge.name}`,
            date: badge.earnedAt,
            score: null
          });
        });
    }
    
    // Add recent completions
    progress
      .filter(p => p.status === 'completed')
      .slice(0, 5)
      .forEach(p => {
        achievements.push({
          type: 'completion',
          icon: '✅',
          title: `Completed: ${p.lessonId?.title || 'Lesson'}`,
          date: p.completedAt || p.updatedAt,
          score: p.quizScore
        });
      });
    
    // Sort by date and limit
    achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return achievements.slice(0, 10);
  } catch (error) {
    console.error('Error getting recent achievements:', error);
    throw error;
  }
};

/**
 * Get goal progress
 */
export const getGoalProgress = async (userId) => {
  try {
    if (!userId) {
      console.warn('No userId provided for goal progress');
      return { weeklyProgress: 0, monthlyProgress: 0 };
    }
    
    const progress = await Progress.find({ userId });
    
    // Weekly progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyCompleted = progress.filter(p => {
      const date = new Date(p.completedAt || p.updatedAt);
      return date >= weekStart && p.status === 'completed';
    }).length;
    
    // Monthly progress
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthlyCompleted = progress.filter(p => {
      const date = new Date(p.completedAt || p.updatedAt);
      return date >= monthStart && p.status === 'completed';
    }).length;
    
    return {
      weeklyProgress: weeklyCompleted,
      monthlyProgress: monthlyCompleted
    };
  } catch (error) {
    console.error('Error getting goal progress:', error);
    throw error;
  }
};

/**
 * Get leaderboard data
 */
export const getLeaderboard = async (timeframe = 'week') => {
  try {
    const users = await User.find({ role: 'student' })
      .select('name gamification')
      .lean();
    
    if (!users || users.length === 0) {
      console.warn('No users found for leaderboard');
      return [];
    }
    
    // Calculate points for timeframe
    const leaderboard = await Promise.all(users.map(async (user) => {
      if (!user || !user._id) {
        return null;
      }
      
      let points = 0;
      
      if (timeframe === 'all') {
        points = user.gamification?.totalPoints || 0;
      } else {
        const progress = await Progress.find({ userId: user._id });
        
        const cutoffDate = new Date();
        if (timeframe === 'week') {
          cutoffDate.setDate(cutoffDate.getDate() - 7);
        } else if (timeframe === 'month') {
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        }
        
        progress
          .filter(p => new Date(p.updatedAt) >= cutoffDate)
          .forEach(p => {
            points += calculatePoints(p);
          });
      }
      
      return {
        name: `Anonymous ${user._id.toString().slice(-4)}`, // Anonymize
        points: points,
        streak: user.gamification?.streak?.current || 0,
        userId: user._id
      };
    }));
    
    // Filter out null entries
    const validLeaderboard = leaderboard.filter(entry => entry !== null);
    
    // Sort by points
    validLeaderboard.sort((a, b) => b.points - a.points);
    
    // Add ranks and badges
    return validLeaderboard.map((entry, index) => ({
      rank: index + 1,
      name: entry.name,
      points: entry.points,
      streak: entry.streak,
      badge: index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : index < 10 ? '🌟' : '⭐',
      userId: entry.userId
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

export default {
  updateStreak,
  calculatePoints,
  checkAndAwardBadges,
  updateTotalPoints,
  getWeeklyActivity,
  getRecentAchievements,
  getGoalProgress,
  getLeaderboard
};
