import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, getLessons } from '../services/api';
import AdaptiveLearningInsights from './AdaptiveLearningInsights';

const RecommendationPanel = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        // Fetch recommendations and lessons in parallel
        const [recommendationsResponse, lessonsResponse] = await Promise.all([
          getRecommendations(token),
          getLessons(token)
        ]);

        setRecommendations(recommendationsResponse.data);
        setLessons(lessonsResponse.data?.lessons || lessonsResponse.lessons || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [getAccessTokenSilently]);

  const handleLessonClick = (lessonTitle) => {
    // Find the lesson by title
    const lesson = lessons.find(l => l.title === lessonTitle);
    if (lesson) {
      navigate(`/lessons/${lesson._id}`);
    }
  };

  if (loading) {
    return (
      <div className="card-gradient animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center animate-pulse">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-gray-900">
            AI Recommendations
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="ml-4 text-gray-600 font-medium">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-gradient animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-gray-900">
            AI Recommendations
          </h3>
        </div>
        <div className="glass p-4 border-l-4 border-red-500">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations || !recommendations.recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className="card-gradient animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-2xl font-display font-bold text-gray-900">
            AI Recommendations
          </h3>
        </div>
        <p className="text-gray-600">No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <>
      {/* Adaptive Learning Insights */}
      {recommendations.adaptiveInsights && (
        <AdaptiveLearningInsights insights={recommendations.adaptiveInsights} />
      )}

      <div className="card-gradient animate-scale-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900">
              AI Recommendations
            </h3>
            <p className="text-sm text-gray-600">Powered by TensorFlow & Gemini AI</p>
          </div>
        </div>

      {/* Overall Guidance */}
      {recommendations.overallGuidance && (
        <div className="glass p-4 mb-6 border-l-4 border-primary-500">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-gray-800 font-medium leading-relaxed flex-1">
              {recommendations.overallGuidance}
            </p>
          </div>
        </div>
      )}

      {/* Recommended Lessons */}
      <div className="space-y-3">
        {recommendations.recommendations.map((rec, index) => (
          <div
            key={index}
            className="glass p-4 hover-lift group border-l-4 border-transparent hover:border-primary-500 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-bold text-gray-900 flex-1 group-hover:text-gradient transition-all">
                {rec.lessonTitle}
              </h4>
              {rec.priority && (
                <span className={`badge ${
                  rec.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                  rec.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {rec.priority}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              {rec.reason}
            </p>
            <button
              onClick={() => handleLessonClick(rec.lessonTitle)}
              className="btn-primary w-full text-sm py-2"
            >
              <span className="flex items-center justify-center gap-2">
                Start Learning Now
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default RecommendationPanel;
