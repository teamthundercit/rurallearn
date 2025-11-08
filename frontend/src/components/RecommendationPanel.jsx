import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, getLessons } from '../services/api';

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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI Recommendations
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="ml-3 text-gray-600">Generating personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI Recommendations
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!recommendations || !recommendations.recommendations || recommendations.recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI Recommendations
        </h3>
        <p className="text-gray-600">No recommendations available at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🤖</span>
        AI Recommendations
      </h3>

      {/* Overall Guidance */}
      {recommendations.overallGuidance && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
          <p className="text-primary-900 text-sm leading-relaxed">
            {recommendations.overallGuidance}
          </p>
        </div>
      )}

      {/* Recommended Lessons */}
      <div className="space-y-3">
        {recommendations.recommendations.map((rec, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleLessonClick(rec.lessonTitle)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900 flex-1">
                {rec.lessonTitle}
              </h4>
              {rec.priority && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                  {rec.priority}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {rec.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;
