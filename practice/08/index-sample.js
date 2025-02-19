const map = L.map("map-container").setView([25.05, 121.55], 12);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  ext: 'png'
}).addTo(map);


/**
 * case1: 建立 D3.js 的圖層，並透過 <g> 標籤確保後續不同圖層資料不會互相覆蓋
 */

const svg = d3.select(map.getPanes().overlayPane).append("svg");
const gDistricts = svg.append("g").attr("class", "leaflet-zoom-hide district-layer");
const gCities = svg.append("g").attr("class", "leaflet-zoom-hide city-layer");


/**
 * case2: D3.js 投影設定，將經緯度座標轉換為畫布上的點
 * - geoTransform() 用於定義 D3.js 投影的轉換函數
 * - latLngToLayerPoint() 透過 Leaflet 的 API 將經緯度座標轉換為畫布上的點
 * - stream 則是將轉換後的點繪製到畫布上
 * - geoPath() 用於定義地理路徑產生器，並設定投影函數
 */

const transform = d3.geoTransform({
  point: function (x, y) {
    const point = map.latLngToLayerPoint([y, x]);
    this.stream.point(point.x, point.y);
  },
});
const path = d3.geoPath().projection(transform);

let cityFeatures, districtFeatures, regionsCities, regionsDistricts;

/**
 * case3: 載入縣市資料
 * topojson.feature() 用於將 TopoJSON 物件轉換為 GeoJSON 物件
 */
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

/**
 * case4: 重設縣市圖層
 * path.bounds() 用於計算資料的範圍
 * e.g. [[-100, -50], [50, 100]]
 * 左上角座標為 bounds[0]，右下角座標為 bounds[1]
 * 
 * 1. 將 SVG 圖層的寬高設定為資料範圍的寬高並對齊左上角
 * 2. 將 縣市 圖層也對齊左上角
 */
function resetCities() {
  if (!cityFeatures) return;

  const bounds = path.bounds({
    type: "FeatureCollection",
    features: cityFeatures,
  });

  const top = bounds[0][1];
  const left = bounds[0][0];
  const right = bounds[1][0];
  const bottom = bounds[1][1];

  svg
    .attr("width", right - left)
    .attr("height", bottom - top)
    .style("left", `${left}px`)
    .style("top", `${top}px`);

  gCities.attr("transform", `translate(${-left}, ${-top})`);
  regionsCities.attr("d", path);
}

/**
 * case5: 載入行政區資料
 */
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

/**
 * case6: 重設行政區圖層
 */
function resetDistricts() {
  if (!districtFeatures) return;

  const bounds = path.bounds({
    type: "FeatureCollection",
    features: districtFeatures,
  });

  const top = bounds[0][1];
  const left = bounds[0][0];

  gDistricts.attr("transform", `translate(${-left}, ${-top})`);
  regionsDistricts.attr("d", path);
}

/**
 * case7: 縮放地圖時重設縣市與行政區圖層
 */
map.on("zoomend", () => {
  resetCities();
  resetDistricts();
});