self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("rechentricks-v2").then((cache) =>
      cache.addAll([
        "./",              // wichtig für die Root-URL
        "./index.html",
        "./manifest.json",
        "./service-worker.js",
        "./icon.png",
        "./main.js"
        // ggf. "style.css", Fonts, weitere Icons etc.
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhitelist = ["rechentricks-v2"];
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
