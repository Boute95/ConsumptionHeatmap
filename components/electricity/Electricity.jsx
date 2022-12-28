"use client";

import * as d3 from "d3";
// import data from "../../data/consommation_electricite.csv";
import data from "../../data/mes-puissances-atteintes-30min-22408972440918-77500.csv";
import EdfCsvToAppCsv from "./EdfCsvConverter";

export default function Electricity() {
  // const parseDate = d3.timeParse("%Y-%m-%dT%H:%M");
  // const parseData = d => ({date: parseDate(`${d["DATE"]}T${d["START TIME"]}`), puissance: +d["USAGE"]})
  // const dateExtent = d3.extent(data, (d) => d.date);
  // console.log(dateExtent);
  // const parseData = d => ({date: })
  // const dayCount = Math.ceil(data.length / 48); // every 30 minutes = 48 lines a day
  // console.log("Day count : " + dayCount);

  // const margin = { top: 70, right: 0, bottom: 0, left: 40 };
  // const height = margin.top + margin.bottom + (dayCount + 1) * 10;
  // const width = 954;

  // const x = d3.scaleBand(d3.range(48), [margin.left, width - margin.right]).round(true);
  // const y = d3
  //   .scaleBand(d3.range(dayCount), [margin.top, height - margin.bottom])
  //   .round(true);
  // const color = function () {
  //   let [min, max] = d3.extent(data, (d) => d.usage);
  //   if (min < 0) {
  //     max = Math.max(-min, max);
  //     return d3.scaleDiverging([-max, 0, max], (t) => d3.interpolateRdBu(1 - t));
  //   }
  //   return d3.scaleSequential([0, max], d3.interpolateReds);
  // };

  // const formatUsage = d3.format(".2f");
  // const formatDate = d3.timeFormat("%B %-d, %-I %p");
  // const formatDay = function () {
  //   const formatMonth = d3.timeFormat("%b %-d");
  //   const formatDate = d3.timeFormat("%-d");
  //   return (d) => (d.getDate() === 1 ? formatMonth : formatDate)(d);
  // };

  // const xAxis = (g) =>
  //   g
  //     .attr("transform", `translate(0,${margin.top})`)
  //     .call(d3.axisTop(x).tickFormat(formatHour))
  //     .call((g) => g.select(".domain").remove());
  // const yAxis = (g) =>
  //   g
  //     .attr("transform", `translate(${margin.left},0)`)
  //     .call(d3.axisLeft(y).tickFormat(formatDay))
  //     .call((g) => g.select(".domain").remove());

  const metaData = parseData(getTmpData(data));
  console.log(metaData);
  d3UsageDiagram(data, metaData);

  return <svg id="d3ElectricityContainer"></svg>;
}

///////////////////////////////////////////////////////////////////////////////
function d3UsageDiagram(
  data,
  metaData,
  x = (d) => d.date,
  y = (d) => d.energie,
  width = 720,
  cellHeight = 10,
  paddingInner = 0.05,
  paddingOuter = 0,
) {

  d3.select("#d3ElectricityContainer");

  const xScale = d3
    .scaleBand()
    .range([0, 48])
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter);

  const yScale = d3
    .scaleBand()
    .range([0, metaData.dayCount])
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter);

  const color = d3.scaleSequential(
    [metaData.minEnergie, metaData.maxEnergie],
    d3.interpolateOrRd
  );

  const height = cellHeight * metaData.dayCount;
  
  
  //   .selectAll("p")
  //   .data(data)
  //   .enter()
  //   .append("p")
  //   .text((dta) => dta.heure);
}

///////////////////////////////////////////////////////////////////////////////
function getTmpData() {
  return data.slice(0, 80);
}

///////////////////////////////////////////////////////////////////////////////
function parseData(data) {
  let ret_meta = {
    minEnergie: null,
    maxEnergie: 0,
    dayCount: 0,
  };
  let parsedData = EdfCsvToAppCsv(data);

  for (let row of parsedData) {
    if (row.energie > ret_meta.maxEnergie) {
      ret_meta.maxEnergie = row.energie;
    }

    if (!ret_meta.minEnergie || row.energie < ret_meta.minEnergie) {
      ret_meta.minEnergie = row.energie;
    }

    if (isDate(row.date)) {
      ret_meta.dayCount++;
    }
  }

  return ret_meta;
}

////////////////////////////////////////////////////////////////////////////////
function isDate(str) {
  return str.match(/[0-9]*\/[0-9]*\/[0-9]*/);
}
