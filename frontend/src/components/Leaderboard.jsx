import React, { useState } from 'react';

const Leaderboard = ({ userRank, userPoints, topLearners }) => {
  const [timeframe, setTimeframe] = useState('week');

  const mockLeaderboard = [
    { rank: 1, name: 'Anonymous Learner', points: 1250, streak: 15, badge: '👑' },
    { rank: 2, name: 'Study Master', points: 1180, streak: 12, badge: '🥈' },
    { rank: 3, name: 'Knowledge Seeker', points: 1050, streak: 8, badge: '🥉' },
    { rank: 4, name: 'Learning Enthusiast', points: 980, streak: 6, badge: '🌟' },
    { rank: 5, name: 'Progress Maker', points: 920, streak: 4, badge: '⭐' },
  ];

  const leaderboardData = topLearners || mockLeaderboard;
  const currentUserRank = userRank || Math.floor(Math.random() * 20) + 6;
  const currentUserPoints = userPoints || Math.floor(Math.random() * 500) + 400;

  const getRankIcon = (rank) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🌟';
    return '⭐';
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-500';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-500';
    return 'from-blue-400 to-blue-500';
  };

  return (
    <div className="glass-neon-blue p-6 animate-scale-in border border-white/10 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">🏅</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">
              Leaderboard
            </h3>
            <p className="text-sm text-gray-400">See how you rank among learners</p>
          </div>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="text-sm border border-white/20 bg-white/5 text-white rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        >
          <option value="week" className="bg-midnight-800">This Week</option>
          <option value="month" className="bg-midnight-800">This Month</option>
          <option value="all" className="bg-midnight-800">All Time</option>
        </select>
      </div>

      {/* Your Rank */}
      <div className="bg-white/5 p-4 rounded-xl mb-4 border-2 border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${getRankColor(currentUserRank)} rounded-xl flex items-center justify-center shadow-md`}>
            <span className="text-lg">{getRankIcon(currentUserRank)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Your Rank: #{currentUserRank}</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">{currentUserPoints} pts</span>
            </div>
            <p className="text-sm text-gray-400">
              {currentUserRank <= 10 ? 'Great job! You\'re in the top 10!' : 'Keep learning to climb higher!'}
            </p>
          </div>
        </div>
      </div>

      {/* Top Learners */}
      <div className="space-y-2">
        <h4 className="font-bold text-white mb-3">Top Learners</h4>
        {leaderboardData.slice(0, 5).map((learner, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              learner.rank <= 3
                ? 'bg-white/10 border-2 border-yellow-500/30'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${getRankColor(learner.rank)} rounded-lg flex items-center justify-center text-sm font-bold text-white`}>
              {learner.rank}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{learner.name}</span>
                {learner.streak > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                    🔥 {learner.streak}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">{learner.points} points</p>
            </div>
            <span className="text-2xl">{learner.badge}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 All names are anonymous to protect privacy</p>
      </div>
    </div>
  );
};

export default Leaderboard;
