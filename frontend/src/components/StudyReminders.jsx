import React, { useState } from 'react';

const StudyReminders = ({ nextLessons, reviewLessons }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [reminderDays, setReminderDays] = useState(['mon', 'wed', 'fri']);

  const reminders = [
    {
      type: 'next',
      title: 'Continue Learning',
      description: nextLessons?.length > 0 ? `Ready: ${nextLessons[0]?.title}` : 'Explore new lessons',
      icon: '📚',
      time: 'Suggested: Now',
      color: 'from-primary-500 to-primary-600'
    },
    {
      type: 'review',
      title: 'Review Time',
      description: reviewLessons?.length > 0 ? `${reviewLessons.length} lesson(s) to review` : 'All caught up!',
      icon: '🔄',
      time: 'Suggested: Tomorrow',
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      type: 'streak',
      title: 'Keep Your Streak',
      description: 'Don\'t break your learning momentum',
      icon: '🔥',
      time: `Reminder: ${reminderTime}`,
      color: 'from-red-500 to-orange-500'
    }
  ];

  const dayNames = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
  };

  return (
    <div className="card-gradient p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-2xl">⏰</span>
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-gray-900">
              Study Reminders
            </h3>
            <p className="text-sm text-gray-600">Stay on track with your learning</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          {showSettings ? 'Done' : 'Settings'}
        </button>
      </div>

      {showSettings ? (
        <div className="glass p-4 rounded-xl">
          <h4 className="font-bold text-gray-900 mb-4">Reminder Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="input-modern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Days
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(dayNames).map(([key, name]) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (reminderDays.includes(key)) {
                        setReminderDays(reminderDays.filter(d => d !== key));
                      } else {
                        setReminderDays([...reminderDays, key]);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      reminderDays.includes(key)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary text-sm px-4 py-2">
              Save Settings
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder, index) => (
            <div
              key={index}
              className="glass p-4 rounded-xl hover-lift transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${reminder.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <span className="text-lg">{reminder.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 group-hover:text-gradient transition-all">
                    {reminder.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {reminder.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {reminder.time}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyReminders;
