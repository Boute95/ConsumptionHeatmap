"use client";

import data from "../../data/mes-puissances-atteintes-30min-22408972440918-77500.csv";
import EdfCsvToAppCsv from "./EdfCsvConverter";
import { ResponsiveHeatMap } from "@nivo/heatmap";

///////////////////////////////////////////////////////////////////////////////
export default function Electricity() {
  const nivoData = AppCsvToNivoData(EdfCsvToAppCsv(getTmpRawData(data)));
  const meta = getMetaData(nivoData);
  return (
    <ResponsiveHeatMap
      data={nivoData}
      width={850}
      height={960}
      yInnerPadding={0.2}
      margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
      enableLabels={false}
      axisTop={{ tickSize: 5, tickRotation: -60 }}
      colors={{
        type: "sequential",
        scheme: "orange_red",
        minValue: meta.minEnergie,
        maxValue: meta.maxEnergie,
      }}
    />
  );
}

///////////////////////////////////////////////////////////////////////////////
function getTmpRawData() {
  return data.slice(0, 3000);
}

///////////////////////////////////////////////////////////////////////////////
function getMetaData(data) {
  let ret_meta = {
    minEnergie: null,
    maxEnergie: 0,
  };

  for (let day of data) {
    for (let cell of day.data) {
      if (cell.y > ret_meta.maxEnergie) {
        ret_meta.maxEnergie = cell.y;
      }
      if (!ret_meta.minEnergie || cell.y < ret_meta.minEnergie) {
        ret_meta.minEnergie = cell.y;
      }
    }
  }

  return ret_meta;
}

////////////////////////////////////////////////////////////////////////////////
function isDate(str) {
  return str.match(/[0-9]*\/[0-9]*\/[0-9]*/);
}

///////////////////////////////////////////////////////////////////////////////
function AppCsvToNivoData(data) {
  let nivo = [];
  for (let row of data) {
    if (!row.energie && isDate(row.date)) {
      nivo.push({ id: row.date, data: [] });
    } else if (row.energie) {
      nivo[nivo.length - 1].data.push({
        x: row.date,
        y: row.energie,
      });
    }
  }
  return nivo;
}
