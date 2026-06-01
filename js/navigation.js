import { speak } from './voice.js';

export const startNavigationMode = (routeResult) => {
    if (!routeResult) return;
    
    // Hitung ETA kasar (asumsi kecepatan 40 km/jam)
    const speedKmH = 40;
    const etaMinutes = Math.ceil((parseFloat(routeResult.distance) / speedKmH) * 60);
    
    speak(`Navigasi dimulai. Jarak perjalanan adalah ${routeResult.distance} kilometer. Waktu tempuh perkiraan ${etaMinutes} menit.`);
    console.log(`Navigasi aktif: ETA ${etaMinutes} mins`);
    
    // Di masa depan: Tambahkan logika untuk mendeteksi kapan harus belok berdasarkan 
    // perbandingan titik GPS saat ini dengan array routeResult.path
};
