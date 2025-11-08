import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import useApi from '../utils/useApi';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const api = useApi();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    learningGoals: [],
    difficultyLevel: '',
    topicsOfInterest: []
  });

  const learningGoalOptions = [
    { id: 'career', label: 'Advance my career', icon: '💼' },
    { id: 'skills', label: 'Learn new skills', icon: '🎯' },
    { id: 'education', label: 'Support my education', icon: '📚' },
    { id: 'hobby', label: 'Personal interest/hobby', icon: '🌟' },
    { id: 'business', label: 'Start or grow a business', icon: '🚀' }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'I\'m new to most topics', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', description: 'I have some experience', icon: '🌿' },
    { value: 'advanced', label: 'Advanced', description: 'I\'m experienced and want challenges', icon: '🌳' }
  ];

  const topicOptions = [
    { id: 'agriculture', label: 'Agriculture & Farming', icon: '🌾' },
    { id: 'technology', label: 'Technology & Computers', icon: '💻' },
    { id: 'business', label: 'Business & Entrepreneurship', icon: '💼' },
    { id: 'health', label: 'Health & Wellness', icon: '🏥' },
    { id: 'language', label: 'Language Learning', icon: '🗣️' },
    { id: 'math', label: 'Mathematics', icon: '🔢' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'arts', label: 'Arts & Crafts', icon: '🎨' }
  ];

  const toggleArrayItem = (array, item) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleGoalToggle = (goalId) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: toggleArrayItem(prev.learningGoals, goalId)
    }));
  };

  const handleDifficultySelect = (level) => {
    setFormData(prev => ({
      ...prev,
      difficultyLevel: level
    }));
  };

  const handleTopicToggle = (topicId) => {
    setFormData(prev => ({
      ...prev,
      topicsOfInterest: toggleArrayItem(prev.topicsOfInterest, topicId)
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.learningGoals.length > 0;
      case 2:
        return formData.difficultyLevel !== '';
      case 3:
        return formData.topicsOfInterest.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: 'openid profile email'
        }
      });

      await api.post('/api/users/me/preferences', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err.response?.data?.error?.message || 'Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Welcome to EduAdapt! 🎓</h1>
          <p className="text-gray-600">Let's personalize your learning experience</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step === currentStep 
                  ? 'bg-primary-600 text-white' 
                  : step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {step < currentStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Learning Goals */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are your learning goals?</h2>
              <p className="text-gray-600">Select all that apply</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningGoalOptions.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.learningGoals.includes(goal.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{goal.icon}</span>
                    <span className="font-medium text-gray-900">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Difficulty Level */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your experience level?</h2>
              <p className="text-gray-600">Choose the level that best describes you</p>
            </div>
            
            <div className="space-y-4">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDifficultySelect(option.value)}
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    formData.difficultyLevel === option.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-4xl">{option.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{option.label}</h3>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Topics of Interest */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What topics interest you?</h2>
              <p className="text-gray-600">Select at least one topic</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topicOptions.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicToggle(topic.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.topicsOfInterest.includes(topic.id)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{topic.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{topic.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !canProceed() || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </span>
            ) : currentStep === 3 ? (
              'Complete Setup'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
