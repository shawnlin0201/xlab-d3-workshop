const width = 640;
const height = 400;
// const marginTop = 20;
// const marginRight = 20;
// const marginBottom = 30;
// const marginLeft = 40;

// 建立 d3 的畫布
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);
container.append(svg.node());

svg.selectAll("rect")
.data([10, 20, 30, 40, 50])
.enter()
.append("rect")
.attr("x", (d, i) => i * 100)
.attr("y", 0)
.attr("width", 50)
.attr("height", d => d)
.attr("fill", "steelblue");

