import React from 'react';
import { useTranslation } from 'react-i18next';

const WeeklyActivityChart = ({ weeklyData }) => {
  const { t } = useTranslation();
  if (!weeklyData || weeklyData.length === 0) {
    return (
      <div className="glass-neon-blue p-6 animate-scale-in border border-white/10 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">📈</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">
              {t('dashboard.activity')}
            </h3>
            <p className="text-sm text-gray-400">{t('dashboard.yourLearningPattern')}</p>
          </div>
        </div>
        <div className="text-center py-8">
          <span className="text-6xl mb-4 block opacity-50">📊</span>
          <p className="text-gray-400">{t('dashboard.startLearningToSeeChart')}</p>
        </div>
      </div>
    );
  }

  const maxLessons = Math.max(...weeklyData.map(d => d.lessonsCompleted), 1);
  const totalLessons = weeklyData.reduce((sum, d) => sum + d.lessonsCompleted, 0);
  const totalTime = weeklyData.reduce((sum, d) => sum + d.timeSpent, 0);

  return (
    <div className="glass-neon-blue p-6 animate-scale-in border border-white/10 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">📈</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-white">
              {t('dashboard.activity')}
            </h3>
            <p className="text-sm text-gray-400">{totalLessons} {t('dashboard.lessonsThisWeek')}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-400">
            {Math.round(totalTime)}m
          </div>
          <div className="text-xs text-gray-500">{t('dashboard.totalTime')}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-32 mb-4">
        {weeklyData.map((day, index) => {
          const height = maxLessons > 0 ? (day.lessonsCompleted / maxLessons) * 100 : 0;
          const isToday = index === weeklyData.length - 1;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col justify-end h-24 mb-2">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    day.lessonsCompleted > 0
                      ? isToday
                        ? 'bg-gradient-to-t from-accent-500 to-accent-400'
                        : 'bg-gradient-to-t from-primary-500 to-primary-400'
                      : 'bg-gray-200'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {day.date}
              </div>
              {day.lessonsCompleted > 0 && (
                <div className="text-xs text-primary-600 font-bold">
                  {day.lessonsCompleted}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-400 rounded"></div>
          <span>Lessons completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gradient-to-r from-accent-500 to-accent-400 rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivityChart;
