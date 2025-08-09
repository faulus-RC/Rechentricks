// service-worker.js
const APP_VERSION = "v6";                    // <— nur HIER zentral ändern
const CACHE       = `rechentricks-${APP_VERSION}`;
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./icon.png",
  "./main.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()) // sofort aktiv werden
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    ).then(() => self.clients.claim()) // alle Clients übernehmen
  );
});

// Nachrichten vom Client
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "SKIP_WAITING") {
    self.skipWaiting();
  } else if (msg.type === "GET_VERSION") {
    // Antworte dem Sender (der aktuellen Seite)
    event.source?.postMessage({ type: "VERSION", version: APP_VERSION });
  }
});

// Stale-while-revalidate
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          caches.open(CACHE).then((c) => c.put(req, res.clone()));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
