// GANTI KE v3 AGAR BROWSER MEMUAT ULANG SCRIPT JS YANG BARU KITA PERBAIKI
const CACHE_NAME = 'omb-cache-v3'; 
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

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.headers.has('range')) {
        return; // Biarkan PMTiles menangani potongannya sendiri
    }
    
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            // Tambahkan return fetch agar file yang terlewat tetap diunduh dari jaringan
            return fetch(event.request).catch(error => {
                console.error("Gagal memuat dari jaringan/offline:", event.request.url);
            });
        })
    );
});
