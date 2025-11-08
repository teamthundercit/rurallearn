import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PlatformStats = () => {
  const containerRef = useRef(null);
  const stats = [
    { value: '2K+', label: 'Learners' },
    { value: '80+', label: 'Lessons' },
    { value: '95%', label: 'Growth' }
  ];

  // Remove will-change after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.willChange = 'auto';
      }
    }, 800); // delay (500ms) + transition duration (300ms)
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="flex gap-6 text-white justify-center gpu-accelerated"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl font-bold text-neon-animate gpu-accelerated">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
};

export default PlatformStats;
