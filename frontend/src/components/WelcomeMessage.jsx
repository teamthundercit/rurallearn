import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const WelcomeMessage = ({ name }) => {
  const text = `Welcome back, ${name}!`;
  const containerRef = useRef(null);
  
  // Remove will-change after animation completes
  useEffect(() => {
    const animationDuration = 0.3 + text.length * 0.03;
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const spans = containerRef.current.querySelectorAll('span');
        spans.forEach(span => {
          span.style.willChange = 'auto';
        });
      }
    }, animationDuration * 1000 + 100);
    
    return () => clearTimeout(timer);
  }, [text]);
  
  return (
    <motion.div
      ref={containerRef}
      className="text-lg font-medium text-gray-700 gpu-accelerated"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="gpu-accelerated"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.03 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default WelcomeMessage;
