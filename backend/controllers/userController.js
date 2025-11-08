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
    const user = await userService.getUserByAuth0Id(req.user.auth0Id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Error in updateCurrentUser:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_USER_ERROR',
        message: 'Failed to update user profile'
      }
    });
  }
};
