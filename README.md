# OpenMap Bogor Navigator (Advanced Edition)

Aplikasi Progressive Web App (PWA) untuk pemetaan dan navigasi *offline* di wilayah Bogor, dirancang untuk performa tinggi di peramban web dan perangkat seluler.

## Fitur Utama Terkini
1. **Render Peta Offline**: Menggunakan MapLibre GL JS membaca arsip `bogor.pmtiles`.
2. **Modular Architecture**: Kode terpisah rapi (ES6 Modules) untuk Routing, GPS, Suara, dan Peta.
3. **A-Star (A*) Routing Engine**: Komputasi rute mencari jalan terpendek 100% diproses di sisi klien menggunakan graf jalanan (`data/graph.json`).
4. **Trip Recorder & GPX Export**: Pelacakan satelit *real-time* yang dapat diekspor menjadi dokumen `.gpx`.
5. **Turn-by-Turn Voice**: Panduan navigasi bersuara menggunakan Web Speech API.

## Struktur Direktori
```text
OpenMap Bogor Navigator/
├── index.html
├── manifest.json
├── sw.js
├── README.md
├── bogor.pmtiles         (Data vektor peta inti)
├── css/
│   └── app.css
├── data/
│   ├── graph.json        (Hasil ekstrak ruas jalan OSM)
│   └── poi.json
└── js/
    ├── app.js            (Inisialisasi Utama)
    ├── map.js            (Render peta & garis)
    ├── routing.js        (Algoritma A*)
    ├── gps.js            (Geolokasi & perekaman)
    ├── search.js         (Mesin pencari teks)
    ├── navigation.js     (Logika ETA & panduan)
    ├── voice.js          (Sintesis Suara)
    ├── storage.js        (Manajemen IndexedDB/Lokal)
    └── export.js         (Kompilator format GPX)
