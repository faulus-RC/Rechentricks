// service-worker.js
const APP_VERSION = "v10.6";
const CACHE = `rechentricks-${APP_VERSION}`;
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
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

// Optional: für Versionsanzeige / SkipWaiting
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "SKIP_WAITING") self.skipWaiting();
  if (msg.type === "GET_VERSION") event.source?.postMessage({ type: "VERSION", version: APP_VERSION });
});

// 📦 Cache-first, Network-Fallback (keine dynamische Cache-Aktualisierung)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    if (cached) return cached;

    try {
      const res = await fetch(event.request);
      return res; // (Kein put in Cache nötig, Install hat alles)
    } catch {
      // Offline & nicht im Cache
      return new Response("", { status: 504, statusText: "Offline" });
    }
  })());
});
