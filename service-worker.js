// service-worker.js
const CACHE = "rechentricks-v4"; // <— neue Version
const ASSETS = [
  "./",             // Root
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
    ).then(() => self.clients.claim()) // alle Clients kontrollieren
  );
});

// Stale-while-revalidate: schnell aus Cache, im Hintergrund aktualisieren
self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        // nur erfolgreiche Responses cachen
        if (res && res.status === 200 && res.type === "basic") {
          const resClone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, resClone));
        }
        return res;
      }).catch(() => cached); // offline → aus Cache, wenn vorhanden
      return cached || fetchPromise;
    })
  );
});
