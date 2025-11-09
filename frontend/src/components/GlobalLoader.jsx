import React from 'react';
import { motion } from 'framer-motion';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-glass flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(10, 14, 39, 0.95)' }}>
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Rotating gradient emblem */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 shadow-neon-blue animate-morph" />
        
        {/* Counter-rotating "E" letter */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          E
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GlobalLoader;
