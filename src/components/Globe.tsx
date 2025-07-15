import { onMount } from "solid-js";
import * as d3 from "d3";
// import worldData from "../lib/world.json";
import chinaData from "../lib/china-full.json";

const GlobeComponent = () => {
  let mapContainer: HTMLDivElement | undefined;

  const visitedCities = [
    "上海",
    "北京",
    "四川",
    "河南",
    "云南",
    "广西",
    "贵州",
    "湖南",
    "山东",
    "浙江",
    "江西",
    "江苏",
    "重庆",
    "杭州市",
    "南京市",
    "苏州市",
    "威海市",
    "济南市",
    "泰安市",
    "安阳市",
    "洛阳市",
    "周口市",
    "漯河市",
    "绍兴市",
    "舟山市",
    "南昌市",
    "长沙市",
    "萍乡市",
    "桂林市",
    "柳州市",
    "贵阳市",
    "成都市",
    "大理白族自治州",
    "重庆",
    "昆明市",
    "丽江市",
    "乐山市",
    "阿坝藏族羌族自治州",
    "湖州市",
    "无锡市",
  ];

  onMount(() => {
    if (!mapContainer) return;

    const width = mapContainer.clientWidth;
    const height = 800;

    let projection = d3
      .geoMercator()
      .scale(850)
      .center([105, 38])
      .translate([width / 2, height / 2]);

    let pathGenerator = d3.geoPath().projection(projection);

    let svg = d3
      .select(mapContainer)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    let map = svg.append("g");

    map
      .append("g")
      .attr("class", "countries")
      .selectAll("path")
      .data(chinaData.features)
      .enter()
      .append("path")
      .attr("d", (d: any) => pathGenerator(d as any))
      .attr("fill", (d: { properties: { name: string } }) => {
        console.log(d.properties.name);
        return visitedCities.includes(d.properties.name) ? "#f36772" : "white";
      })
      .style("stroke", "black")
      .style("stroke-width", 0.3)
      .style("opacity", 0.8)
      .style("cursor", "pointer");

    // 显示城市名称
    map
      .selectAll("text")
      .data(chinaData.features)
      .enter()
      .append("text")
      .attr("transform", (d: any) => {
        const centroid = pathGenerator.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr("font-size", "12px")
      .attr("dy", "0.25em")
      .attr("text-anchor", "middle")
      .text((d: { properties: { name: string } }) =>
        visitedCities.includes(d.properties.name) ? d.properties.name : ""
      );

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", (event) => {
        svg.selectAll("path").attr("transform", event.transform);
        svg.selectAll("text").attr("transform", (d: any) => {
          const centroid = pathGenerator.centroid(d);
          return `translate(${event.transform.apply([
            centroid[0],
            centroid[1],
          ])})`;
        });
      });

    svg.call(zoom);
  });

  return (
    <div class="flex flex-col text-white justify-center items-center w-full h-full">
      <div class="w-full" ref={mapContainer}></div>
    </div>
  );
};

export default GlobeComponent;
