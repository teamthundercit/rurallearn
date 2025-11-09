import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Bot, Wifi } from 'lucide-react';

const iconMap = {
  '📚': BookOpen,
  '🤖': Bot,
  '📱': Wifi,
};

const FeatureTile = ({ icon, title, description, onClick }) => {
  const IconComponent = iconMap[icon] || BookOpen;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const motionProps = prefersReducedMotion ? {} : {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 }
  };

  return (
    <motion.div
      className="glass-neon-blue p-6 tilt-3d cursor-pointer gpu-accelerated"
      {...motionProps}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${title}: ${description}`}
    >
      <div className="mb-3" aria-hidden="true">
        <IconComponent className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.div>
  );
};

export default FeatureTile;
