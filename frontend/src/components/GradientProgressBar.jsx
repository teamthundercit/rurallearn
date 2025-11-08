import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GradientProgressBar = ({ percentage, color }) => {
  const fillRef = useRef(null);
  
  // Remove will-change after animation completes to optimize performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.willChange = 'auto';
      }
    }, 1200); // Duration (1000ms) + delay (200ms)
    
    return () => clearTimeout(timer);
  }, [percentage]);
  
  return (
    <div className="progress-glow">
      <motion.div
        ref={fillRef}
        className={`progress-glow-fill bg-gradient-to-r from-${color.from} to-${color.to} gpu-accelerated`}
        style={{ 
          width: `${Math.min(percentage, 100)}%`,
          transformOrigin: 'left center'
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
      />
    </div>
  );
};

export default GradientProgressBar;
