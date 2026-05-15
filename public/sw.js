// Service Worker для PWA - мінімальна версія
const CACHE_NAME = "stalker-cards-v1";
const RUNTIME_CACHE = "stalker-runtime-v1";

// Тільки критичні файли для початкового завантаження
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/stalker-logo.png",
  "/pda-icon.png",
  "/favicon.png",
];

// Встановлення Service Worker - тільки основні файли
self.addEventListener("install", (event) => {
  console.log("📦 Встановлення PWA...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => {
        console.log("✅ Основні файли закешовано");
        return self.skipWaiting();
      }),
  );
});

// Активація Service Worker
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, "stalker-offline-data-v1"];
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

// Стратегія кешування
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Для аудіо та зображень - спочатку кеш, потім мережа
  if (
    event.request.url.includes("/audio/") ||
    event.request.url.includes("/images/")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Кешуємо в runtime кеш
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        });
      }),
    );
    return;
  }

  // Для інших файлів
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    }),
  );
});
