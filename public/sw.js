const cacheName = "Kry's-Todo-PWA-Cache"
const appShellFiles = [
    "/index.html",
    "/checkmark.svg",
    "/chevron-down.svg",
    "/chevron-up.svg",
    "/folder-open.svg",
    "/plus-small.svg",
    "/x.svg",
    "/ellipsis-horizontal.svg",
]

const contentToCache = appShellFiles;

self.addEventListener('install', (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            await cache.addAll(contentToCache);
        })()
    );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {

    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            if (r) {
                return r;
            }
            const response = await fetch(e.request);

            const cache = await caches.open(cacheName);
            cache.put(e.request, response.clone());
            return response;
        })()
    );
});