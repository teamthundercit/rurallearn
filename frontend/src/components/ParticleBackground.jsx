import React, { useEffect, useRef, useState } from 'react';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';

const ParticleBackground = () => {
  const containerRef = useRef(null);
  const [particleCount, setParticleCount] = useState(20);
  const { shouldReduceAnimations } = usePerformanceMonitor();
  
  // Adjust particle count based on screen size and performance
  useEffect(() => {
    const updateParticleCount = () => {
      const width = window.innerWidth;
      
      // Reduce particle count if performance is poor
      const performanceMultiplier = shouldReduceAnimations ? 0.5 : 1;
      
      if (width < 640) {
        setParticleCount(Math.floor(10 * performanceMultiplier)); // Mobile: 10 or 5 particles
      } else if (width < 1024) {
        setParticleCount(Math.floor(15 * performanceMultiplier)); // Tablet: 15 or 7 particles
      } else {
        setParticleCount(Math.floor(20 * performanceMultiplier)); // Desktop: 20 or 10 particles
      }
    };
    
    updateParticleCount();
    window.addEventListener('resize', updateParticleCount);
    
    return () => window.removeEventListener('resize', updateParticleCount);
  }, [shouldReduceAnimations]);
  
  // Generate particles with random sizes (50-150px), positions, and animation delays
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50, // 50-150px
    x: Math.random() * 100, // 0-100%
    y: Math.random() * 100, // 0-100%
    delay: Math.random() * 20, // 0-20s
    speed: Math.random() * 0.5 + 0.3 // 0.3-0.8 parallax speed multiplier
  }));
  
  useEffect(() => {
    let animationFrameId;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const scrollY = window.scrollY;
      const particleElements = containerRef.current.querySelectorAll('.particle');
      
      particleElements.forEach((element, index) => {
        const particle = particles[index];
        const translateY = scrollY * particle.speed;
        element.style.transform = `translateY(${translateY}px)`;
      });
    };
    
    const onScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(handleScroll);
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [particles]);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle gpu-accelerated"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            background: `linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
