import React from 'react';

const ProgressCard = ({ icon, title, value, color = 'primary' }) => {
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className={`text-3xl mb-2 ${colorClasses[color] || colorClasses.primary}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${colorClasses[color] || colorClasses.primary}`}>
        {value}
      </p>
    </div>
  );
};

export default ProgressCard;
