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
 * Get user by Auth0 ID
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
    const allowedUpdates = ['name', 'avatar'];
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
