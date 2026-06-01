// NAIKKAN VERSI CACHE (Menjadi v4)
// Ini akan memaksa browser menghapus file lama dan mengunduh ulang skrip JS yang baru kita perbaiki
const CACHE_NAME = 'omb-cache-v4'; 
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
    './data/graph.json',
    './manifest.json'
];

// 1. Instalasi Service Worker & Menyimpan Cache Baru
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching files...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting()) // Memaksa SW baru untuk langsung aktif
    );
});

// 2. Aktivasi & Menghapus Cache Versi Lama (v1, v2, v3)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => {
                console.log('[Service Worker] Menghapus cache lama:', key);
                return caches.delete(key);
            })
        ))
    );
    self.clients.claim(); // Mengambil alih kontrol klien yang sedang terbuka
});

// 3. Intersepsi Jaringan (Fetch)
self.addEventListener('fetch', event => {
    // BYPASS PENTING: Jangan sentuh Range Requests untuk PMTiles!
    // Peta vektor menggunakan ini untuk memotong file secara efisien.
    if (event.request.headers.has('range')) {
        return; 
    }
    
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            // Jika file ada di cache, gunakan itu (Cepat & Offline)
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Jika tidak ada di cache, ambil dari internet
            return fetch(event.request).then(networkResponse => {
                return networkResponse;
            }).catch(error => {
                console.error("[Service Worker] Gagal memuat dari jaringan/offline:", event.request.url);
                // Di masa depan Anda bisa menambahkan fallback UI offline di sini
            });
        })
    );
});
