// Service Worker для PWA
const CACHE_NAME = "stalker-cards-v1";
const RUNTIME_CACHE = "stalker-runtime-v1";

// Файли для кешування при встановленні
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/stalker-logo.png",
  "/pda-icon.png",
];

// Встановлення Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

// Активація Service Worker
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName),
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Стратегія кешування: Network First для HTML, Cache First для статики
self.addEventListener("fetch", (event) => {
  // Пропускаємо не-GET запити
  if (event.request.method !== "GET") return;

  // Пропускаємо зовнішні запити (API, fonts, тощо)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return caches.open(RUNTIME_CACHE).then((cache) => {
        return fetch(event.request).then((response) => {
          // Кешуємо тільки успішні відповіді
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    }),
  );
});
