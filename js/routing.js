let graph = {};

export const loadGraph = async () => {
    try {
        const res = await fetch('data/graph.json');
        graph = await res.json();
        console.log("Graph dimuat:", Object.keys(graph).length, "nodes");
    } catch (e) { console.error("Error loading graph", e); }
};

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

export const getNearestNode = (lat, lng) => {
    let nearestId = null, minDistance = Infinity;
    for (let id in graph) {
        // Membaca format asli: graph[id].lat dan graph[id].lng
        const dist = haversine(lat, lng, graph[id].lat, graph[id].lng);
        if (dist < minDistance) { minDistance = dist; nearestId = id; }
    }
    return nearestId;
};

export const calculateRoute = (startLat, startLng, endLat, endLng) => {
    const startId = getNearestNode(startLat, startLng);
    const endId = getNearestNode(endLat, endLng);
    
    if (!startId || !endId) return null;

    let openSet = [{ id: startId, f: 0 }];
    const cameFrom = {}, gScore = { [startId]: 0 };

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift().id;

        if (current === endId) {
            const path = [[graph[current].lng, graph[current].lat]];
            let curr = current;
            while (cameFrom[curr]) {
                curr = cameFrom[curr];
                path.unshift([graph[curr].lng, graph[curr].lat]);
            }
            return { distance: gScore[endId].toFixed(2), path };
        }

        const edges = graph[current].edges || [];
        for (let edge of edges) {
            const neighbor = edge.to;
            const weight = edge.weight;
            
            // Validasi: Abaikan jalur jika node tetangganya terpotong/tidak ada di JSON
            if (!graph[neighbor]) continue; 

            const tentativeGScore = gScore[current] + weight;

            if (tentativeGScore < (gScore[neighbor] || Infinity)) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                const f = tentativeGScore + haversine(graph[neighbor].lat, graph[neighbor].lng, graph[endId].lat, graph[endId].lng);
                openSet.push({ id: neighbor, f });
            }
        }
    }
    return null;
};
