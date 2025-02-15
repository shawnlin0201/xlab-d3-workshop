const map = L.map("map-container").setView([25.05, 121.55], 12);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  ext: 'png'
}).addTo(map);

// 建立 D3.js 的 `svg` 層
const svg = d3.select(map.getPanes().overlayPane).append("svg");

// 確保不同圖層不會互相覆蓋
const gDistricts = svg.append("g").attr("class", "leaflet-zoom-hide district-layer");
const gCities = svg.append("g").attr("class", "leaflet-zoom-hide city-layer");

// D3.js 投影設定
const transform = d3.geoTransform({
  point: function (x, y) {
    const point = map.latLngToLayerPoint([y, x]);
    this.stream.point(point.x, point.y);
  },
});
const path = d3.geoPath().projection(transform);

let cityFeatures, districtFeatures, regionsCities, regionsDistricts, poiElements;

// 載入縣市資料
d3.json("/asserts/city.json").then((data) => {
  cityFeatures = topojson.feature(data, data.objects.COUNTY_MOI_1130718).features;

  regionsCities = gCities
    .selectAll("path")
    .data(cityFeatures)
    .join("path")
    .attr("fill", "rgba(200, 200, 200, 0)")
    .attr("stroke", "rgba(255, 255, 255, 0.2)")
    .attr("stroke-width", 2);

  resetCities();
});

// 載入行政區資料
d3.json("/asserts/district.json").then((data) => {
  districtFeatures = topojson.feature(data, data.objects.TOWN_MOI_1131028).features;

  regionsDistricts = gDistricts
    .selectAll("path")
    .data(districtFeatures)
    .join("path")
    .attr("fill", "rgba(200, 200, 200, 0)")
    .attr("stroke", "rgba(255, 255, 255, 0.2)")
    .attr("stroke-width", 0.5);

  resetDistricts();
});

// 重設縣市圖層
function resetCities() {
  if (!cityFeatures) return;

  const bounds = path.bounds({
    type: "FeatureCollection",
    features: cityFeatures,
  });
  const topLeft = bounds[0];
  const bottomRight = bounds[1];

  svg
    .attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", `${topLeft[0]}px`)
    .style("top", `${topLeft[1]}px`);

  gCities.attr("transform", `translate(${-topLeft[0]}, ${-topLeft[1]})`);
  regionsCities.attr("d", path);
}

// 重設行政區圖層
function resetDistricts() {
  if (!districtFeatures) return;

  const bounds = path.bounds({
    type: "FeatureCollection",
    features: districtFeatures,
  });

  gDistricts.attr("transform", `translate(${-bounds[0][0]}, ${-bounds[0][1]})`);
  regionsDistricts.attr("d", path);
}

// 監聽縮放與移動事件
map.on("zoomend", () => {
  resetCities();
  resetDistricts();
});