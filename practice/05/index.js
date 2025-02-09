const width = 400;
const height = 300;
const svg = d3.create("svg").attr("width", width).attr("height", height);
let data = [
  { text: '嗚', count: 4 },
  { text: '哇', count: 5 },
  { text: '塔', count: 2 },
  { text: '哭', count: 2 },
  { text: '恰', count: 1 },
  { text: '喔', count: 1 },
];
container.append(svg.node());

svg.append('text')
  .text('嗚嗚哇哇嗚哇，嗚哇哇塔哭塔哭，恰喔')
  .attr('x', 80)
  .attr('y', 280)
  .attr('fill', 'black');


/**
 * case1: 設定圓餅圖
 * 1. 透過 d3.pie() 設定圓餅圖的值，d3 會自動計算每個部分的角度
 * 2. 透過 d3.arc() 設定圓餅圖的內外半徑
 */


/**
 * case2: 設定文字
 * 1. 透過 labelArc 計算文字的位置
 * 2. 透過 labelArc.centroid(d) 可以取得原先圓餅圖的中心點
 */
