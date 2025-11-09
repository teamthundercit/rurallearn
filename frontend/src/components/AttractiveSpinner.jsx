import React from 'react';
import { motion } from 'framer-motion';

const AttractiveSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: { container: 'w-12 h-12', dot: 'w-3 h-3' },
    md: { container: 'w-16 h-16', dot: 'w-4 h-4' },
    lg: { container: 'w-24 h-24', dot: 'w-5 h-5' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Spinner */}
      <div className="relative" style={{ width: currentSize.container.split(' ')[0].replace('w-', '') + 'rem', height: currentSize.container.split(' ')[1].replace('h-', '') + 'rem' }}>
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-violet-400 border-l-fuchsia-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner pulsing dot */}
        <motion.div
          className={`absolute inset-0 m-auto ${currentSize.dot} rounded-full bg-gradient-to-br from-blue-400 to-purple-600`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p
          className="text-gray-300 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default AttractiveSpinner;
