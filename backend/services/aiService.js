import { GoogleGenerativeAI } from '@google/generative-ai';
import AIInteraction from '../models/AIInteraction.js';
import tfRecommendationService from './tfRecommendationService.js';
import * as adaptiveLearningService from './adaptiveLearningService.js';

// Lazy initialization of Gemini AI client
let genAI = null;
let apiKeyChecked = false;

/**
 * Get or initialize Gemini AI client
 * @returns {GoogleGenerativeAI|null} Gemini AI client instance
 */
const getGenAI = () => {
  if (!apiKeyChecked) {
    apiKeyChecked = true;
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY not configured. AI features will use fallback mode.');
      console.warn('   Get your API key at: https://aistudio.google.com/app/apikey');
    } else {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      console.log('✓ Gemini AI initialized successfully');
    }
  }
  return genAI;
};

/**
 * Get Gemini AI model instance
 * @param {string} modelName - Model name (default: gemini-2.5-flash)
 * @returns {Object} Gemini model instance
 */
export const getModel = (modelName = 'gemini-2.5-flash') => {
  const client = getGenAI();
  if (!client) {
    throw new Error('Gemini API not configured');
  }
  return client.getGenerativeModel({ model: modelName });
};

/**
 * Generate personalized lesson recommendations based on user progress
 * @param {Object} user - User object
 * @param {Array} progressData - Array of user's progress records
 * @param {Array} allLessons - Array of all available lessons
 * @returns {Promise<Object>} Recommendations object
 */
