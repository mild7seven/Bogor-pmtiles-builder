export const exportToGPX = (trackPoints) => {
    if (!trackPoints || trackPoints.length === 0) {
        alert("Tidak ada data rute untuk diekspor!");
        return;
    }

    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OpenMap Bogor Navigator">
  <trk>
    <name>Trip Recorder ${new Date().toLocaleDateString()}</name>
    <trkseg>\n`;

    trackPoints.forEach(pt => {
        gpx += `      <trkpt lat="${pt.lat}" lon="${pt.lng}">
        <time>${pt.time}</time>
      </trkpt>\n`;
    });

    gpx += `    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OMB_Trip_${new Date().getTime()}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
