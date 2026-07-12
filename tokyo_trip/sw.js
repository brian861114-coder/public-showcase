/* 部署後請把 CACHE 版本號 +1，舊快取才會被清掉 */
const CACHE = 'tokyo-trip-gh-v16';
const ASSETS = [
  './',
  './index.html',
  './transportation.html',
  './attractions.html',
  './preparation.html',
  './tools.html',
  './tokyo_rail.html',
  './fuji_hakone_rail.html',
  './trip_timeline.html',
  './packing_checklist.html',
  './transportation_guide.html',
  './attractions_guide.html',
  './japanese_phrases.html',
  './emergency_guide.html',
  './budget.html',
  './search.html',
  './assets/icon.svg',
  './assets/icons.svg',
  './assets/noise.svg',
  './assets/images/kawaguchiko-hero.webp',
  './assets/images/hakone-forest.webp',
  './assets/images/tokyo-rail.webp',
  './assets/images/generated/trip-hero.webp',
  './assets/images/generated/hakone-forest.webp',
  './assets/images/generated/tokyo-rail-blue-hour.webp',
  './assets/images/generated/travel-preparation.webp',
  './assets/images/map-icons/mount-fuji.png',
  './assets/images/map-icons/lake-kawaguchiko.png',
  './assets/images/map-icons/tenjo-ropeway.png',
  './assets/images/map-icons/owakudani.png',
  './assets/images/map-icons/lake-ashi.png',
  './assets/images/map-icons/gotemba-station.png',
  './assets/images/map-icons/chureito-pagoda.png',
  './assets/images/map-icons/oishi-park.png',
  './assets/images/map-icons/hakone-torii.png',
  './assets/images/map-icons/sengokuhara.png',
  './assets/site.css',
  './assets/site.js',
  './assets/portal.css',
  './assets/portal.js',
  './assets/trip-data.js',
  './assets/attraction-resources.js',
  './manifest.webmanifest'
];

function isHTML(request) {
  if (request.mode === 'navigate') return true;
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/html')) return true;
  const url = new URL(request.url);
  return url.pathname.endsWith('.html') || url.pathname.endsWith('/');
}

function putCache(request, response) {
  if (!response || !response.ok) return;
  const copy = response.clone();
  caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {});
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;

  // HTML：網路優先，確保 GitHub Pages 更新後能馬上看到新內容；離線才用快取
  if (isHTML(request)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          putCache(request, response);
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // 其他靜態檔：快取優先，背景更新（離線友善）
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(response => {
          putCache(request, response);
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
