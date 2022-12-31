"use client";

import { HeatMapCanvas } from "@nivo/heatmap";


///////////////////////////////////////////////////////////////////////////////
export default function Electricity(props) {
  const cellHeight = 12;
  const totalHeight = Math.max(200, cellHeight * props.days.length);
  return (
    <HeatMapCanvas
      data={props.days}
      width={800}
      height={totalHeight}
      yInnerPadding={0.2}
      margin={{ top: 120, right: 90, bottom: 30, left: 90 }}
      enableLabels={false}
      axisTop={{ tickSize: 5, tickRotation: -60 }}
      colors={{
        type: "sequential",
        scheme: "yellow_green_blue",
        minValue: props.meta.minEnergie,
        maxValue: props.meta.maxEnergie,
      }}
      animate={false}
      activeOpacity={1}
      inactiveOpacity={0.3}
      hoverTarget="rowColumn"
      legends={[
        {
          anchor: "top",
          translateX: 0,
          translateY: -80,
          length: 320,
          thickness: 8,
          direction: "row",
          tickPosition: "after",
          tickSize: 3,
          tickSpacing: 4,
          tickOverlap: false,
          title: "Energy Consumption (Wh)",
          titleAlign: "start",
          titleOffset: 4,
        },
      ]}
    />
  );
}
