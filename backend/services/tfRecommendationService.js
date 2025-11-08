import * as tf from '@tensorflow/tfjs';

/**
 * TensorFlow.js-based Recommendation Service
 * Provides local AI recommendations without external API dependency
 */
class TFRecommendationService {
  constructor() {
    this.model = null;
    this.isInitialized = false;
  }

  /**
   * Initialize a simple neural network for recommendations
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Create a simple feedforward neural network
      this.model = tf.sequential({
        layers: [
          // Input: user features (completed lessons, avg score, difficulty preference)
          tf.layers.dense({
            inputShape: [6],
            units: 16,
            activation: 'relu',
            kernelInitializer: 'heNormal'
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({
            units: 8,
            activation: 'relu',
            kernelInitializer: 'heNormal'
          }),
          // Output: lesson recommendation score (0-1)
          tf.layers.dense({
            units: 1,
            activation: 'sigmoid'
          })
        ]
      });

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      this.isInitialized = true;
      console.log('✓ TensorFlow.js recommendation model initialized');
    } catch (error) {
      console.error('Failed to initialize TensorFlow model:', error);
      throw error;
    }
  }

  /**
   * Extract features from user progress data
   */
  extractUserFeatures(user, progressData) {
    const completedLessons = progressData.filter(p => p.status === 'completed');
    
    // Calculate features
    const totalCompleted = completedLessons.length;
    const avgScore = completedLessons.length > 0
      ? completedLessons.reduce((sum, p) => sum + (p.quizScore || 0), 0) / completedLessons.length
      : 0;
    
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    // Difficulty preference (0=beginner, 0.5=intermediate, 1=advanced)
    const difficultyMap = { beginner: 0, intermediate: 0.5, advanced: 1 };
    const difficultyPref = difficultyMap[user.preferences?.difficultyLevel] || 0;
    
    // Learning goals count (normalized)
    const goalsCount = (user.preferences?.learningGoals?.length || 0) / 5;
    
    // Topics of interest count (normalized)
    const topicsCount = (user.preferences?.topicsOfInterest?.length || 0) / 10;

    return [
      totalCompleted / 20,      // Normalize to 0-1 (assuming max 20 lessons)
      avgScore / 100,            // Already 0-100, normalize to 0-1
      totalTimeSpent / 1000,     // Normalize time (assuming max 1000 minutes)
      difficultyPref,            // Already 0-1
      goalsCount,                // Already 0-1
      topicsCount                // Already 0-1
    ];
  }

  /**
   * Extract features from a lesson
   */
  extractLessonFeatures(lesson, userDifficultyPref) {
    const difficultyMap = { beginner: 0, intermediate: 0.5, advanced: 1 };
    const lessonDifficulty = difficultyMap[lesson.difficulty] || 0;
    
    // Calculate difficulty match (closer to user preference = higher score)
    const difficultyMatch = 1 - Math.abs(lessonDifficulty - userDifficultyPref);
    
    // Has quiz (binary)
    const hasQuiz = lesson.quiz && lesson.quiz.length > 0 ? 1 : 0;
    
    // Content type score (video=1, mixed=0.75, text=0.5)
    const contentTypeMap = { video: 1, mixed: 0.75, text: 0.5 };
    const contentScore = contentTypeMap[lesson.content?.type] || 0.5;
    
    // Tags count (normalized)
    const tagsCount = (lesson.tags?.length || 0) / 10;

    return [
      lessonDifficulty,
      difficultyMatch,
      hasQuiz,
      contentScore,
      tagsCount,
      0 // Placeholder for future features
    ];
  }

  /**
   * Generate recommendations using the TensorFlow model
   */
  async generateRecommendations(user, progressData, allLessons) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get completed lesson IDs
      const completedLessonIds = progressData
        .filter(p => p.status === 'completed')
        .map(p => p.lessonId?.toString() || p.lessonId);

      // Filter available lessons
      const availableLessons = allLessons.filter(
        lesson => !completedLessonIds.includes(lesson._id.toString())
      );

      if (availableLessons.length === 0) {
        return {
          recommendations: [],
          overallGuidance: 'Congratulations! You\'ve completed all available lessons!'
        };
      }

      // Extract user features
      const userFeatures = this.extractUserFeatures(user, progressData);
      const userDifficultyPref = userFeatures[3]; // Difficulty preference

      // Score each available lesson
      const lessonScores = [];
      
      for (const lesson of availableLessons) {
        const lessonFeatures = this.extractLessonFeatures(lesson, userDifficultyPref);
        
        // Combine user and lesson features
        const combinedFeatures = tf.tensor2d([userFeatures], [1, 6]);
        
        // Get prediction (recommendation score)
        const prediction = this.model.predict(combinedFeatures);
        const score = await prediction.data();
        
        // Add heuristic adjustments
        let adjustedScore = score[0];
        
        // Boost score based on difficulty match
        adjustedScore *= lessonFeatures[1]; // difficultyMatch
        
        // Boost if has quiz
        if (lessonFeatures[2] === 1) adjustedScore *= 1.1;
        
        // Boost based on content type
        adjustedScore *= (0.8 + lessonFeatures[3] * 0.2);
        
        lessonScores.push({
          lesson,
          score: adjustedScore
        });
        
        // Clean up tensors
        combinedFeatures.dispose();
        prediction.dispose();
      }

      // Sort by score and get top 5
      lessonScores.sort((a, b) => b.score - a.score);
      const topLessons = lessonScores.slice(0, 5);

      // Determine priority based on score
      const getPriority = (score) => {
        if (score > 0.7) return 'high';
        if (score > 0.4) return 'medium';
        return 'low';
      };

      // Generate reasons based on features
      const generateReason = (lesson, score) => {
        const reasons = [];
        
        if (lesson.difficulty === user.preferences?.difficultyLevel) {
          reasons.push('matches your skill level');
        }
        
        if (lesson.quiz && lesson.quiz.length > 0) {
          reasons.push('includes practice quiz');
        }
        
        if (lesson.content?.type === 'video') {
          reasons.push('engaging video content');
        }
        
        if (progressData.length > 0) {
          reasons.push('builds on your progress');
        }
        
        if (reasons.length === 0) {
          reasons.push('recommended for your learning path');
        }
        
        return `Great choice - ${reasons.join(', ')}`;
      };

      // Format recommendations
      const recommendations = topLessons.map(({ lesson, score }) => ({
        lessonTitle: lesson.title,
        reason: generateReason(lesson, score),
        priority: getPriority(score)
      }));

      // Generate overall guidance
      const completedCount = progressData.filter(p => p.status === 'completed').length;
      const avgScore = progressData.length > 0
        ? progressData.reduce((sum, p) => sum + (p.quizScore || 0), 0) / progressData.length
        : 0;

      let guidance = '';
      if (completedCount === 0) {
        guidance = 'Welcome! Start your learning journey with these recommended lessons.';
      } else if (completedCount < 3) {
        guidance = 'Great start! Keep building your knowledge with these next steps.';
      } else if (avgScore > 80) {
        guidance = `Excellent work! You're scoring ${avgScore.toFixed(0)}% on average. Ready for the next challenge?`;
      } else if (avgScore > 60) {
        guidance = `Good progress! You've completed ${completedCount} lessons. These will help strengthen your skills.`;
      } else {
        guidance = `You're learning! Focus on these lessons to build a stronger foundation.`;
      }

      return {
        recommendations,
        overallGuidance: guidance
      };

    } catch (error) {
      console.error('TensorFlow recommendation error:', error);
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export default new TFRecommendationService();
