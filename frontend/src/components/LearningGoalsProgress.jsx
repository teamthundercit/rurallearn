import React, { useState } from 'react';

const LearningGoalsProgress = ({ weeklyGoal = 3, monthlyGoal = 12, weeklyProgress = 0, monthlyProgress = 0 }) => {
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(weeklyGoal);
  const [newMonthlyGoal, setNewMonthlyGoal] = useState(monthlyGoal);

  const weeklyPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);
  const monthlyPercentage = Math.min((monthlyProgress / monthlyGoal) * 100, 100);

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'from-success-500 to-success-600';
    if (percentage >= 75) return 'from-primary-500 to-primary-600';
    if (percentage >= 50) return 'from-accent-500 to-accent-600';
    return 'from-gray-400 to-gray-500';
  };

  const getProgressMessage = (percentage, isWeekly) => {
    const period = isWeekly ? 'week' : 'month';
    if (percentage >= 100) return `🎉 ${period} goal achieved!`;
    if (percentage >= 75) return `🔥 Almost there this ${period}!`;
    if (percentage >= 50) return `💪 Halfway through this ${period}!`;
    if (percentage > 0) return `🌱 Good start this ${period}!`;
    return `⭐ Set your ${period} in motion!`;
  };

  return (
    <div className="card-gradient p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Learning Goals
            </h3>
            <p className="text-sm text-gray-600">Track your progress</p>
          </div>
        </div>
        <button
          onClick={() => setShowGoalSetter(!showGoalSetter)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {showGoalSetter ? 'Cancel' : 'Edit Goals'}
        </button>
      </div>

      {showGoalSetter ? (
        <div className="glass p-4 rounded-xl mb-4">
          <h4 className="font-bold text-gray-900 mb-3">Set Your Goals</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weekly Goal (lessons)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={newWeeklyGoal}
                onChange={(e) => setNewWeeklyGoal(parseInt(e.target.value))}
                className="input-modern w-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Goal (lessons)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={newMonthlyGoal}
                onChange={(e) => setNewMonthlyGoal(parseInt(e.target.value))}
                className="input-modern w-20"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-primary text-sm px-4 py-2">
                Save Goals
              </button>
              <button
                onClick={() => setShowGoalSetter(false)}
                className="btn-secondary text-sm px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Weekly Goal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">This Week</span>
              <span className="text-sm text-gray-600">
                {weeklyProgress} / {weeklyGoal} lessons
              </span>
            </div>
            <div className="progress-bar mb-2">
              <div
                className={`progress-fill bg-gradient-to-r ${getProgressColor(weeklyPercentage)}`}
                style={{ width: `${weeklyPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {getProgressMessage(weeklyPercentage, true)}
            </p>
          </div>

          {/* Monthly Goal */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">This Month</span>
              <span className="text-sm text-gray-600">
                {monthlyProgress} / {monthlyGoal} lessons
              </span>
            </div>
            <div className="progress-bar mb-2">
              <div
                className={`progress-fill bg-gradient-to-r ${getProgressColor(monthlyPercentage)}`}
                style={{ width: `${monthlyPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">
              {getProgressMessage(monthlyPercentage, false)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningGoalsProgress;
