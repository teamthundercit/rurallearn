/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'rurallearn-v1';
const STATIC_CACHE_NAME = 'rurallearn-static-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/js/bundle.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        // Use addAll with error handling for assets that might not exist yet
        return cache.addAll(STATIC_ASSETS.filter(url => url !== '/static/css/main.css' && url !== '/static/js/main.js' && url !== '/static/js/bundle.js'))
          .catch((error) => {
            console.warn('[Service Worker] Failed to cache some static assets:', error);
            // Continue anyway - assets will be cached on first fetch
          });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE_NAME)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests (they should go through network)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Cache-first strategy for static assets
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', request.url);
            return cachedResponse;
          }

          // Not in cache, fetch from network and cache it
          return fetch(request)
            .then((response) => {
              // Check if valid response
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              // Clone the response
              const responseToCache = response.clone();

              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });

              return response;
            })
            .catch((error) => {
              console.error('[Service Worker] Fetch failed:', error);
              // Return offline page or cached version if available
              return caches.match('/index.html');
            });
        })
    );
  }
});

// Helper function to determine if URL is a static asset
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  const pathname = url.pathname;
  
  // Check if it's a static file extension
  if (staticExtensions.some(ext => pathname.endsWith(ext))) {
    return true;
  }
  
  // Check if it's in the static directory
  if (pathname.startsWith('/static/')) {
    return true;
  }
  
  // Check if it's the root or index.html
  if (pathname === '/' || pathname === '/index.html') {
    return true;
  }
  
  return false;
}

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
