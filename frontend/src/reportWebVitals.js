const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Enhanced performance logging for development
export const logPerformanceMetrics = () => {
  reportWebVitals((metric) => {
    const { name, value, rating } = metric;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}:`, {
        value: `${Math.round(value)}ms`,
        rating,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check against thresholds
    const thresholds = {
      FCP: 1800, // First Contentful Paint - should be < 1.8s
      LCP: 2500, // Largest Contentful Paint - should be < 2.5s
      FID: 100,  // First Input Delay - should be < 100ms
      CLS: 0.1,  // Cumulative Layout Shift - should be < 0.1
      TTFB: 800  // Time to First Byte - should be < 800ms
    };
    
    if (thresholds[name] && value > thresholds[name]) {
      console.warn(`⚠️ Performance warning: ${name} (${Math.round(value)}ms) exceeds threshold (${thresholds[name]}ms)`);
    }
  });
};

export default reportWebVitals;
