"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
  CursorCoordinatesPropType,
  DomainTuple,
  LineSegment,
  Tuple,
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryCursorContainer,
  VictoryLabel,
  VictoryLabelProps,
  VictoryLine,
} from "victory";

import ChartCursorLabel from "@/components/charts/primitives/chart_cursor_label";
import { darkTheme, lightTheme } from "@/constants/chart_theme";
import { METAC_COLORS } from "@/constants/colors";
import useAppTheme from "@/hooks/use_app_theme";
import useContainerSize from "@/hooks/use_container_size";
import usePrevious from "@/hooks/use_previous";
import {
  Area,
  BaseChartData,
  Line,
  NumericChartType,
  Scale,
} from "@/types/charts";
import { NumericForecast } from "@/types/question";
import {
  generateDateYScale,
  generateNumericDomain,
  generateNumericYScale,
  generatePercentageYScale,
  generateTimestampXScale,
} from "@/utils/charts";

type Props = {
  dataset: NumericForecast;
  yLabel?: string;
  height?: number;
  onCursorChange?: (value: number) => void;
  onChartReady?: () => void;
  type?: NumericChartType;
};

const NumericChart: FC<Props> = ({
  dataset,
  yLabel,
  height = 150,
  onCursorChange,
  onChartReady,
  type = "numeric",
}) => {
  const { ref: chartContainerRef, width: chartWidth } =
    useContainerSize<HTMLDivElement>();

  const { theme } = useAppTheme();
  const chartTheme = theme === "dark" ? darkTheme : lightTheme;

  const defaultCursor = dataset.timestamps[dataset.timestamps.length - 1];
  const [isCursorActive, setIsCursorActive] = useState(false);

  const { line, area, yDomain, xScale, yScale } = useMemo(
    () => buildChartData(dataset, chartWidth, height, type),
    [dataset, chartWidth, height, type]
  );

  const prevWidth = usePrevious(chartWidth);
  useEffect(() => {
    if (!prevWidth && chartWidth && onChartReady) {
      onChartReady();
    }
  }, [onChartReady, prevWidth, chartWidth]);

  const CursorContainer = (
    <VictoryCursorContainer
      cursorDimension={"x"}
      defaultCursorValue={defaultCursor}
      cursorLabelOffset={{
        x: 0,
        y: 0,
      }}
      cursorLabel={({ datum }: VictoryLabelProps) => {
        if (datum) {
          return datum.x === defaultCursor
            ? "now"
            : `${xScale.tickFormat(datum.x)}`;
        }
      }}
      cursorComponent={
        <LineSegment
          style={{
            stroke: METAC_COLORS.gray["600"].DEFAULT,
            strokeDasharray: "2,1",
          }}
        />
      }
      cursorLabelComponent={<ChartCursorLabel positionY={height - 10} />}
      onCursorChange={(value: CursorCoordinatesPropType) => {
        if (typeof value === "number" && onCursorChange) {
          const closestTimestamp = dataset.timestamps.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
          );

          onCursorChange(closestTimestamp);
        }
      }}
    />
  );

  const shouldDisplayChart =
    !!chartWidth && !!xScale.ticks.length && yScale.ticks.length;

  return (
    <div ref={chartContainerRef} className="w-full" style={{ height }}>
      {shouldDisplayChart && (
        <VictoryChart
          domain={{ y: yDomain }}
          width={chartWidth}
          height={height}
          theme={chartTheme}
          events={[
            {
              target: "parent",
              eventHandlers: {
                onMouseOverCapture: () => {
                  if (!onCursorChange) return;
                  setIsCursorActive(true);
                },
                onMouseOutCapture: () => {
                  if (!onCursorChange) return;
                  setIsCursorActive(false);
                },
              },
            },
          ]}
          containerComponent={onCursorChange ? CursorContainer : undefined}
        >
          <VictoryArea
            data={area}
            style={{
              data: {
                fill: METAC_COLORS.olive["500"].DEFAULT,
                opacity: 0.3,
              },
            }}
          />
          <VictoryLine
            data={line}
            style={{
              data: {
                stroke: METAC_COLORS.olive["700"].DEFAULT,
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { padding: 2 },
            }}
            tickValues={yScale.ticks}
            tickFormat={yScale.tickFormat}
            label={yLabel}
            axisLabelComponent={<VictoryLabel dy={-10} />}
          />
          <VictoryAxis
            tickValues={xScale.ticks}
            tickFormat={isCursorActive ? () => "" : xScale.tickFormat}
          />
        </VictoryChart>
      )}
    </div>
  );
};

type ChartData = BaseChartData & {
  line: Line;
  area: Area;
  yDomain: DomainTuple;
};

function buildChartData(
  dataset: NumericForecast,
  width: number,
  height: number,
  type: NumericChartType
): ChartData {
  const line = dataset.timestamps.map((timestamp, index) => ({
    x: timestamp,
    y: dataset.values_mean[index],
  }));
  const area = dataset.timestamps.map((timestamp, index) => ({
    x: timestamp,
    y0: dataset.values_min[index],
    y: dataset.values_max[index],
  }));

  const xDomain = generateNumericDomain(dataset.timestamps);
  const xScale = generateTimestampXScale(xDomain, width);

  let yDomain: Tuple<number>;
  let yScale: Scale;
  switch (type) {
    case "binary": {
      yDomain = [0, 1];
      yScale = generatePercentageYScale(height);
      break;
    }
    case "date": {
      const minYValue = Math.min(...dataset.values_min);
      const maxYValue = Math.max(...dataset.values_max);
      yDomain = [minYValue, maxYValue];
      yScale = generateDateYScale(yDomain);
      break;
    }
    default:
      const minYValue = Math.floor(Math.min(...dataset.values_min) * 0.95); // 5% padding
      const maxYValue = Math.ceil(Math.max(...dataset.values_max) * 1.05); // 5% padding
      yDomain = [minYValue, maxYValue];
      yScale = generateNumericYScale(yDomain);
  }

  return {
    line,
    area,
    yDomain,
    xScale,
    yScale,
  };
}

export default React.memo(NumericChart);
