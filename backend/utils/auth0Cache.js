/**
 * Auth0 API Response Cache
 * Reduces Auth0 API calls to prevent rate limiting (429 errors)
 */

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const STALE_CACHE_TTL = 30 * 60 * 1000; // 30 minutes (for fallback)

/**
 * Get cached Auth0 user data or fetch if not cached
 * @param {string} key - Cache key (usually auth0Id)
 * @param {Function} fetchFunction - Function to fetch data from Auth0
 * @returns {Promise<any>} User data
 */
export const getCachedAuth0User = async (key, fetchFunction) => {
  const cached = cache.get(key);
  const now = Date.now();
  
  // Return fresh cache
  if (cached && now - cached.timestamp < CACHE_TTL) {
    console.log(`Cache HIT for ${key}`);
    return cached.data;
  }
  
  // Try to fetch fresh data
  try {
    console.log(`Cache MISS for ${key}, fetching from Auth0...`);
    const data = await fetchFunction();
    
    cache.set(key, {
      data,
      timestamp: now
    });
    
    return data;
  } catch (error) {
    // If rate limited (429) and we have stale cache, use it
    if (error.response?.status === 429 && cached && now - cached.timestamp < STALE_CACHE_TTL) {
      console.warn(`Rate limited! Using stale cache for ${key}`);
      return cached.data;
    }
    
    // If other error and we have stale cache, use it as fallback
    if (cached && now - cached.timestamp < STALE_CACHE_TTL) {
      console.warn(`Error fetching from Auth0, using stale cache for ${key}:`, error.message);
      return cached.data;
    }
    
    // No cache available, throw error
    throw error;
  }
};

/**
 * Invalidate cache for a specific key
 * @param {string} key - Cache key to invalidate
 */
export const invalidateCache = (key) => {
  cache.delete(key);
  console.log(`Cache invalidated for ${key}`);
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.clear();
  console.log('All cache cleared');
};

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export const getCacheStats = () => {
  const now = Date.now();
  let fresh = 0;
  let stale = 0;
  
  for (const [key, value] of cache.entries()) {
    const age = now - value.timestamp;
    if (age < CACHE_TTL) {
      fresh++;
    } else if (age < STALE_CACHE_TTL) {
      stale++;
    }
  }
  
  return {
    totalEntries: cache.size,
    freshEntries: fresh,
    staleEntries: stale,
    cacheTTL: CACHE_TTL,
    staleTTL: STALE_CACHE_TTL
  };
};

// Clean up old cache entries every 10 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > STALE_CACHE_TTL) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`Cache cleanup: removed ${cleaned} stale entries`);
  }
}, 10 * 60 * 1000);

// Prevent the interval from keeping the process alive
cleanupInterval.unref();

export default {
  getCachedAuth0User,
  invalidateCache,
  clearAllCache,
  getCacheStats
};
