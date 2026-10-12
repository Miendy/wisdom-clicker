/* Wisdom Clicker — offline cache */
const VERSION = "v1";
const CACHE = `wisdom-clicker-${VERSION}`;

/* Everything the game needs to boot offline.
   Bump VERSION when you ship an update so clients re-fetch. */
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./wisdoms.txt",
  "./manifest.json",
  "./img/wisdom_cat.jpg",
  "./img/silly_cat.jpeg",
  "./img/mittens.jpeg",
  "./img/hareld.jpg",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.all(
        ASSETS.map((url) =>
          fetch(url)
            .then((res) => {
              if (res.ok) return cache.put(url, res);
              console.warn("SW: skipping", url, res.status);
            })
            .catch((err) => console.warn("SW: failed to cache", url, err))
        )
      );
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  /* Only handle GET, same-origin. Let cross-origin requests pass through. */
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        /* Serve from cache, refresh in background */
        fetch(req).then((fresh) => {
          if (fresh && fresh.ok) caches.open(CACHE).then((c) => c.put(req, fresh.clone()));
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});