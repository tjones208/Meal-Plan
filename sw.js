/*
 * Service worker: makes Meal Plan installable and work offline.
 *
 * - Precaches the app shell on install.
 * - Navigations are network-first (so new deploys show up), falling back to
 *   the cached page when offline.
 * - Same-origin assets use stale-while-revalidate (instant load, refresh in
 *   the background).
 * - Cross-origin requests (e.g. the Supabase sync API) are never intercepted.
 */

const CACHE = 'mealplan-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/recipes.js',
  '/js/storage.js',
  '/js/suggestions.js',
  '/js/shopping.js',
  '/js/nutrition.js',
  '/js/custom.js',
  '/js/sync.js',
  '/js/app.js',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-180.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // leave Supabase & other hosts alone

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
