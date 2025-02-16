const width = 400;
const height = width / 4 * 3;
const svg = d3.create("svg").attr("width", width).attr("height", height);
let color = ["darkblue", "white", "red", "red", "white", "darkblue"];
container.append(svg.node());

svg
  .selectAll("rect")
  .data(color)
  .enter()
  .append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * (height / 6))
  .attr("width", width)
  .attr("height", height / 6)
  .attr("fill", (d) => d);

/**
 * case1: 練習 data update: exit()
 * color 減少一筆資料
 * d3.exit 選取當下多餘資料的元素
 * d3.remove 移除選到的元素
 */
removeButton.addEventListener("click", () => {

});

/**
 * case2: 練習 data update: enter()
 * 將 color 加入一筆 red
 * 透過 d3.enter 選取多餘的資料
 */
addButton.addEventListener("click", () => {

});


/**
 * case3: 練習透過資料更新，將國旗繪製成泰國國旗
 * 重新綁定 color 為 ["red", "white", "darkblue", "darkblue", "white", "red"]
 * 透過 d3.join 更新資料
 */
joinButton.addEventListener("click", () => {

});
