const width = 400;
const height = 300;
const svg = d3.create("svg").attr("width", width).attr("height", height);

container.append(svg.node());

for (let i = 0; i < 6; i++) {
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", i * (height / 6))
    .attr("width", width)
    .attr("height", height / 6)
    .attr("fill", i % 2 === 0 ? "red" : "blue");
}

/* case1: 練習透過 data bind: data() 繪製哥斯達黎加國旗 */

// d3.selectAll("rect")
//   .data(["darkblue", "white", "red", "red", "white", "darkblue"])
//   .attr("fill", (d) => {
//     console.log("d", d);
//     return d
//   });

/* case2: 練習透過 data bind: datum() 繪製泰國國旗 */

// d3.selectAll("rect")
//   .datum(["red", "white", "darkblue", "darkblue", "white", "red"])
//   .attr("fill", function (d, i) {
//     console.log("d", d);
//     console.log("i", i);
//     return d[i];
//   });
