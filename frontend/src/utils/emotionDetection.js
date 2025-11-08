import * as faceapi from 'face-api.js';

let modelsLoaded = false;

/**
 * Load face-api.js models
 */
export const loadModels = async () => {
  if (modelsLoaded) return true;

  try {
    const MODEL_URL = '/models'; // Models will be in public/models folder
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
    
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    return false;
  }
};

/**
 * Detect emotion from image
 * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement} input
 * @returns {Promise<Object>} Emotion detection result
 */
export const detectEmotion = async (input) => {
  try {
    if (!modelsLoaded) {
      await loadModels();
    }

    const detection = await faceapi
      .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) {
      return {
        success: false,
        error: 'No face detected',
        message: 'Please ensure your face is clearly visible'
      };
    }

    const expressions = detection.expressions;
    
    // Get dominant emotion
    const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
      expressions[a] > expressions[b] ? a : b
    );

    // Categorize emotions
    const emotionCategory = categorizeEmotion(dominantEmotion, expressions);

    return {
      success: true,
      dominantEmotion,
      confidence: expressions[dominantEmotion],
      allExpressions: expressions,
      category: emotionCategory,
      readyToLearn: emotionCategory === 'positive' || emotionCategory === 'neutral'
    };
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to detect emotion. Please try again.'
    };
  }
};

/**
 * Categorize emotion into positive, neutral, or negative
 */
const categorizeEmotion = (dominantEmotion, expressions) => {
  // Positive emotions
  if (dominantEmotion === 'happy') {
    return 'positive';
  }

  // Neutral emotions
  if (dominantEmotion === 'neutral' || dominantEmotion === 'surprised') {
    return 'neutral';
  }

  // Negative emotions (need refresh)
  if (['sad', 'angry', 'disgusted', 'fearful'].includes(dominantEmotion)) {
    return 'negative';
  }

  // Default to neutral if unsure
  return 'neutral';
};

/**
 * Get emotion message for user
 */
export const getEmotionMessage = (category, dominantEmotion) => {
  const messages = {
    positive: {
      title: "You're Ready to Learn! 🌟",
      message: "Great energy! Let's make the most of this learning session.",
      icon: "😊"
    },
    neutral: {
      title: "Ready When You Are! 👍",
      message: "You seem focused. Let's dive into learning!",
      icon: "😐"
    },
    negative: {
      title: "Let's Take a Quick Break 🌈",
      message: `You seem ${dominantEmotion}. A short refresh will help you learn better!`,
      icon: "😔"
    }
  };

  return messages[category] || messages.neutral;
};

/**
 * Check if browser supports camera
 */
export const isCameraSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

/**
 * Request camera permission
 */
export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    return { success: true, stream };
  } catch (error) {
    console.error('Camera permission denied:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Camera access is required for mood detection'
    };
  }
};

export default {
  loadModels,
  detectEmotion,
  getEmotionMessage,
  isCameraSupported,
  requestCameraPermission
};
