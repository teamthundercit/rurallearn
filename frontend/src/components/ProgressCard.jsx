import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TrendBadge from './TrendBadge';
import GradientProgressBar from './GradientProgressBar';

const ProgressCard = ({ 
  icon, 
  title, 
  value, 
  total,
  color = { from: 'cyan-400', to: 'blue-500' },
  trend,
  animation = 'scale',
  onClick
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Animation variants for the icon
  const iconAnimations = prefersReducedMotion ? {} : {
    scale: { 
      scale: [1, 1.1, 1], 
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } 
    },
    tilt: { 
      rotate: [0, 5, -5, 0], 
      transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } 
    },
    pulse: { 
      opacity: [1, 0.7, 1], 
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } 
    }
  };

  // Calculate percentage if total is provided
  const percentage = total ? (value / total) * 100 : null;

  const motionProps = prefersReducedMotion ? {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 }
  } : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.05, y: -5 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      className="glass-neon-blue p-6 sweep-light hover-lift group cursor-pointer gpu-accelerated"
      {...motionProps}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : "article"}
      aria-label={`${title}: ${value}${total ? ` out of ${total}` : ''}${trend ? `, trending ${trend > 0 ? 'up' : 'down'} by ${Math.abs(trend)}%` : ''}`}
    >
      {/* Icon Container with Gradient Background */}
      <motion.div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${color.from} to-${color.to} 
                    flex items-center justify-center text-3xl mb-4 shadow-neon-blue gpu-accelerated`}
        animate={prefersReducedMotion ? {} : iconAnimations[animation]}
      >
        {icon}
      </motion.div>
      
      {/* Title and Trend Badge */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {trend && <TrendBadge trend={trend} />}
      </div>
      
      {/* Value Display */}
      <div className="text-3xl font-black text-neon-animate mb-4">
        {value}
        {total && <span className="text-lg text-gray-400">/{total}</span>}
      </div>
      
      {/* Progress Bar (if total is provided) */}
      {percentage !== null && (
        <GradientProgressBar percentage={percentage} color={color} />
      )}
    </motion.div>
  );
};

export default ProgressCard;
