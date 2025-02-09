const width = 600;
const height = 400; 
const svgPaddingLeft = 150; // 增加 padding 避免軸線擠在邊緣
const svgPaddingBottom = 50; // 增加 padding 避免軸線擠在邊緣
const svg = d3.create("svg").attr("width", width).attr("height", height);
let data = [
  { color:'blue', text: '招福小八', price: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6500, 8000] },
  { color:'green', text: '聖誕樹吉伊', price: [2000, 1800, 1600, 1500, 1600, 1700, 1800, 2000, 2200, 2300, 2400, 2500] },
  { color:'orange', text: '惡魔烏薩奇', price: [2000, 2200, 2400, 2600, 2800, 3200, 3600, 1800, 1400, 1200, 1000, 1000] },
];

container.append(svg.node());

const months = d3.range(12).map(i => `${(i + 1).toString().padStart(2, '0')}月`);
const maxPrice = d3.max(data.flatMap(d => d.price));
const minPrice = d3.min(data.flatMap(d => d.price));

/**
 * case1: 繪製軸線
 * 1. 透過 d3.scalePoint() 設定 x, y 軸的刻度
 * 2. 透過 d3.scaleLinear() 設定 y 軸的刻度
 * 3. 透過 d3.axisBottom() 與 d3.axisLeft() 加入 x 軸與 y 軸
 */

// 讓 x 軸刻度對應 12 個月份
const xScale = d3.scalePoint()
  .domain(months)
  .range([svgPaddingBottom, width - svgPaddingLeft]);

// 讓 y 軸刻度對應最高價與最低價
const yScale = d3.scaleLinear()
  .domain([maxPrice + 1000, 0])  // 最高價放上面
  .range([svgPaddingBottom, height - svgPaddingBottom]);

// 繪製 x 軸
svg.append("g")
  .attr("transform", `translate(0, ${height - svgPaddingBottom})`)
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .style("text-anchor", "middle");

// 繪製 y 軸
svg.append("g")
  .attr("transform", `translate(${svgPaddingBottom}, 0)`)
  .call(d3.axisLeft(yScale));

/**
 * case2: 繪製折線圖
 * 1. 透過 d3.line() 設定折線的 x, y 座標
 * 2. 透過 d3.scaleOrdinal() 設定顏色
 * 3. 透過 d3.append("g") 與 d3.join("path") 繪製折線
 */

// 定義折線的 x, y 座標
const line = d3.line()
.x((d, i) => xScale(months[i])) // 使用對應的月份標籤
.y(d => yScale(d));

// 繪製折線
svg.append("g")
.selectAll("path")
.data(data)
.join("path")
.attr("d", d => line(d.price))
.attr("fill", "none")
.attr("stroke", (d, i) => {
  return d.color;
})
.attr("stroke-width", 2);


/**
 * case3: 繪製圖例
 * 1. 繪製圖例容器
 * 2. 繪製圖例方塊
 * 3. 繪製圖例文字
 */

// 繪製圖例容器
const legend = svg.append("g")
  .attr("transform", `translate(${width - svgPaddingLeft + 20}, 50)`)
  .selectAll("g")
  .data(
    data.map(d => d.text))
  .join("g")
  .attr("transform", (d, i) => `translate(0, ${i * 30})`);

// 繪製圖例方塊
legend.append("rect")
  .attr("x", 0)
  .attr("width", 16)
  .attr("height", 16)
  .attr("fill", (d, i) => {
    return data[i].color;
  });

// 繪製圖例文字
legend.append("text")
  .attr("x", 18)
  .attr("y", 12)
  .text(d => d)
  .attr("fill", "black")
  .style("font-size", "16px")
  .style("text-anchor", "start");

/**
 * case4: 加入圓點與提示框
 * 1. 透過 d3.append("g") 與 d3.join("circle") 繪製圓點
 * 2. 透過 d3.append("g") 與 d3.join("text") 繪製提示框
 */

// 繪製圓點
svg.append("g")
  .selectAll("g")
  .data(data)
  .join("g")
  .selectAll("circle")
  .data(d => d.price)
  .join("circle")
  .attr("cx", (d, i) => xScale(months[i]))
  .attr("cy", d => yScale(d))
  .attr("r", 5)
  .attr("fill", (d, i, el) => el[i].parentNode.__data__.color);

// 繪製提示框
const tooltip = svg
    .append("g")
    .style("display", "none");

tooltip.append("rect")
    .attr("width", 100)
    .attr("height", 50)
    .attr("fill", "white")
    .style("opacity", 0.5);

tooltip.append("text")
    .attr("x", 50)
    .attr("y", 25)
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle");

svg.selectAll("circle")
    .on("mouseover", function (event, d) {
        const [x, y] = d3.pointer(event);
        tooltip.attr("transform", `translate(${x}, ${y})`);
        tooltip.select("text").text(d);
        tooltip.style("display", null);
    })
    .on("mouseout", function () {
        tooltip.style("display", "none");
    });
