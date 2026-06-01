export const save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const load = (key, defaultValue = null) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
};

// Opsional: IndexedDB untuk cache yang lebih besar jika dibutuhkan nanti
export const initDB = () => {
    const DB_NAME = 'omb_db';
    indexedDB.open(DB_NAME, 1).onupgradeneeded = e => {
        e.target.result.createObjectStore('favorites', { keyPath: 'id' });
        e.target.result.createObjectStore('trips', { autoIncrement: true });
    };
};
