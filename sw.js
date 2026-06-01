const CACHE_NAME = 'omb-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/app.css',
    './js/app.js',
    './js/map.js',
    './js/gps.js',
    './js/search.js',
    './js/routing.js',
    './js/navigation.js',
    './js/voice.js',
    './js/storage.js',
    './js/export.js',
    './data/poi.json',
    './data/graph.json'
];

// Instalasi dan Cache Aset
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Hapus Cache Lama
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

// Intersepsi Fetch
self.addEventListener('fetch', event => {
    // BYPASS: Jangan intercept Range Requests, biarkan browser menanganinya
    // Ini sangat krusial agar file .pmtiles bisa dibaca sebagian-sebagian.
    if (event.request.headers.has('range')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        }).catch(() => {
            // Fallback error handling (misalnya jika jaringan mati total)
            console.error("Gagal memuat:", event.request.url);
        })
    );
});
