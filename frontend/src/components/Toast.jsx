import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  type === 'info' ? 'bg-blue-500' : 
                  'bg-gray-500';

  const icon = type === 'success' ? '✓' : 
               type === 'error' ? '✗' : 
               type === 'info' ? 'ℹ' : 
               '•';

  return (
    <div className="fixed top-20 right-4 z-[9999] animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 max-w-md backdrop-blur-sm`}>
        <span className="text-xl font-bold flex-shrink-0">{icon}</span>
        <p className="flex-1 text-sm sm:text-base">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-xl flex-shrink-0 ml-2"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
