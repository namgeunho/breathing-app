const CACHE = 'brethin-v7';

self.addEventListener('install', e => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // GET 요청만 처리, chrome-extension 등 비http 스킴 제외
  if (e.request.method !== 'GET') return;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // 유효한 응답이면 캐시 갱신
        if (res.ok && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
