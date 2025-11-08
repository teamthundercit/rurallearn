import Lesson from '../models/Lesson.js';

/**
 * Get lessons with filtering and pagination
 */
export const getLessons = async (filters = {}, options = {}) => {
  try {
    const { difficulty, tags, page = 1, limit = 10 } = { ...filters, ...options };
    
    // Build query
    const query = {};
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (tags) {
      // Support both single tag and array of tags with case-insensitive matching
      const tagArray = Array.isArray(tags) ? tags : [tags];
      // Use regex for case-insensitive partial matching
      query.tags = { 
        $in: tagArray.map(tag => new RegExp(tag, 'i'))
      };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const lessons = await Lesson.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    // Get total count for pagination metadata
    const total = await Lesson.countDocuments(query);
    
    return {
      lessons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getLessons:', error);
    throw error;
  }
};

/**
 * Get lesson by ID
 */
export const getLessonById = async (lessonId) => {
  try {
    const lesson = await Lesson.findById(lessonId).select('-__v');
    
    if (!lesson) {
      const error = new Error('Lesson not found');
      error.code = 'LESSON_NOT_FOUND';
      throw error;
    }
    
    return lesson;
  } catch (error) {
    console.error('Error in getLessonById:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      const castError = new Error('Invalid lesson ID format');
      castError.code = 'INVALID_LESSON_ID';
      throw castError;
    }
    
    throw error;
  }
};
