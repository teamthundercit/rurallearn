import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ lastLesson, failedQuizzes, recommendations }) => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'resume',
      title: 'Resume Learning',
      description: lastLesson ? `Continue: ${lastLesson.title}` : 'Start a new lesson',
      icon: '▶️',
      color: 'from-primary-500 to-primary-600',
      action: () => lastLesson ? navigate(`/lesson/${lastLesson._id}`) : navigate('/lessons')
    },
    {
      id: 'browse',
      title: 'Browse Lessons',
      description: 'Explore all available content',
      icon: '📚',
      color: 'from-secondary-500 to-secondary-600',
      action: () => navigate('/lessons')
    },
    {
      id: 'retake',
      title: 'Retake Quiz',
      description: failedQuizzes?.length > 0 ? `${failedQuizzes.length} quiz(es) to retry` : 'No failed quizzes',
      icon: '🔄',
      color: 'from-accent-500 to-accent-600',
      disabled: !failedQuizzes || failedQuizzes.length === 0,
      action: () => failedQuizzes?.[0] && navigate(`/lesson/${failedQuizzes[0]._id}`)
    },
    {
      id: 'recommended',
      title: 'AI Recommended',
      description: recommendations?.length > 0 ? `Try: ${recommendations[0]?.lessonTitle}` : 'Get recommendations',
      icon: '🤖',
      color: 'from-green-500 to-green-600',
      action: () => navigate('/lessons')
    }
  ];

  return (
    <div className="card-gradient p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-glow">
          <span className="text-2xl">⚡</span>
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-600">Jump right into learning</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            disabled={action.disabled}
            className={`p-4 rounded-xl text-left transition-all duration-300 group ${
              action.disabled
                ? 'bg-gray-100 cursor-not-allowed opacity-50'
                : 'glass hover-lift cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-md ${
                !action.disabled && 'group-hover:scale-110'
              } transition-transform`}>
                <span className="text-lg">{action.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-gray-900 mb-1 ${
                  !action.disabled && 'group-hover:text-gradient'
                } transition-all`}>
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {action.description}
                </p>
              </div>
              {!action.disabled && (
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
