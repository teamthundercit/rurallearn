import React from 'react';
import { motion } from 'framer-motion';

const TrendBadge = ({ trend }) => {
  // Determine color based on trend direction
  const getTrendColor = () => {
    if (trend > 0) {
      return {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-300',
        border: 'border-emerald-400/30'
      };
    } else if (trend < 0) {
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-400/30'
      };
    } else {
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-300',
        border: 'border-yellow-400/30'
      };
    }
  };

  const colors = getTrendColor();
  const prefix = trend > 0 ? '+' : '';

  return (
    <motion.span
      className={`px-3 py-1 rounded-full text-xs font-semibold border gpu-accelerated ${colors.bg} ${colors.text} ${colors.border}`}
      animate={{ opacity: [1, 0.7, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      {prefix}{trend}%
    </motion.span>
  );
};

export default TrendBadge;
