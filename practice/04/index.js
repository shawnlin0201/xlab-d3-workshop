const width = 400;
const height = 300;
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
 * 減少一筆資料
 * 選取當下多餘資料的元素
 * 移除選到的元素
 */
removeButton.addEventListener("click", () => {

});

/**
 * case2: 練習 data update: enter()
 * 將資料加入一筆 red
 * 透過 enter 選取多餘的資料
 */
addButton.addEventListener("click", () => {

});


/**
 * case3: 練習 data join: join()
 * 重新綁定資料
 * 透過 join 更新資料
 */
joinButton.addEventListener("click", () => {

});
