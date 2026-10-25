const CACHE_NAME = 'crm-pro-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
