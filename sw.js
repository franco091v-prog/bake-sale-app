// ============================================
// 📡 SERVICE WORKER - Modo Offline
// ============================================
// Esto permite que la app funcione SIN INTERNET
// después de haberla abierto una vez.
// ============================================

const CACHE_NAME = "bake-sale-v1";

// Archivos que se guardan para usar sin internet
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/styles.css",
  "/app.js",
  "/menu-data.js",
  "/manifest.json",
];

// ─── Instalación: guardamos los archivos ───
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ─── Activación: limpiamos cachés viejas ───
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ─── Cuando se pide un archivo: lo buscamos en caché ───
self.addEventListener("fetch", (event) => {
  // Solo interceptamos peticiones HTTP normales
  if (
    event.request.method !== "GET" ||
    !event.request.url.startsWith("http")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, lo devolvemos (funciona offline)
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no, lo buscamos en internet
      return fetch(event.request).then((response) => {
        // Guardamos en caché para la próxima vez
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
