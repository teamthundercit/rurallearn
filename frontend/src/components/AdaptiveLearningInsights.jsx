import React from 'react';

const AdaptiveLearningInsights = ({ insights }) => {
  if (!insights) return null;

  const { currentLevel, averageScore, learningPace, recommendedDifficulty, canAdvance, advancementMessage } = insights;

  const getLevelIcon = (level) => {
    switch (level) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      default: return '📚';
    }
  };

  const getPaceIcon = (pace) => {
    switch (pace) {
      case 'fast': return '🚀';
      case 'slow': return '🐢';
      default: return '⚡';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-success-600';
    if (score >= 70) return 'text-primary-600';
    if (score >= 50) return 'text-accent-600';
    return 'text-gray-600';
  };

  return (
    <div className="card-gradient p-6 mb-8 animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
          <span className="text-2xl">🎯</span>
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-gray-900">
            Your Learning Path
          </h3>
          <p className="text-sm text-gray-600">Personalized insights based on your performance</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Current Level */}
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getLevelIcon(currentLevel)}</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Level</span>
          </div>
          <p className="text-xl font-bold text-gray-900 capitalize">{currentLevel}</p>
        </div>

        {/* Average Score */}
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Avg Score</span>
          </div>
          <p className={`text-xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}%
          </p>
        </div>

        {/* Learning Pace */}
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getPaceIcon(learningPace)}</span>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pace</span>
          </div>
          <p className="text-xl font-bold text-gray-900 capitalize">{learningPace}</p>
        </div>
      </div>

      {/* Advancement Status */}
      {canAdvance ? (
        <div className="glass p-4 border-l-4 border-success-500 bg-success-50/50">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <p className="font-bold text-success-800 mb-1">Ready to Level Up!</p>
              <p className="text-sm text-success-700">{advancementMessage}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-4 border-l-4 border-primary-500">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💪</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800 mb-1">Keep Building Skills</p>
              <p className="text-sm text-gray-700">{advancementMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Difficulty */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600">Recommended difficulty:</span>
        <span className="badge badge-primary capitalize">
          {getLevelIcon(recommendedDifficulty)} {recommendedDifficulty}
        </span>
      </div>
    </div>
  );
};

export default AdaptiveLearningInsights;
