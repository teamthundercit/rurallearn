import React from 'react';

const ProgressCard = ({ icon, title, value, color = 'primary', trend }) => {
  const colorClasses = {
    primary: {
      bg: 'from-primary-500 to-primary-600',
      text: 'text-primary-600',
      light: 'bg-primary-50',
      border: 'border-primary-200'
    },
    secondary: {
      bg: 'from-secondary-500 to-secondary-600',
      text: 'text-secondary-600',
      light: 'bg-secondary-50',
      border: 'border-secondary-200'
    },
    accent: {
      bg: 'from-accent-500 to-accent-600',
      text: 'text-accent-600',
      light: 'bg-accent-50',
      border: 'border-accent-200'
    },
    success: {
      bg: 'from-success-500 to-success-600',
      text: 'text-success-600',
      light: 'bg-success-50',
      border: 'border-success-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className="card-gradient hover-lift group cursor-pointer overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        {/* Icon with animated background */}
        <div className={`inline-flex items-center justify-center w-14 h-14 ${colors.light} rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <span className="text-3xl">{icon}</span>
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          {title}
        </h3>
        
        {/* Value with gradient on hover */}
        <div className="flex items-end justify-between">
          <p className={`text-4xl font-black ${colors.text} group-hover:text-gradient transition-all duration-300`}>
            {value}
          </p>
          
          {/* Trend indicator */}
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? 'text-success-600' : 'text-red-600'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {trend > 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 progress-bar">
          <div className={`progress-fill bg-gradient-to-r ${colors.bg}`} style={{ width: `${Math.min(value * 5, 100)}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
