const width = 400;
const height = 300;
const svg = d3.create("svg").attr("width", width).attr("height", height);
const lyrics = ['嗚嗚哇哇嗚哇，嗚哇哇塔哭塔哭，恰喔'];
let data = [
  // { text: '嗚', count: 4 },
  // { text: '哇', count: 5 },
  // { text: '塔', count: 2 },
  // { text: '哭', count: 2 },
  // { text: '恰', count: 1 },
  // { text: '喔', count: 1 },
];

// 計算出每個字的出現次數，並排除「，」符號
lyrics
.forEach((lyric) => {
  for (let i = 0; i < lyric.length; i++) {
    const char = lyric[i];
    if(char === '，') continue;
    const index = data.findIndex(d => d.text === char);
    if (index === -1) {
      data.push({ text: char, count: 1 });
    } else {
      data[index].count += 1;
    }
  }
});

svg.append('text')
  .text(lyrics)
  .attr('x', width / 2)
  .attr('y', height - 20)
  .attr('fill', 'black')
  .attr('text-anchor', 'middle');

container.append(svg.node());


/**
 * case1: 設定圓餅圖
 * 1-1. 定義圓餅圖內外半徑
 */
const innerRadius = 50
const outerRadius = 80

/**
 * 1-2. 透過 d3.pie() 設定圓餅圖的值，d3 會自動計算每個部分的角度，好讓後續能放入 <path> 中
 * arcs = {
 *  startAngle: 0,
 *   endAngle: 1.5707963267948966,
 *   padAngle: 0,
 *   value: 4,
 *   index: 0,
 *   data: { text: '嗚', count: 4 }
 * }
 */

const pie = d3.pie().value(d => d.count);
const arcs = pie(data)

/**
 * 1-3. 透過 d3.arc() 設定圓餅圖的內外半徑
 * arc(arcs[0]) = "M 0 -80 A 80 80 0 0 1 0 80 L 0 0 Z"
 */

const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);


/**
 * 1-4. d3 新增 <g> 標籤設定圓餅圖的位置，可以想像成是一個容器（group）
 * 1-5. 透過 <path> 標籤繪製圓餅圖
 */

svg
  .append('g')
  .selectAll('path')
  .data(arcs)
  .join('path')
  .attr('d', arc)
  .attr('fill', (d, i) => d3.schemeTableau10[i])
  .attr('transform', `translate(200, 140)`)
  


/**
 * case2: 設定文字
 * 1. 透過 labelArc 計算文字的位置
 * 2. 透過 labelArc.centroid(d) 可以取得原先圓餅圖的中心點
 * 3. 透過 text-anchor 設定文字的對齊方式，因為雖然算出 x,y 座標，但文字是從左上角開始畫
 * 4. 透過 alignment-baseline 設定文字的基準線，文字基準線是文字的底部，這樣文字就會在座標點上
 */

svg.append('g')
  .attr('transform', `translate(200, 140)`)
  .selectAll('text')
  .data(arcs)
  .join('text')
  .text(d => {
    const text = d.data.text;
    const percent = (d.data.count / d3.sum(data, d => d.count)) * 100;
    return `${text} (${percent.toFixed(0)}%)`;
  })
  .attr('transform', d => {
    const labelArc = d3.arc()
      .innerRadius(outerRadius)
      .outerRadius(outerRadius + 50);
    return `translate(${labelArc.centroid(d)})`;
  })
  .attr('text-anchor', 'middle')
  .attr('alignment-baseline', 'middle');
