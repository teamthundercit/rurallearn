import * as userService from '../services/userService.js';

/**
 * Handle Auth0 callback - create or update user
 */
export const handleAuthCallback = async (req, res) => {
  try {
    const { auth0Id, email, name, role, avatar } = req.user;

    const user = await userService.createOrUpdateUser({
      auth0Id,
      email,
      name,
      role,
      avatar
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          gamification: {
            streak: {
              current: user.gamification?.streak?.current || 0,
              longest: user.gamification?.streak?.longest || 0,
              lastActivityDate: user.gamification?.streak?.lastActivityDate || null
            },
            badges: user.gamification?.badges || [],
            totalPoints: user.gamification?.totalPoints || 0,
            weeklyGoal: user.gamification?.weeklyGoal || 3,
            monthlyGoal: user.gamification?.monthlyGoal || 12
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error in handleAuthCallback:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_CALLBACK_ERROR',
        message: 'Failed to process authentication callback'
      }
    });
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.auth0Id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          gamification: {
            streak: {
              current: user.gamification?.streak?.current || 0,
              longest: user.gamification?.streak?.longest || 0,
              lastActivityDate: user.gamification?.streak?.lastActivityDate || null
            },
            badges: user.gamification?.badges || [],
            totalPoints: user.gamification?.totalPoints || 0,
            weeklyGoal: user.gamification?.weeklyGoal || 3,
            monthlyGoal: user.gamification?.monthlyGoal || 12
          },
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    
    if (error.code === 'USER_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_USER_ERROR',
        message: 'Failed to retrieve user profile'
      }
    });
  }
};

/**
 * Update current user profile
 */
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Input validation
    const errors = [];
    
    if (name !== undefined) {
      if (typeof name !== 'string') {
        errors.push('Name must be a string');
      } else if (name.trim().length === 0) {
        errors.push('Name cannot be empty');
      } else if (name.length > 100) {
        errors.push('Name must be less than 100 characters');
      }
    }
    
    if (avatar !== undefined && avatar !== null) {
      if (typeof avatar !== 'string') {
        errors.push('Avatar must be a string URL');
      } else if (avatar.length > 500) {
        errors.push('Avatar URL must be less than 500 characters');
      }
      // Basic URL validation
      else if (avatar.trim().length > 0 && !avatar.match(/^https?:\/\/.+/)) {
        errors.push('Avatar must be a valid URL starting with http:// or https://');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
    }

    const user = await userService.updateUserProfile(req.user.auth0Id, {
      name,
      avatar
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error in updateCurrentUser:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: Object.values(error.errors).map(err => err.message)
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_USER_ERROR',
        message: 'Failed to update user profile'
      }
    });
  }
};

/**
 * Update user preferences (onboarding or partial updates)
 */
export const updateUserPreferences = async (req, res) => {
  try {
    const { learningGoals, difficultyLevel, topicsOfInterest, language } = req.body;

    // Build update object with only provided fields
    const updates = {};
    const errors = [];
    
    // Validate learningGoals if provided
    if (learningGoals !== undefined) {
      if (!Array.isArray(learningGoals) || learningGoals.length === 0) {
        errors.push('Learning goals must be a non-empty array');
      } else {
        updates.learningGoals = learningGoals;
      }
    }
    
    // Validate difficultyLevel if provided
    if (difficultyLevel !== undefined) {
      if (!['beginner', 'intermediate', 'advanced'].includes(difficultyLevel)) {
        errors.push('Difficulty level must be one of: beginner, intermediate, advanced');
      } else {
        updates.difficultyLevel = difficultyLevel;
      }
    }
    
    // Validate topicsOfInterest if provided
    if (topicsOfInterest !== undefined) {
      if (!Array.isArray(topicsOfInterest) || topicsOfInterest.length === 0) {
        errors.push('Topics of interest must be a non-empty array');
      } else {
        updates.topicsOfInterest = topicsOfInterest;
      }
    }
    
    // Validate language if provided
    if (language !== undefined) {
      const supportedLanguages = ['en', 'hi', 'es', 'fr', 'sw', 'pt', 'ar', 'bn'];
      if (!supportedLanguages.includes(language)) {
        errors.push(`Language must be one of: ${supportedLanguages.join(', ')}`);
      } else {
        updates.language = language;
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors
        }
      });
    }
    
    // Check if at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_UPDATES',
          message: 'No valid fields provided for update'
        }
      });
    }

    const user = await userService.updateUserPreferences(req.user.auth0Id, updates);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          auth0Id: user.auth0Id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      message: 'Preferences saved successfully'
    });
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_PREFERENCES_ERROR',
        message: 'Failed to update user preferences'
      }
    });
  }
};