export const generateRecommendations = async (user, progressData, allLessons) => {
  try {
    // Check if Gemini API is available
    const client = getGenAI();
    if (!client) {
      throw new Error('Gemini API not configured');
    }
    
    const model = getModel();

    // Prepare user progress summary
    const completedLessons = progressData.filter(p => p.status === 'completed');
    const averageScore = completedLessons.length > 0
      ? completedLessons.reduce((sum, p) => sum + (p.quizScore || 0), 0) / completedLessons.length
      : 0;
    
    const completedLessonIds = completedLessons.map(p => p.lessonId.toString());
    const availableLessons = allLessons.filter(
      lesson => !completedLessonIds.includes(lesson._id.toString())
    );

    // Build prompt for Gemini
    const userPreferences = user.preferences || {};
    const hasPreferences = userPreferences.onboardingCompleted;
    
    const prompt = `You are an educational AI assistant for EduAdapt, a platform helping students in rural areas with adaptive learning.

User Profile:
- Name: ${user.name}
- Role: ${user.role}
- Completed Lessons: ${completedLessons.length}
- Average Quiz Score: ${averageScore.toFixed(1)}%
${hasPreferences ? `
User Preferences (from onboarding):
- Learning Goals: ${userPreferences.learningGoals?.join(', ') || 'Not specified'}
- Preferred Difficulty: ${userPreferences.difficultyLevel || 'Not specified'}
- Topics of Interest: ${userPreferences.topicsOfInterest?.join(', ') || 'Not specified'}` : ''}

Recent Progress:
${completedLessons.slice(-5).map(p => `- Lesson: ${p.lessonId.title || 'Unknown'}, Score: ${p.quizScore || 0}%`).join('\n')}

Available Lessons:
${availableLessons.slice(0, 10).map((lesson, idx) => 
  `${idx + 1}. ${lesson.title} (${lesson.difficulty}) - ${lesson.description || 'No description'}`
).join('\n')}

Based on the user's progress, performance${hasPreferences ? ', and stated preferences' : ''}, recommend 3-5 lessons from the available lessons that would be most beneficial for their learning journey. 

IMPORTANT: Provide actionable recommendations that encourage immediate learning. Consider:
1. Their current skill level based on quiz scores
2. Logical progression from completed lessons
3. Difficulty level appropriate for their performance${hasPreferences ? ' and preferences' : ''}
4. Variety in topics to maintain engagement${hasPreferences ? '\n5. Alignment with their learning goals and interests' : ''}
6. Make the reason compelling and motivating to start learning NOW

Provide your response in the following JSON format:
{
  "recommendations": [
    {
      "lessonTitle": "exact lesson title from the list",
      "reason": "brief, compelling explanation why this lesson is recommended and why to start now (max 2 sentences)",
      "priority": "high/medium/low"
    }
  ],
  "overallGuidance": "brief personalized, encouraging message for the student (1-2 sentences)"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let recommendations;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      recommendations = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', text);
      // Fallback response
      recommendations = {
        recommendations: availableLessons.slice(0, 3).map(lesson => ({
          lessonTitle: lesson.title,
          reason: 'Recommended based on your progress',
          priority: 'medium'
        })),
        overallGuidance: 'Continue your learning journey with these suggested lessons.'
      };
    }

    // Store AI interaction
    await AIInteraction.create({
      userId: user._id,
      type: 'recommendation',
      input: {
        completedLessons: completedLessons.length,
        averageScore,
        availableLessonsCount: availableLessons.length
      },
      output: recommendations
    });

    return recommendations;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    
    // Try TensorFlow.js fallback first
    try {
      console.log('→ Using TensorFlow.js local AI model');
      const tfRecommendations = await tfRecommendationService.generateRecommendations(
        user,
        progressData,
        allLessons
      );
      
      // Store AI interaction
      await AIInteraction.create({
        userId: user._id,
        type: 'recommendation',
        input: {
          completedLessons: progressData.filter(p => p.status === 'completed').length,
          source: 'tensorflow'
        },
        output: tfRecommendations
      });
      
      return tfRecommendations;
    } catch (tfError) {
      console.error('TensorFlow fallback error:', tfError.message);
      console.log('→ Using rule-based recommendations');
    }
    
    // Final fallback: Adaptive rule-based recommendations
    const completedLessons = progressData.filter(p => p.status === 'completed');
    const completedLessonIds = completedLessons.map(p => p.lessonId.toString());
    
    // Analyze student performance for adaptive learning
    const performance = adaptiveLearningService.analyzePerformance(progressData);
    
    // Get adaptive recommendations
    const recommendedLessons = adaptiveLearningService.getAdaptiveRecommendations(
      performance,
      allLessons,
      completedLessonIds
    );
    
    // Generate personalized feedback
    const feedback = adaptiveLearningService.generateFeedback(performance);
    
    // Check if student should advance
    const advancement = adaptiveLearningService.shouldAdvance(performance);
    
    // Build recommendations with adaptive reasoning
    const adaptiveRecommendations = {
      recommendations: recommendedLessons.map((lesson, idx) => {
        let reason = '';
        
        if (lesson.difficulty === performance.recommendedDifficulty) {
          reason = `Perfect match for your ${performance.level} level (${performance.averageScore}% avg)`;
        } else if (lesson.difficulty === 'beginner' && performance.weaknesses.includes('beginner')) {
          reason = 'Strengthen your fundamentals with this lesson';
        } else if (advancement.shouldAdvance && lesson.difficulty === advancement.nextLevel) {
          reason = 'Ready to level up? Try this challenge!';
        } else {
          reason = 'Recommended to expand your knowledge';
        }
        
        return {
          lessonTitle: lesson.title,
          reason,
          priority: idx === 0 ? 'high' : idx === 1 ? 'medium' : 'low'
        };
      }),
      overallGuidance: feedback,
      adaptiveInsights: {
        currentLevel: performance.level,
        averageScore: performance.averageScore,
        learningPace: performance.pace,
        recommendedDifficulty: performance.recommendedDifficulty,
        canAdvance: advancement.shouldAdvance,
        advancementMessage: advancement.reason
      }
    };
    
    return adaptiveRecommendations;
  }
};

/**
 * Handle chatbot conversation with Gemini AI
 * @param {Object} user - User object
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} AI response object
 */
export const handleChatMessage = async (user, message, conversationHistory = []) => {
  try {
    const model = getModel();

    // Build conversation context
    const systemContext = `You are an educational AI assistant for RuralLearn, helping ${user.name}, a ${user.role} in a rural learning environment. 
Provide helpful, encouraging, and educational responses. Keep answers concise and appropriate for students with limited internet access.`;

    // Format conversation history
    const historyText = conversationHistory.length > 0
      ? conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : '';

    const fullPrompt = `${systemContext}

${historyText ? `Previous conversation:\n${historyText}\n` : ''}
Student: ${message}

AI As
sistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Store AI interaction
    await AIInteraction.create({
      userId: user._id,
      type: 'chat',
      input: {
        message,
        conversationLength: conversationHistory.length
      },
      output: {
        response: aiResponse
      }
    });

    return {
      response: aiResponse,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error handling chat message:', error);
    throw new Error('Failed to process chat message');
  }
};

export default {
  getModel,
  generateRecommendations,
  handleChatMessage
};
