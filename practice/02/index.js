const width = 400;
const height = 300;
const svg = d3.create("svg").attr("width", width).attr("height", height);

container.append(svg.node());

/* case1: 練習透過 select 將荷蘭國旗換成奧地利國旗 */
svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height / 3)
    .attr("fill", "red");

svg
    .append("rect")
    .attr('x', 0)
    .attr('y', height / 3 * 2)
    .attr("width", width)
    .attr("height", height / 3)
    .attr("fill", "red");
