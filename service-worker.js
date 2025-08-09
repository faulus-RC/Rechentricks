// service-worker.js
const APP_VERSION = "v7";
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

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "SKIP_WAITING") {
    self.skipWaiting();
  } else if (msg.type === "GET_VERSION") {
    event.source?.postMessage({ type: "VERSION", version: APP_VERSION });
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Nur GET cachen
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);

    // 1) Sofort aus Cache, wenn vorhanden
    const cached = await cache.match(req);
    
    // 2) Parallel Netzwerk anwerfen und (falls ok) aktualisieren
    const networkPromise = fetch(req).then((res) => {
      // Nur sinnvolle Antworten cachen
      if (!res || res.status !== 200 || res.type !== "basic") {
        return res; // trotzdem an Client zurückgeben
      }
      // Wichtig: vor jeglicher Nutzung klonen
      const copy = res.clone();
      cache.put(req, copy).catch(() => { /* ignore */ });
      return res; // Original an Client
    }).catch(() => {
      // offline/Fehler: nichts tun, wir fallen ggf. auf cached zurück
      return undefined;
    });

    // 3) Bevorzugt Cache, sonst Netzwerk
    return cached || networkPromise || new Response("", { status: 504, statusText: "Offline" });
  })());
});
