"use client";
import yAxis from "../../interfaces/yAxis";
import xAxis from "../../interfaces/xAxis";
import {
  AreaChart as RechartsAreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ResponsiveContainer,
  Area,
} from "recharts";
import IArea from "@/interfaces/Area";
import { getDevice } from "@/utils/isMobile";

interface StackedAreaChartProps {
  data: any[];
  xAxes: xAxis[];
  area: IArea[];
  syncId: string;
}

export default function StackedAreaChart(props: StackedAreaChartProps) {
  const { data, xAxes, area, syncId } = props;
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  const isOnMobile = getDevice(userAgent).isMobile();

  return (
    <ResponsiveContainer>
      <RechartsAreaChart
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
        <YAxis />
        <Tooltip />
        <Legend />
        {area.map((a, i) => (
          <Area
            key={`area-${syncId}-${i}`}
            type="monotone"
            dataKey={a.dataKey}
            stroke={a.stroke}
            stackId={a.stackId}
            fill={a.fill}
            connectNulls
          />
        ))}
        {!isOnMobile && <Brush />}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
