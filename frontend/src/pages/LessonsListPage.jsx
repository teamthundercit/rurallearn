import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getLessons, getRecommendations } from '../services/api';

const LessonsListPage = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  
  const [lessons, setLessons] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    tags: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        // Fetch lessons and recommendations in parallel
        const [lessonsResponse, recommendationsResponse] = await Promise.all([
          getLessons(token, filters),
          getRecommendations(token).catch(() => null) // Don't fail if recommendations fail
        ]);

        setLessons(lessonsResponse.data?.lessons || lessonsResponse.lessons || []);
        if (recommendationsResponse) {
          setRecommendations(recommendationsResponse.data);
        }
      } catch (err) {
        console.error('Error loading lessons:', err);
        setError(err.message || 'Failed to load lessons. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAccessTokenSilently, filters]);

  const handleLessonClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl mr-2">←</span>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-2xl font-bold text-primary-600">RuralLearn</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Lessons
          </h2>
          <p className="text-gray-600">
            Choose a lesson to start learning
          </p>
        </div>

        {/* AI Recommendations Section */}
        {recommendations && recommendations.recommendations && recommendations.recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg shadow-md p-6 mb-8 border border-primary-200">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🤖</span>
              <h3 className="text-xl font-semibold text-gray-900">
                Recommended for You
              </h3>
            </div>
            
            {recommendations.overallGuidance && (
              <p className="text-gray-700 mb-4 italic">
                "{recommendations.overallGuidance}"
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.recommendations.slice(0, 3).map((rec, index) => {
                const lesson = lessons.find(l => l.title === rec.lessonTitle);
                if (!lesson) return null;

                return (
                  <div
                    key={index}
                    onClick={() => handleLessonClick(lesson._id)}
                    className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-primary-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                      {lesson.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lesson.difficulty}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {rec.lessonTitle}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {rec.reason}
                    </p>
                    <button className="w-full bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                      Start Learning
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                placeholder="Enter tags (comma-separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No lessons available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                onClick={() => handleLessonClick(lesson._id)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    {lesson.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                      </span>
                    )}
                    {lesson.content?.type && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lesson.content.type === 'video' ? '🎥 Video' :
                         lesson.content.type === 'mixed' ? '📚 Mixed' : '📄 Text'}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {lesson.title}
                  </h3>
                  
                  {lesson.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {lesson.description}
                    </p>
                  )}
                  
                  {lesson.tags && lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {lesson.tags.length > 3 && (
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          +{lesson.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Start Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonsListPage;
