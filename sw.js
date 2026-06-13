const CACHE_NAME = 'trivia-board-game-v1';

// Assets to precache on service worker install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './generator.html',
  './style.css',
  './manifest.json',
  './js/theme.js',
  './js/generator.js',
  './js/trivia/board.js',
  './js/trivia/client-adapter.js',
  './js/trivia/config.js',
  './js/trivia/dom.js',
  './js/trivia/error-bus.js',
  './js/trivia/explanations.js',
  './js/trivia/game-api.js',
  './js/trivia/game-flow.js',
  './js/trivia/main.js',
  './js/trivia/persistence.js',
  './js/trivia/state.js',
  './js/trivia/store.js',
  './js/trivia/ui-board.js',
  './js/trivia/ui-events.js',
  './js/trivia/ui-handlers.js',
  './js/trivia/ui-history.js',
  './js/trivia/ui-menu.js',
  './js/trivia/ui-modals.js',
  './js/trivia/ui-notifications.js',
  './js/trivia/ui-setup.js',
  './js/trivia/ui-state.js',
  './js/trivia/ui.js',
  './js/trivia/utils.js',
  './js/trivia/services/api-service.js',
  './js/trivia/services/persistence-service.js',
  './databases/list.json',
  './databases/categories/general_pl.json',
  './databases/categories/general_en.json',
  './icons/icon-192.png',
  './icons/icon-512.png',

  // CDN scripts & styles
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

// Install Event - cache all app shell assets and dynamically precache all question databases
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        console.log('[Service Worker] Precaching app shell...');
        await cache.addAll(PRECACHE_ASSETS);

        // Dynamically fetch databases/list.json and cache all database categories for offline play
        try {
          console.log('[Service Worker] Fetching databases/list.json for dynamic precaching...');
          const listResponse = await fetch('./databases/list.json');
          if (listResponse.ok) {
            const list = await listResponse.json();
            const categoryUrls = list.map((item) => './' + item.path);
            console.log(
              `[Service Worker] Found ${categoryUrls.length} database categories to precache.`
            );

            // Cache them in batches of 15 to avoid network/socket congestion
            const batchSize = 15;
            for (let i = 0; i < categoryUrls.length; i += batchSize) {
              const batch = categoryUrls.slice(i, i + batchSize);
              await Promise.all(
                batch.map(async (url) => {
                  try {
                    const response = await fetch(url);
                    if (response.ok) {
                      await cache.put(url, response);
                    } else {
                      console.warn(
                        `[Service Worker] Failed to cache category: ${url} (status ${response.status})`
                      );
                    }
                  } catch (err) {
                    console.error(`[Service Worker] Error caching category ${url}:`, err);
                  }
                })
              );
            }
            console.log('[Service Worker] Finished dynamic database precaching.');
          }
        } catch (err) {
          console.error('[Service Worker] Failed to load database list for dynamic caching:', err);
        }
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event - intercept requests and serve from cache or network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache for API calls (LM Studio, OpenRouter, OpenAI, etc.)
  if (
    url.hostname.includes('openrouter.ai') ||
    url.hostname.includes('openai.com') ||
    url.pathname.includes('/v1/') ||
    event.request.method !== 'GET'
  ) {
    return; // Let the browser fetch from network directly
  }

  // Strategy for category JSON files: Stale-While-Revalidate
  // This allows playing offline instantly while updating categories when online
  if (url.pathname.includes('/databases/categories/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((err) => {
              console.log(
                '[Service Worker] Failed to fetch category from network, serving cached:',
                err
              );
            });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy for Google Font files (fonts.gstatic.com): Cache First
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy for other requests: Cache First falling back to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch((err) => {
        // Fallback for navigation requests (HTML pages)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        throw err;
      });
    })
  );
});
