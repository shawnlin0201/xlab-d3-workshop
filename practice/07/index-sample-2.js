/**
 * todo:
 * 點擊縣市，顯示該縣市的景點
 * 點擊縣市，畫面移動到該縣市
 * 初始畫面顯示特定縣市
 * 點擊景點時，highlight 該 circle
 */

const area = [
  "連江縣",
  "宜蘭縣",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "屏東縣",
  "基隆市",
  "臺北市",
  "新北市",
  "臺中市",
  "臺南市",
  "桃園市",
  "苗栗縣",
  "嘉義市",
  "嘉義縣",
  "金門縣",
  "高雄市",
  "臺東縣",
  "花蓮縣",
  "澎湖縣",
  "新竹市",
  "新竹縣",
];

const map = L.map("map-container").setView([23.5, 121], 8);

// https://leaflet-extras.github.io/leaflet-providers/preview/

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "&copy; OpenStreetMap contributors",
// }).addTo(map);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

// 建立 D3.js 的 `svg` 層
const svg = d3.select(map.getPanes().overlayPane).append("svg");

// **不同圖層** 確保不互相覆蓋
const gCities = svg.append("g").attr("class", "leaflet-zoom-hide city-layer");
const gDistricts = svg
  .append("g")
  .attr("class", "leaflet-zoom-hide district-layer");
const gPOI = svg.append("g").attr("class", "leaflet-zoom-hide poi-layer");

// D3.js 投影設定
const transform = d3.geoTransform({
  point: function (x, y) {
    const point = map.latLngToLayerPoint([y, x]);
    this.stream.point(point.x, point.y);
  },
});
const path = d3.geoPath().projection(transform);

let cityFeatures, districtFeatures, regionsCities, regionsDistricts;

// 載入縣市資料
d3.json("/asserts/city.json").then((data) => {
  cityFeatures = topojson.feature(
    data,
    data.objects.COUNTY_MOI_1130718
  ).features;

  regionsCities = gCities
    .selectAll("path")
    .data(cityFeatures)
    .join("path")
    .attr("fill", (d, i, a) => {
      const color = d3.interpolateRainbow(i / a.length);
      return color.replace("rgb", "rgba").replace(")", ", 0.1)");
    })
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  resetCities();
});

// 載入行政區資料
d3.json("/asserts/district.json").then((data) => {
  districtFeatures = topojson.feature(
    data,
    data.objects.TOWN_MOI_1131028
  ).features;

  regionsDistricts = gDistricts
    .selectAll("path")
    .data(districtFeatures)
    .join("path")
    .attr("fill", "rgba(200, 200, 200, 0.2)") // 區分縣市與行政區
    .attr("stroke", "black")
    .attr("stroke-width", 0.1);

  resetDistricts();
});

// **重設縣市圖層**
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

// **重設行政區圖層**
function resetDistricts() {
  if (!districtFeatures) return;

  const bounds = path.bounds({
    type: "FeatureCollection",
    features: districtFeatures,
  });

  gDistricts.attr("transform", `translate(${-bounds[0][0]}, ${-bounds[0][1]})`);
  regionsDistricts.attr("d", path);
}

// **載入 POI 資料**
function loadPOI(selectedCity) {
  gPOI.selectAll("circle").remove(); // 清除舊的 POI

  d3.csv("/asserts/poi.csv").then((rawData) => {
    const zoomLevel = map.getZoom();
    const data = rawData.filter((d) => d.Region === selectedCity); // 選擇縣市

    const poi = gPOI
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", "poi-marker")
      .attr("r", () => (zoomLevel >= 15 ? 8 : zoomLevel >= 12 ? 5 : 3))
      .attr("fill", "blue")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("transform", (d) => {
        const point = map.latLngToLayerPoint([d.Py, d.Px]);
        return `translate(${point.x}, ${point.y})`;
      });

    poi.on("click", (e, d) => {
      document.querySelector("#tooltip-container").innerHTML = `
        <div class="tooltip-title">${d.Name}</div>
        <div class="tooltip-address">${d.Add}</div>
        <div class="tooltip-open">${d.Opentime}</div>
        <div class="tooltip-description">${d.Travellinginfo}</div>
        <div class="tooltip-phone">電話：${d.Tel}</div>
        <div class="tooltip-image-container">
            <img class="tooltip-image" src="${d.Picture1}">
            <img class="tooltip-image" src="${d.Picture2}">
            <img class="tooltip-image" src="${d.Picture3}">
        </div>
      `;
    });
  });
}

// **監聽縮放事件**
map.on("zoomend", () => {
  resetCities();
  resetDistricts();
});

// **點擊縣市時顯示 POI**
regionsCities.on("click", (e, d) => {
  loadPOI(d.properties.COUNTYNAME);
});
