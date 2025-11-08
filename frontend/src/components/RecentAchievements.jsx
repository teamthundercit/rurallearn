import React from 'react';

const RecentAchievements = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="card-gradient p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">🌟</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Recent Achievements
            </h3>
            <p className="text-sm text-gray-600">Your latest accomplishments</p>
          </div>
        </div>
        <div className="text-center py-8">
          <span className="text-6xl mb-4 block opacity-50">🏆</span>
          <p className="text-gray-500">Complete lessons to see your achievements!</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    const now = new Date();
    const achievementDate = new Date(date);
    const diffTime = Math.abs(now - achievementDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return achievementDate.toLocaleDateString();
  };

  const getAchievementColor = (type) => {
    switch (type) {
      case 'badge': return 'border-accent-200 bg-accent-50';
      case 'completion': return 'border-success-200 bg-success-50';
      case 'streak': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="card-gradient p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-glow">
          <span className="text-2xl">🌟</span>
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900">
            Recent Achievements
          </h3>
          <p className="text-sm text-gray-600">{achievements.length} recent activities</p>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-xl border-2 ${getAchievementColor(achievement.type)} hover-lift transition-all`}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-lg">{achievement.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {achievement.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{formatDate(achievement.date)}</span>
                {achievement.score && (
                  <>
                    <span>•</span>
                    <span className={`font-medium ${
                      achievement.score >= 90 ? 'text-success-600' :
                      achievement.score >= 70 ? 'text-primary-600' :
                      'text-accent-600'
                    }`}>
                      {achievement.score}%
                    </span>
                  </>
                )}
              </div>
            </div>
            {achievement.type === 'badge' && (
              <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">!</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {achievements.length > 8 && (
        <div className="text-center mt-4">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all achievements →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAchievements;
