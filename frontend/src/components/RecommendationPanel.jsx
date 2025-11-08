import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <motion.div 
        className="glass-neon-violet p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-neon-violet"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-3xl">🤖</span>
          </motion.div>
          <h3 className="text-2xl font-display font-bold text-white">
            AI Recommendations
          </h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
          <p className="ml-4 text-white font-medium">Generating personalized recommendations...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="glass-neon-violet p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-neon-violet"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-3xl">🤖</span>
          </motion.div>
          <h3 className="text-2xl font-display font-bold text-white">
            AI Recommendations
          </h3>
        </div>
        <div className="glass p-4 border-l-4 border-red-500">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!recommendations || !recommendations.recommendations || recommendations.recommendations.length === 0) {
    return (
      <motion.div 
        className="glass-neon-violet p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-neon-violet"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-3xl">🤖</span>
          </motion.div>
          <h3 className="text-2xl font-display font-bold text-white">
            AI Recommendations
          </h3>
        </div>
        <p className="text-white/80">No recommendations available at this time.</p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Adaptive Learning Insights */}
      {recommendations.adaptiveInsights && (
        <AdaptiveLearningInsights insights={recommendations.adaptiveInsights} />
      )}

      <motion.div 
        className="glass-neon-violet p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-neon-violet"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 40px rgba(168, 85, 247, 0.8)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-3xl">🤖</span>
          </motion.div>
          <div>
            <h3 className="text-2xl font-display font-bold text-gradient-animate">
              AI Recommendations
            </h3>
            <p className="text-sm text-white/70">Powered by TensorFlow & Gemini AI</p>
          </div>
        </div>

      {/* Overall Guidance */}
      {recommendations.overallGuidance && (
        <div className="glass p-4 mb-6 border-l-4 border-violet-400">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-white font-medium leading-relaxed flex-1">
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
            className="glass p-4 hover-lift group border-l-4 border-transparent hover:border-violet-400 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-bold text-white flex-1 group-hover:text-gradient transition-all">
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
            <p className="text-sm text-white/80 leading-relaxed mb-3">
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
      </motion.div>
    </>
  );
};

export default RecommendationPanel;
