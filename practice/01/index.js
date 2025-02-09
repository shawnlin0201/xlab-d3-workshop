const width = 400;
const height = 300;
const svg = d3.create("svg").attr("width", width).attr("height", height);

container.append(svg.node());

/* case1: 練習畫布與矩形畫荷蘭國旗 */
svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "red");


/* case2: 練習透過變數與比例畫圖 */
