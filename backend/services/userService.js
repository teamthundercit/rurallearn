import User from '../models/User.js';

/**
 * Create or update user from Auth0 data
 */
export const createOrUpdateUser = async (userData) => {
  try {
    const { auth0Id, email, name, role, avatar } = userData;

    // Check if user exists
    let user = await User.findOne({ auth0Id });

    if (user) {
      // Update existing user
      user.email = email || user.email;
      user.name = name || user.name;
      user.role = role || user.role;
      if (avatar) user.avatar = avatar;
      
      await user.save();
    } else {
      // Create new user
      user = new User({
        auth0Id,
        email,
        name,
        role: role || 'student',
        avatar
      });
      
      await user.save();
    }

    return user;
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw error;
  }
};

/**
 * Get user profile by Auth0 ID
 */
export const getUserProfile = async (auth0Id) => {
  try {
    const user = await User.findOne({ auth0Id });
    if (!user) {
      const error = new Error('User not found');
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

/**
 * Get user by Auth0 ID (alias for backward compatibility)
 */
export const getUserByAuth0Id = async (auth0Id) => {
  try {
    const user = await User.findOne({ auth0Id });
    return user;
  } catch (error) {
    console.error('Error in getUserByAuth0Id:', error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (auth0Id, updates) => {
  try {
    const allowedUpdates = ['name', 'avatar', 'preferences'];
    const filteredUpdates = {};
    
    // Only allow specific fields to be updated
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const user = await User.findOneAndUpdate(
      { auth0Id },
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

/**
 * Update user preferences (onboarding)
 */
export const updateUserPreferences = async (auth0Id, preferences) => {
  try {
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      throw new Error('User not found');
    }

    user.preferences = {
      ...user.preferences,
      ...preferences,
      onboardingCompleted: true,
      completedAt: new Date()
    };

    await user.save();
    return user;
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    throw error;
  }
};
