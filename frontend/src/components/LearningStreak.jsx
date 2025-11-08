import React from 'react';

const LearningStreak = ({ streak }) => {
  if (!streak) return null;

  const { current, longest } = streak;

  const getStreakColor = (days) => {
    if (days >= 30) return 'from-red-500 to-orange-500';
    if (days >= 7) return 'from-orange-500 to-yellow-500';
    if (days >= 3) return 'from-yellow-500 to-green-500';
    return 'from-blue-500 to-purple-500';
  };

  const getStreakMessage = (days) => {
    if (days === 0) return 'Start your streak today!';
    if (days === 1) return 'Great start! Keep it going!';
    if (days < 7) return 'Building momentum!';
    if (days < 30) return 'On fire! 🔥';
    return 'Legendary streak! 🔥🔥🔥';
  };

  return (
    <div className="card-gradient p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${getStreakColor(current)} rounded-2xl flex items-center justify-center shadow-glow`}>
            <span className="text-2xl">🔥</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Learning Streak
            </h3>
            <p className="text-sm text-gray-600">{getStreakMessage(current)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-black bg-gradient-to-r ${getStreakColor(current)} bg-clip-text text-transparent`}>
            {current}
          </div>
          <div className="text-xs text-gray-500">days</div>
        </div>
      </div>

      {/* Streak visualization */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(Math.min(current, 30))].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-6 rounded-full bg-gradient-to-t ${getStreakColor(current)}`}
            style={{ opacity: Math.max(0.2, 1 - i * 0.03) }}
          />
        ))}
        {current > 30 && (
          <div className="text-sm text-gray-500 ml-2">+{current - 30}</div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm">
        <div>
          <span className="text-gray-600">Longest streak:</span>
          <span className="font-bold text-gray-900 ml-1">{longest} days</span>
        </div>
        <div>
          <span className="text-gray-600">Next milestone:</span>
          <span className="font-bold text-primary-600 ml-1">
            {current < 3 ? '3 days' : current < 7 ? '7 days' : current < 30 ? '30 days' : '∞'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LearningStreak;
