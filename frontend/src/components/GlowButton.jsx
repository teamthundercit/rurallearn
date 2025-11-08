import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({ onClick, onMouseEnter, onFocus, children, className = '', ariaLabel }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const motionProps = prefersReducedMotion ? {} : {
    whileHover: { x: 5, scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      className={`btn-ripple shadow-neon-blue bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg group relative overflow-hidden gpu-accelerated ${className}`}
      {...motionProps}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <svg 
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7l5 5m0 0l-5 5m5-5H6" 
          />
        </svg>
      </span>
    </motion.button>
  );
};

export default GlowButton;
