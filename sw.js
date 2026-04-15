const CACHE = 'brethin-v4';

// index.html은 항상 네트워크 우선
const NETWORK_FIRST = ['index.html', '/'];

// JS/CSS는 캐시 우선 (버전 변경 시 CACHE 버전 올리면 자동 갱신)
const CACHE_FIRST = [
  'css/theme.css','css/base.css','css/tree.css',
  'js/firebase.js','js/state.js','js/app_core.js',
  'js/audio.js','js/train.js','js/tree.js',
  'js/auth.js','js/init.js',
  'manifest.json',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-storage-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CACHE_FIRST.filter(u => !u.startsWith('http') || u.includes('gstatic') || u.includes('cdnjs'))))
      .then(() => self.skipWaiting())
  );
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
  const isNetworkFirst = NETWORK_FIRST.some(p => url.endsWith(p));

  if (isNetworkFirst) {
    // index.html — 네트워크 우선, 실패 시 캐시
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return res; })
        .catch(() => caches.match(e.request))
    );
  } else {
    // JS/CSS/이미지 — 캐시 우선, 없으면 네트워크
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok && e.request.url.startsWith('http')) {
            const c = res.clone();
            caches.open(CACHE).then(ca => ca.put(e.request, c));
          }
          return res;
        });
      })
    );
  }
});
