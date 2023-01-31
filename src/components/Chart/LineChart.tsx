"use client";
import { useEffect } from "react";
import yAxis from "@/interfaces/yAxis";
import xAxis from "@/interfaces/xAxis";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
} from "recharts";
import ILine from "@/interfaces/Line";
import { getDevice } from "@/utils/isMobile";

interface LineChartProps {
  data: any[];
  yAxes: yAxis[];
  xAxes: xAxis[];
  lines: ILine[];
  syncId: string;
}

export default function LineChart(props: LineChartProps) {
  const { data, xAxes, lines, yAxes, syncId } = props;
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  const isOnMobile = getDevice(userAgent).isMobile();

  return (
    <ResponsiveContainer>
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        syncId={syncId}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {xAxes.map((x, i) => (
          <XAxis
            key={`xAxis-${syncId}-${i}`}
            dataKey={x.dataKey}
            padding={{ left: 30, right: 30 }}
            hide={isOnMobile}
          />
        ))}
        {yAxes.map((y, i) => (
          <YAxis
            key={`yAxis-${syncId}-${i}`}
            yAxisId={y.yAxisId}
            orientation={y.orientation}
            domain={y.domain}
            hide={isOnMobile}
          />
        ))}
        <Tooltip />
        <Legend />
        {lines.map((l, i) => (
          <Line
            key={`line-${syncId}-${i}`}
            type="monotone"
            dataKey={l.dataKey}
            stroke={l.stroke}
            activeDot={{ r: 8 }}
            yAxisId={l.yAxisId}
            connectNulls
          />
        ))}
        {!isOnMobile && <Brush />}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
