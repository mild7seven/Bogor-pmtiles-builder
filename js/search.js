let poiData = [];

export const initSearch = async () => {
    try {
        const res = await fetch('data/poi.json');
        poiData = await res.json();
    } catch (e) {
        console.error("Gagal memuat POI", e);
    }
};

export const searchPOI = (query) => {
    if (!query || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    
    return poiData.filter(item => 
        item.name.toLowerCase().includes(lowerQuery)
    );
};
