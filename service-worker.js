// service-worker.js
const CACHE_VERSION = "v6";                // ← nur hier hochzählen
const CACHE = `rechentricks-${CACHE_VERSION}`;
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
      .then(() => self.skipWaiting())     // sofort aktiv werden
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k !== CACHE ? caches.delete(k) : null))
      )
    ).then(() => self.clients.claim())    // alle Clients übernehmen
  );
});

// Nachrichten vom Client (Seite)
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (data.type === "GET_VERSION") {
    // Version an alle offenen Clients schicken
    self.clients.matchAll({ includeUncontrolled: true, type: "window" })
      .then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: "VERSION", version: CACHE_VERSION })
        );
      });
  }
});

// Stale‑while‑revalidate
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const resClone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, resClone));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
