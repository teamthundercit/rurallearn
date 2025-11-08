import axios from 'axios';
import { cacheLesson, getCachedLesson, queueProgressUpdate } from '../utils/indexedDB';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      
      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - token might be expired
        console.error('Authentication error. Please log in again.');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// User API functions
export const getUserProfile = async (token) => {
  try {
    const response = await api.get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch user profile');
  }
};

// Progress API functions
export const getUserProgress = async (token) => {
  try {
    const response = await api.get('/api/progress', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch user progress');
  }
};

// Lesson API functions
export const getLessons = async (token, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.tags) params.append('tags', filters.tags);
    
    const response = await api.get(`/api/lessons?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch lessons');
  }
};

export const getLessonById = async (token, lessonId) => {
  try {
    const response = await api.get(`/api/lessons/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Cache the lesson for offline access
    if (response.data && response.data.lesson) {
      try {
        await cacheLesson(response.data.lesson);
      } catch (cacheError) {
        console.warn('Failed to cache lesson:', cacheError);
        // Continue even if caching fails
      }
    }
    
    return response.data;
  } catch (error) {
    // If network fails, try to get from cache
    if (!navigator.onLine || error.message.includes('Network')) {
      console.log('Network unavailable, attempting to retrieve from cache...');
      try {
        const cachedLesson = await getCachedLesson(lessonId);
        if (cachedLesson) {
          console.log('Serving lesson from cache');
          return { lesson: cachedLesson, fromCache: true };
        }
      } catch (cacheError) {
        console.error('Failed to retrieve from cache:', cacheError);
      }
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch lesson');
  }
};

// Quiz submission API function
export const submitQuiz = async (token, lessonId, answers) => {
  try {
    const response = await api.post(`/api/progress/quiz/${lessonId}`, 
      { answers },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    // If offline, queue the submission
    if (!navigator.onLine || error.message.includes('Network')) {
      console.log('Offline: Queuing quiz submission');
      try {
        await queueProgressUpdate({
          type: 'quizSubmission',
          lessonId,
          answers
        });
        return { 
          success: true, 
          queued: true, 
          message: 'Quiz submission queued for sync when online' 
        };
      } catch (queueError) {
        console.error('Failed to queue quiz submission:', queueError);
      }
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to submit quiz');
  }
};

// Record lesson completion
export const recordLessonCompletion = async (token, lessonId, timeSpent = 0) => {
  try {
    const response = await api.post(`/api/progress/lesson/${lessonId}`,
      { timeSpent },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    // If offline, queue the completion
    if (!navigator.onLine || error.message.includes('Network')) {
      console.log('Offline: Queuing lesson completion');
      try {
        await queueProgressUpdate({
          type: 'lessonCompletion',
          lessonId,
          timeSpent
        });
        return { 
          success: true, 
          queued: true, 
          message: 'Lesson completion queued for sync when online' 
        };
      } catch (queueError) {
        console.error('Failed to queue lesson completion:', queueError);
      }
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to record lesson completion');
  }
};

// AI API functions
export const getRecommendations = async (token) => {
  try {
    const response = await api.post('/api/ai/recommendations', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch recommendations');
  }
};

export const sendChatMessage = async (token, message, conversationHistory = []) => {
  try {
    const response = await api.post('/api/ai/chat',
      { message, conversationHistory },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to send chat message');
  }
};

export default api;
