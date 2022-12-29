"use client";

import { HeatMapCanvas } from "@nivo/heatmap";

///////////////////////////////////////////////////////////////////////////////
export default function Electricity(props) {

  return (
    <HeatMapCanvas
      data={props.data}
      width={800}
      height={960}
      yInnerPadding={0.2}
      margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
      enableLabels={false}
      axisTop={{ tickSize: 5, tickRotation: -60 }}
      colors={{
        type: "sequential",
        scheme: "orange_red",
        minValue: props.meta.minEnergie,
        maxValue: props.meta.maxEnergie,
      }}
      isInteractive={false}
      // hoverTarget="cell"
    />
  );
}

