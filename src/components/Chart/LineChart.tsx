"use client";
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
} from "recharts";
import ILine from "@/interfaces/Line";

interface LineChartProps {
  data: any[];
  yAxes: yAxis[];
  xAxes: xAxis[];
  lines: ILine[];
  syncId: string;
}

export default function LineChart(props: LineChartProps) {
  const { data, xAxes, lines, yAxes, syncId } = props;
  return (
    <RechartsLineChart
      width={800}
      height={500}
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
        />
      ))}
      {yAxes.map((y, i) => (
        <YAxis
          key={`yAxis-${syncId}-${i}`}
          yAxisId={y.yAxisId}
          orientation={y.orientation}
          domain={y.domain}
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
      <Brush />
    </RechartsLineChart>
  );
}
