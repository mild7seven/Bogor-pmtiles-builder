import { initDB } from './storage.js';
import { initMap, drawRouteOnMap, clearRoute, map } from './map.js';
import { loadGraph, calculateRoute } from './routing.js';
import { initSearch, searchPOI } from './search.js';
import { initGPS, toggleFollowMe, disableFollowOnDrag, recordedPath } from './gps.js';
import { exportToGPX } from './export.js';
import { startNavigationMode } from './navigation.js';

navigator.serviceWorker?.register('sw.js');

document.addEventListener('DOMContentLoaded', async () => {
    initDB();
    const myMap = initMap();
    await loadGraph();
    await initSearch();
    
    myMap.on('load', () => {
        initGPS();
        
        let startPoint = null;
        let endPoint = null;
        let mapMarkers = [];

        // 1. LOGIKA KLIK PETA & RESET RUTE
        myMap.on('click', (e) => {
            const { lat, lng } = e.lngLat;
            
            // Jika belum ada tujuan atau sudah ada rute lengkap sebelumnya
            if (!startPoint || (startPoint && endPoint)) {
                startPoint = {lat, lng};
                endPoint = null;
                
                // Hapus semua marker lama dan bersihkan garis rute dari peta
                mapMarkers.forEach(m => m.remove());
                mapMarkers = [];
                clearRoute(); 

                const m = new maplibregl.Marker({color: 'green'}).setLngLat([lng, lat]).addTo(myMap);
                mapMarkers.push(m);
            } 
            // Jika titik awal sudah ada, set tujuan
            else if (!endPoint) {
                endPoint = {lat, lng};
                const m = new maplibregl.Marker({color: 'red'}).setLngLat([lng, lat]).addTo(myMap);
                mapMarkers.push(m);
                
                // Hitung dan gambar rute
                const rute = calculateRoute(startPoint.lat, startPoint.lng, endPoint.lat, endPoint.lng);
                if (rute) {
                    drawRouteOnMap(rute.path);
                    startNavigationMode(rute);
                } else {
                    alert("Rute tidak ditemukan! Lokasi mungkin di luar jangkauan jaringan jalan.");
                }
            }
        });

        // 2. LOGIKA GPS (FOLLOW ME)
        const btnGPS = document.getElementById('loc');
        if (btnGPS) {
            btnGPS.addEventListener('click', () => toggleFollowMe(btnGPS));
            myMap.on('dragstart', () => disableFollowOnDrag(btnGPS));
        }

        // 3. LOGIKA AUTOCOMPLETE PENCARIAN POI
        const searchInput = document.getElementById('q');
        const autocompleteList = document.getElementById('autocomplete-list'); // Diambil dari index.html

        if (searchInput && autocompleteList) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value;
                autocompleteList.innerHTML = ''; // Bersihkan daftar lama
                if (!val) return;

                const results = searchPOI(val);
                
                results.forEach(poi => {
                    const div = document.createElement('div');
                    div.innerHTML = `<strong>${poi.name}</strong>`;
                    
                    div.addEventListener('click', () => {
                        searchInput.value = poi.name; // Isi form dengan nama POI
                        autocompleteList.innerHTML = ''; // Tutup dropdown
                        
                        // Terbang ke lokasi dan beri marker oranye
                        myMap.flyTo({ center: [poi.lng, poi.lat], zoom: 16 });
                        const m = new maplibregl.Marker({color: 'orange'}).setLngLat([poi.lng, poi.lat]).addTo(myMap);
                        mapMarkers.push(m); // Masukkan ke daftar marker agar bisa di-reset saat klik tempat lain
                    });
                    autocompleteList.appendChild(div);
                });
            });

            // Tutup dropdown jika pengguna klik di luar area pencarian
            document.addEventListener('click', (e) => {
                if (e.target !== searchInput) autocompleteList.innerHTML = '';
            });
        }
        
        // 4. LOGIKA EKSPOR GPX
        const btnExport = document.getElementById('btn-export');
        if (btnExport) {
            btnExport.addEventListener('click', () => exportToGPX(recordedPath));
        }
    });
});
