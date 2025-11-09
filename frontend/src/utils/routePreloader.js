/**
 * Route preloader utility for preloading lazy-loaded routes on hover
 * This improves perceived performance by loading routes before navigation
 */

// Store preloaded routes to avoid duplicate preloads
const preloadedRoutes = new Set();

/**
 * Preload a lazy-loaded route component
 * @param {Function} lazyComponent - The lazy-loaded component (result of React.lazy())
 * @param {string} routeName - Name of the route for tracking
 */
export const preloadRoute = (lazyComponent, routeName) => {
  if (preloadedRoutes.has(routeName)) {
    return; // Already preloaded
  }

  try {
    // Trigger the lazy load by calling the component's preload method
    // This works because React.lazy returns a component with a _payload property
    if (lazyComponent && lazyComponent._payload && lazyComponent._payload._result === null) {
      // Component not yet loaded, trigger the load
      lazyComponent._payload._result = lazyComponent._payload._status();
    }
    
    preloadedRoutes.add(routeName);
  } catch (error) {
    // Silently fail - preloading is an optimization, not critical
  }
};

/**
 * Create a preload handler for use in onMouseEnter/onFocus events
 * @param {Function} lazyComponent - The lazy-loaded component
 * @param {string} routeName - Name of the route
 * @returns {Function} Event handler function
 */
export const createPreloadHandler = (lazyComponent, routeName) => {
  return () => preloadRoute(lazyComponent, routeName);
};

/**
 * Preload multiple routes at once
 * @param {Array<{component: Function, name: string}>} routes - Array of route objects
 */
export const preloadRoutes = (routes) => {
  routes.forEach(({ component, name }) => {
    preloadRoute(component, name);
  });
};

/**
 * Clear the preloaded routes cache
 */
export const clearPreloadCache = () => {
  preloadedRoutes.clear();
};

export default {
  preloadRoute,
  createPreloadHandler,
  preloadRoutes,
  clearPreloadCache
};
