import React from 'react';
import { motion } from 'framer-motion';

const AnimatedLogo = () => {
  return (
    <motion.h1
      className="text-6xl font-black text-neon-animate gpu-accelerated"
      style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      EduAdapt
    </motion.h1>
  );
};

export default AnimatedLogo;
