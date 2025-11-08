import * as aiService from '../services/aiService.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Lesson from '../models/Lesson.js';

/**
 * Generate personalized lesson recommendations
 * POST /api/ai/recommendations
 */
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.auth.payload.sub;

    // Fetch user data
    const user = await User.findOne({ auth0Id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Fetch user's progress data with populated lesson details
    const progressData = await Progress.find({ userId: user._id })
      .populate('lessonId')
      .sort({ lastAccessedAt: -1 });

    // Fetch all available lessons
    const allLessons = await Lesson.find({});

    // Generate recommendations using Gemini AI
    const recommendations = await aiService.generateRecommendations(
      user,
      progressData,
      allLessons
    );

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    
    // Handle specific Gemini API errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'AI_API_KEY_ERROR',
          message: 'AI service configuration error'
        }
      });
    }

    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'AI_RATE_LIMIT',
          message: 'AI service temporarily unavailable. Please try again later.'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'AI_SERVICE_ERROR',
        message: 'Failed to generate recommendations'
      }
    });
  }
};

/**
 * Handle chatbot conversation
 * POST /api/ai/chat
 */
export const handleChat = async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Message is required and must be a non-empty string'
        }
      });
    }

    // Fetch user data
    const user = await User.findOne({ auth0Id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Handle chat message with Gemini AI
    const aiResponse = await aiService.handleChatMessage(
      user,
      message.trim(),
      conversationHistory || []
    );

    res.json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    console.error('Error in handleChat:', error);

    // Handle specific Gemini API errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'AI_API_KEY_ERROR',
          message: 'AI service configuration error'
        }
      });
    }

    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'AI_RATE_LIMIT',
          message: 'AI service temporarily unavailable. Please try again later.'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'AI_SERVICE_ERROR',
        message: 'Failed to process chat message'
      }
    });
  }
};

export default {
  getRecommendations,
  handleChat
};
