// Service Worker для PWA
const CACHE_NAME = "stalker-cards-v1";
const RUNTIME_CACHE = "stalker-runtime-v1";
const AUDIO_CACHE = "stalker-audio-v1";

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

// Генеруємо список всіх аудіо файлів (48 карток x 2 аудіо)
const AUDIO_FILES = [];
for (let i = 1; i <= 48; i++) {
  AUDIO_FILES.push(`/audio/card${i}_audio0.mp3`);
  AUDIO_FILES.push(`/audio/card${i}_audio1.mp3`);
}

// Встановлення Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Кешуємо основні файли
      caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
      // Кешуємо всі аудіо файли
      caches.open(AUDIO_CACHE).then((cache) => {
        console.log("📥 Завантаження аудіо файлів для офлайн режиму...");
        return cache
          .addAll(AUDIO_FILES)
          .then(() => {
            console.log("✅ Всі аудіо файли закешовано!");
          })
          .catch((err) => {
            console.warn("⚠️ Деякі аудіо не вдалося закешувати:", err);
          });
      }),
    ]).then(() => self.skipWaiting()),
  );
});

// Активація Service Worker
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, AUDIO_CACHE];
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
  // Пропускаємо не-GET запити
  if (event.request.method !== "GET") return;

  // Пропускаємо зовнішні запити (API, fonts, тощо)
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Для аудіо файлів - Cache First (пріоритет офлайн)
  if (event.request.url.includes("/audio/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            return caches.open(AUDIO_CACHE).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
        );
      }),
    );
    return;
  }

  // Для інших файлів - Cache First з fallback на Network
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
