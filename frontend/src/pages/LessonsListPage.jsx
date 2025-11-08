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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modern Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all group"
            >
              <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎓</span>
              </div>
              <h1 className="text-2xl font-display font-black text-gradient">RuralLearn</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-down">
          <h2 className="text-4xl sm:text-5xl font-display font-black mb-3">
            <span className="text-gradient-animate">Browse Lessons</span>
            <span className="inline-block animate-bounce-slow ml-2">📚</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Discover your next learning adventure
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

        {/* Modern Filters */}
        <div className="card-gradient p-6 mb-8 animate-scale-in">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-xl font-display font-bold text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="input-modern"
              >
                <option value="">All Levels</option>
                <option value="beginner">🌱 Beginner</option>
                <option value="intermediate">🌿 Intermediate</option>
                <option value="advanced">🌳 Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Tags
              </label>
              <input
                type="text"
                value={filters.tags}
                onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                placeholder="e.g., programming, math..."
                className="input-modern"
              />
            </div>
          </div>
        </div>

        {/* Lessons Grid with Modern Cards */}
        {lessons.length === 0 ? (
          <div className="card-gradient text-center py-16">
            <span className="text-6xl mb-4 block">📚</span>
            <p className="text-gray-600 text-lg font-medium">No lessons available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                onClick={() => handleLessonClick(lesson._id)}
                className="card-gradient hover-lift cursor-pointer group overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {lesson.difficulty && (
                      <span className={`badge ${
                        lesson.difficulty === 'beginner' ? 'bg-success-100 text-success-800 border-success-200' :
                        lesson.difficulty === 'intermediate' ? 'bg-accent-100 text-accent-800 border-accent-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🌿' : '🌳'}
                        {' '}{lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                      </span>
                    )}
                    {lesson.content?.type && (
                      <span className="badge badge-primary">
                        {lesson.content.type === 'video' ? '🎥 Video' :
                         lesson.content.type === 'mixed' ? '📚 Mixed' : '📄 Text'}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all">
                    {lesson.title}
                  </h3>
                  
                  {lesson.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {lesson.description}
                    </p>
                  )}
                  
                  {lesson.tags && lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                      {lesson.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-700">
                          +{lesson.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    className="btn-primary w-full group/btn"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Start Lesson
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
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
