import React from 'react';

const AchievementBadges = ({ badges, totalPoints }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="card-gradient p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Achievement Badges
            </h3>
            <p className="text-sm text-gray-600">Complete lessons to earn badges!</p>
          </div>
        </div>
        <div className="text-center py-8">
          <span className="text-6xl mb-4 block opacity-50">🏆</span>
          <p className="text-gray-500">No badges yet. Start learning to unlock achievements!</p>
        </div>
      </div>
    );
  }

  const recentBadges = badges.slice(-6);

  return (
    <div className="card-gradient p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Achievement Badges
            </h3>
            <p className="text-sm text-gray-600">{badges.length} badges earned</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-gradient">
            {totalPoints || 0}
          </div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
        {recentBadges.map((badge) => (
          <div key={badge.id} className="group relative">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:scale-110">
              <span className="text-2xl">{badge.icon}</span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="glass px-3 py-2 rounded-lg text-xs font-medium text-gray-900 whitespace-nowrap">
                <div className="font-bold">{badge.name}</div>
                <div className="text-gray-600">{badge.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {badges.length > 6 && (
        <div className="text-center">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all {badges.length} badges →
          </button>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
