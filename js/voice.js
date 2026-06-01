export const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    
    // Batalkan suara yang sedang berjalan agar tidak menumpuk
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Bahasa Indonesia
    utterance.rate = 0.9;     // Kecepatan bicara (sedikit lambat agar jelas)
    
    window.speechSynthesis.speak(utterance);
};
