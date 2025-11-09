import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';
import { getLessons, getRecommendations } from '../services/api';
import AttractiveSpinner from '../components/AttractiveSpinner';

const LessonsListPage = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();
  
  const [lessons, setLessons] = useState([]);
  const [allLessons, setAllLessons] = useState([]); // Store all lessons for tag extraction
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    tags: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Fetch all lessons once for tag extraction
  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }
        });

        const response = await getLessons(token, {});
        setAllLessons(response.data?.lessons || response.lessons || []);
      } catch (err) {
        console.error('Error loading all lessons:', err);
      }
    };

    fetchAllLessons();
  }, [getAccessTokenSilently]);

  // Debounced fetch with filters
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

        const fetchedLessons = lessonsResponse.data?.lessons || lessonsResponse.lessons || [];
        console.log('Fetched lessons with filters:', filters, 'Count:', fetchedLessons.length);
        setLessons(fetchedLessons);
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

    // Debounce the search
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [getAccessTokenSilently, filters]);

  // Extract all unique tags from lessons
  const allTags = useMemo(() => {
    const tagSet = new Set();
    allLessons.forEach(lesson => {
      if (lesson.tags && Array.isArray(lesson.tags)) {
        lesson.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
      }
    });
    return Array.from(tagSet).sort();
  }, [allLessons]);

  // Filter tags based on input
  const suggestedTags = useMemo(() => {
    if (!tagInput.trim()) return allTags.slice(0, 8);
    
    const input = tagInput.toLowerCase().trim();
    return allTags
      .filter(tag => tag.includes(input))
      .slice(0, 8);
  }, [tagInput, allTags]);

  const handleTagSelect = (tag) => {
    console.log('Tag selected:', tag);
    setTagInput(tag);
    setFilters({ ...filters, tags: tag });
    setShowTagSuggestions(false);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    setShowTagSuggestions(true);
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setFilters({ ...filters, tags: tagInput.trim() });
      setShowTagSuggestions(false);
    }
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/lessons/${lessonId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <AttractiveSpinner size="lg" text={t('dashboard.loadingLessons')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-900">
        <div className="text-center p-8 glass-neon-blue rounded-xl border border-white/10 max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
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
    <div className="min-h-screen bg-midnight-900">
      {/* Modern Header */}
      <header className="sticky-glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-all group"
            >
              <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">{t('dashboard.backToDashboard')}</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎓</span>
              </div>
              <h1 className="text-2xl font-display font-black text-neon-animate">EduAdapt</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-slide-down">
          <h2 className="text-4xl sm:text-5xl font-display font-black mb-3">
            <span className="text-white">{t('dashboard.browseLessons')}</span>
            <span className="inline-block animate-bounce-slow ml-2">📚</span>
          </h2>
          <p className="text-gray-400 text-lg">
            {t('lessons.browse')}
          </p>
        </div>

        {/* AI Recommendations Section */}
        {recommendations && recommendations.recommendations && recommendations.recommendations.length > 0 && (
          <div className="glass-neon-blue rounded-xl p-6 mb-8 border border-white/10">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🤖</span>
              <h3 className="text-xl font-semibold text-white">
                Recommended for You
              </h3>
            </div>
            
            {recommendations.overallGuidance && (
              <p className="text-gray-300 mb-4 italic">
                "{recommendations.overallGuidance}"
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.recommendations.slice(0, 3).map((rec, index) => {
                // Try to find lesson in both filtered lessons and all lessons
                const lesson = lessons.find(l => l.title === rec.lessonTitle) || 
                              allLessons.find(l => l.title === rec.lessonTitle);
                
                if (!lesson) {
                  console.log('Lesson not found for recommendation:', rec.lessonTitle);
                  return null;
                }

                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {rec.priority} priority
                      </span>
                      {lesson.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lesson.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                          lesson.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {lesson.difficulty}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white mb-2">
                      {rec.lessonTitle}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      {rec.reason}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Navigating to lesson:', lesson._id);
                        handleLessonClick(lesson._id);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm font-medium"
                    >
                      Start Learning
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modern Filters */}
        <div className="glass-neon-blue p-6 mb-8 animate-scale-in border border-white/10 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-xl font-display font-bold text-white">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/5 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
              >
                <option value="" className="bg-midnight-800 text-white">All Levels</option>
                <option value="beginner" className="bg-midnight-800 text-white">🌱 Beginner</option>
                <option value="intermediate" className="bg-midnight-800 text-white">🌿 Intermediate</option>
                <option value="advanced" className="bg-midnight-800 text-white">🌳 Advanced</option>
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Search Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleTagInputKeyPress}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                  placeholder="e.g., programming, math..."
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-white/20 bg-white/5 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300"
                />
                <button
                  onClick={() => {
                    if (tagInput.trim()) {
                      setFilters({ ...filters, tags: tagInput.trim() });
                      setShowTagSuggestions(false);
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
                >
                  Search
                </button>
              </div>
              
              {/* Tag Suggestions Dropdown */}
              {showTagSuggestions && suggestedTags.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-midnight-800 rounded-lg shadow-lg border border-white/20 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs text-gray-400 mb-2 px-2">
                      {tagInput.trim() ? 'Matching tags' : 'Popular tags'}
                    </p>
                    {suggestedTags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleTagSelect(tag)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-500/20 hover:text-blue-300 transition-colors text-sm flex items-center gap-2 text-gray-300"
                      >
                        <span className="text-gray-500">#</span>
                        <span className="font-medium">{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected Tag Display */}
              {filters.tags && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    #{filters.tags}
                    <button
                      onClick={() => {
                        setTagInput('');
                        setFilters({ ...filters, tags: '' });
                      }}
                      className="ml-1 hover:text-blue-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lessons Grid with Modern Cards */}
        {lessons.length === 0 ? (
          <div className="glass-neon-blue text-center py-16 rounded-xl border border-white/10">
            <span className="text-6xl mb-4 block">📚</span>
            <p className="text-gray-300 text-lg font-medium mb-4">
              {filters.tags || filters.difficulty 
                ? 'No lessons match your filters' 
                : 'No lessons available'}
            </p>
            {(filters.tags || filters.difficulty) && (
              <button
                onClick={() => {
                  setFilters({ difficulty: '', tags: '' });
                  setTagInput('');
                }}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                onClick={() => handleLessonClick(lesson._id)}
                className="glass-neon-blue hover-lift cursor-pointer group overflow-hidden border border-white/10 rounded-xl"
              >
                <div className="p-6">
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {lesson.difficulty && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lesson.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                        lesson.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {lesson.difficulty === 'beginner' ? '🌱' : lesson.difficulty === 'intermediate' ? '🌿' : '🌳'}
                        {' '}{lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                      </span>
                    )}
                    {lesson.content?.type && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                        {lesson.content.type === 'video' ? '🎥 Video' :
                         lesson.content.type === 'mixed' ? '📚 Mixed' : '📄 Text'}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-all">
                    {lesson.title}
                  </h3>
                  
                  {lesson.description && (
                    <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {lesson.description}
                    </p>
                  )}
                  
                  {lesson.tags && lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {lesson.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-lg text-xs bg-white/5 text-gray-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                      {lesson.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-gray-400">
                          +{lesson.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg font-medium group/btn"
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
