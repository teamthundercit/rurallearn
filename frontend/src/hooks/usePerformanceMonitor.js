import { useEffect, useState } from 'react';

/**
 * Custom hook to monitor FPS and adaptively reduce animation complexity
 * when performance drops below 30fps
 */
const usePerformanceMonitor = () => {
  const [shouldReduceAnimations, setShouldReduceAnimations] = useState(false);
  const [currentFPS, setCurrentFPS] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      // Calculate FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        setCurrentFPS(fps);

        // Reduce animations if FPS drops below 30
        if (fps < 30) {
          setShouldReduceAnimations(true);
          document.body.classList.add('reduce-animations');
        } else if (fps > 45) {
          // Re-enable animations if FPS recovers above 45
          setShouldReduceAnimations(false);
          document.body.classList.remove('reduce-animations');
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    // Start monitoring after a short delay to let initial render complete
    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(measureFPS);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.body.classList.remove('reduce-animations');
    };
  }, []);

  return { shouldReduceAnimations, currentFPS };
};

export default usePerformanceMonitor;
