/**
 * todo:
 * 點擊縣市，顯示該縣市的景點
 * 點擊縣市，畫面移動到該縣市
 * 初始畫面顯示特定縣市
 * 點擊景點時，highlight 該 circle
 */

const map = L.map("map-container").setView([23.5, 121], 8); // 設定台灣為中心點
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// 建立 D3.js 的 `svg` 圖層，疊加在 Leaflet 上
const svg = d3.select(map.getPanes().overlayPane).append("svg");
const g = svg.append("g").attr("class", "leaflet-zoom-hide");

// 建立 D3.js 投影 (Leaflet 需要 `d3.geoTransform`)
const transform = d3.geoTransform({
  point: function (x, y) {
    const point = map.latLngToLayerPoint([y, x]);
    this.stream.point(point.x, point.y);
  },
});

const path = d3.geoPath().projection(transform);

// 載入台灣行政區 TopoJSON
d3.json("/asserts/taiwan.json").then((data) => {
  const features = topojson.feature(
    data,
    data.objects.COUNTY_MOI_1130718
  ).features;

  // 繪製台灣行政區
  const regions = g
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("fill", "rgba(255, 255, 255, 0.2)")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // 加入縣市標籤
  const labels = g
    .selectAll("text")
    .data(features)
    .join("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")


  // 更新地圖時，確保 SVG 不會被裁切
  function reset() {
    // 先清空原本的 POI 圖層
    g.selectAll("circle").remove();

    const bounds = path.bounds({ type: "FeatureCollection", features });
    const topLeft = bounds[0];
    const bottomRight = bounds[1];

    // 設定 SVG 的大小，使其不會被裁切
    svg
      .attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", `${topLeft[0]}px`)
      .style("top", `${topLeft[1]}px`);

    // 確保行政區不會被裁切
    g.attr("transform", `translate(${-topLeft[0]}, ${-topLeft[1]})`);

    // 更新行政區路徑
    regions.attr("d", path);
    labels.attr("transform", (d) => `translate(${path.centroid(d)})`);

    // 加入 POI 圖層
    d3.csv("/asserts/poi.csv").then((rawData) => {
      // 取得當下縮放等級
      const zoomLevel = map.getZoom();
      console.log('zoomLevel',zoomLevel)
      const data = rawData.filter(d => d.Region === '新北市') // todo: 這裡可以改成選擇的縣市
      const poi = g
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "poi-marker")
        .attr("r", () => {
          switch(zoomLevel){
            case 8:
            case 9:
              return 2
            case 10:
            case 11:
            case 12:
              return 4
            case 13:
            case 14:
              return 7
            case 15:
              return 8
            case 16:
              return 9
            case 17:
              return 10
            case 18:
              return 11
            default:
              return 1
          }
        })
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
        .attr("stroke", "black")
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
        })
        .attr("transform", (d) => {
          const point = map.latLngToLayerPoint([d.Py, d.Px]);
          return `translate(${point.x}, ${point.y})`;
        });

      poi.on("click", (e, d) => {
        console.log(d)
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

  // 監聽地圖縮放 & 移動，確保行政區正確對齊
  map.on("zoomend", reset);
  
  reset(); // 初始更新
});
