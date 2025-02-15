const map = L.map("map-container").setView([25.05, 121.55], 12);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  ext: 'png'
}).addTo(map);

const svg = d3.select(map.getPanes().overlayPane).append("svg");

const gDistricts = svg.append("g").attr("class", "leaflet-zoom-hide district-layer");
const gCities = svg.append("g").attr("class", "leaflet-zoom-hide city-layer");
// 新增 POI 圖層
const gPOI = svg.append("g").attr("class", "leaflet-zoom-hide poi-layer");

const transform = d3.geoTransform({
  point: function (x, y) {
    const point = map.latLngToLayerPoint([y, x]);
    this.stream.point(point.x, point.y);
  },
});
const path = d3.geoPath().projection(transform);

let cityFeatures, districtFeatures, regionsCities, regionsDistricts, poiElements;

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

function resetDistricts() {
  if (!districtFeatures) return;

  const bounds = path.bounds({
    type: "FeatureCollection",
    features: districtFeatures,
  });

  gDistricts.attr("transform", `translate(${-bounds[0][0]}, ${-bounds[0][1]})`);
  regionsDistricts.attr("d", path);
}

// 重設 POI 層
function resetPOI() {
  if (!poiElements) return;
  const zoomLevel = map.getZoom();
  const bounds = path.bounds({
    type: "FeatureCollection",
    features: cityFeatures, // 以縣市範圍計算，確保不跑偏
  });

  gPOI.attr("transform", `translate(${-bounds[0][0]}, ${-bounds[0][1]})`);

  poiElements.attr("transform", (d) => {
    const point = map.latLngToLayerPoint([+d.Py, +d.Px]);
    return `translate(${point.x}, ${point.y})`;
  });

  poiElements
  .attr("r", () => {
    switch(zoomLevel){
      case 8:
        return 1
        case 9:
        return 1.5
      case 10:
        return 2
      case 11:
      case 12:
        return 3
      case 13:
      case 14:
        return 5
      case 15:
        return 6
      case 16:
        return 7
      case 17:
        return 8
      case 18:
        return 9
      default:
        return 1
    }
  })
  .attr("stroke-width", () => {
    switch(zoomLevel){
      case 8:
      case 9:
        return 0.5
      case 10:
      case 11:
      case 12:
        return 1
      case 13:
      case 14:
        return 2
      case 15:
        return 3
      case 16:
        return 4
      case 17:
        return 5
      case 18:
        return 6
      default:
        return 0.1
    }
  });
}

// 載入 POI 資料
function loadPOI() {
  gPOI.selectAll("circle").remove(); // 清除舊的 POI

  d3.csv("/asserts/poi.csv").then((rawData) => {
    const zoomLevel = map.getZoom();
    const data = rawData

    poiElements = gPOI
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("class", "poi-marker")
      .attr("r", '1')
      .attr("fill", (d) => {
        let color = "white";
        if(d.Name.indexOf('神社') > 1) color = 'brown'
        if(d.Name.indexOf('廟') > 1) color = 'brown'
        if(d.Name.indexOf('堂') > 1) color = 'brown'
        if(d.Name.indexOf('寺') > 1) color = 'brown'
        if(d.Name.indexOf('宮') > 1) color = 'brown'
        if(d.Name.indexOf('殿') > 1) color = 'brown'
        if(d.Name.indexOf('美術館') > 1) color = 'blue'
        if(d.Name.indexOf('藝文館') > 1) color = 'blue'
        if(d.Name.indexOf('藝術館') > 1) color = 'blue'
        if(d.Name.indexOf('藝文中心') > 1) color = 'blue'
        if(d.Name.indexOf('畫廊') > 1) color = 'blue'
        if(d.Name.indexOf('設計館') > 1) color = 'blue'
        if(d.Name.indexOf('植物園') > 1) color = 'blue'
        if(d.Name.indexOf('文化創意') > 1) color = 'blue'
        if(d.Name.indexOf('文化園區') > 1) color = 'blue'
        if(d.Name.indexOf('文化館') > 1) color = 'blue'
        if(d.Name.indexOf('博物館') > 1) color = 'blue'
        if(d.Name.indexOf('劇場') > 1) color = 'lightblue'
        if(d.Name.indexOf('戲園') > 1) color = 'lightblue'
        if(d.Name.indexOf('戲棚') > 1) color = 'lightblue'
        if(d.Name.indexOf('夜市') > 1) color = 'red'
        if(d.Name.indexOf('商圈') > 1) color = 'red'
        if(d.Name.indexOf('公園') > 1) color = 'green'
        if(d.Name.indexOf('步道') > 1) color = 'lightgreen'
        if(d.Name.indexOf('古道') > 1) color = 'lightgreen'
        return color
      })
      .style("opacity", 0.5)
      .attr("stroke", 'rgba(255, 255, 0, 0.5)')
      .attr("stroke-width", '1');

    resetPOI(); // 確保初始時正確計算 POI 位置

    poiElements.on("click", (e, d) => {
      console.log(d)
    });
  });
}

map.on("zoomend", () => {
  resetCities();
  resetDistricts();
  resetPOI();
});

map.on("moveend", () => {
  resetPOI();
});

loadPOI();
