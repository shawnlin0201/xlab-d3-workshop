const map = L.map("map-container").setView([23.5, 121], 8);
// const map = L.map("map-container").setView([25.05, 121.55], 12);


/** 圖磚供應商
 * https://leaflet-extras.github.io/leaflet-providers/preview/
 */

// 夜間模式圖磚
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  ext: 'png'
}).addTo(map);