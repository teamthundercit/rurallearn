import { GoogleGenerativeAI } from '@google/generative-ai';
import AIInteraction from '../models/AIInteraction.js';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get Gemini AI model instance
 * @param {string} modelName - Model name (default: gemini-pro)
 * @returns {Object} Gemini model instance
 */
export const getModel = (modelName = 'gemini-pro') => {
  return genAI.getGenerativeModel({ model: modelName });
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
    const prompt = `You are an educational AI assistant for RuralLearn, a platform helping students in rural areas.

User Profile:
- Name: ${user.name}
- Role: ${user.role}
- Completed Lessons: ${completedLessons.length}
- Average Quiz Score: ${averageScore.toFixed(1)}%

Recent Progress:
${completedLessons.slice(-5).map(p => `- Lesson: ${p.lessonId.title || 'Unknown'}, Score: ${p.quizScore || 0}%`).join('\n')}

Available Lessons:
${availableLessons.slice(0, 10).map((lesson, idx) => 
  `${idx + 1}. ${lesson.title} (${lesson.difficulty}) - ${lesson.description || 'No description'}`
).join('\n')}

Based on the user's progress and performance, recommend 3-5 lessons from the available lessons that would be most beneficial for their learning journey. Consider:
1. Their current skill level based on quiz scores
2. Logical progression from completed lessons
3. Difficulty level appropriate for their performance
4. Variety in topics to maintain engagement

Provide your response in the following JSON format:
{
  "recommendations": [
    {
      "lessonTitle": "exact lesson title from the list",
      "reason": "brief explanation why this lesson is recommended",
      "priority": "high/medium/low"
    }
  ],
  "overallGuidance": "brief personalized message for the student"
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
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations');
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
