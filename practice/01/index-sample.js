const width = 400;
const height = 300;
const svg = d3.create("svg").attr("width", width).attr("height", height);

container.append(svg.node());

/* case1: 練習畫布與矩形畫荷蘭國旗 */
// svg
//     .append("rect")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", 400)
//     .attr("height", 100)
//     .attr("fill", "red");

// svg
//     .append("rect")
//     .attr('x', 0)
//     .attr('y', 200)
//     .attr("width", 400)
//     .attr("height", 100)
//     .attr("fill", "blue");


/* case2: 練習透過變數與比例畫圖 */
// svg
//     .append("rect")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", width)
//     .attr("height", height / 3)
//     .attr("fill", "red");

// svg
//     .append("rect")
//     .attr('x', 0)
//     .attr('y', height / 3 * 2)
//     .attr("width", width)
//     .attr("height", height / 3)
//     .attr("fill", "blue");



