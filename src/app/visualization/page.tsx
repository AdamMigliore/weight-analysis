import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import db from "../../firebase";
import Healthpoint from "../../interfaces/Healthpoint";
import LineChart from "../../components/Chart/LineChart";
import styles from "./page.module.css";
import yAxis from "../../interfaces/yAxis";
import Line from "../../interfaces/Line";
import xAxis from "../../interfaces/xAxis";
import { findMedianOfAWeek } from "../../utils/findMedians";
import { merge } from "../../utils/merge";

export default async function Visualization() {
  const data = await getData();
  data.sort((a, b) => a.date.localeCompare(b.date));
  const timestampedData = data.map((d) => ({ ...d, date: new Date(d.date) }));
  const medianWeight = findMedianOfAWeek(timestampedData, "weight", "date");
  const mergeMedianToData = merge(data, medianWeight, "date");

  const yAxes: yAxis[] = [
    {
      yAxisId: "weight",
      orientation: "left",
      domain: ["dataMin - 1", "dataMax + 1"],
    },
    {
      yAxisId: "bf",
      orientation: "right",
      domain: ["dataMin - 0.5", "dataMax + 0.5"],
    },
    {
      yAxisId: "calories",
      orientation: "right",
      domain: ["dataMin - 100", "dataMax + 100"],
    },
  ];

  const xAxes: xAxis[] = [{ dataKey: "date" }];

  const lines: Line[] = [
    { dataKey: "calories", yAxisId: "calories", stroke: "#0f0f" },
    { dataKey: "weight", yAxisId: "weight", stroke: "#fc03d2" },
    { dataKey: "bf", yAxisId: "bf", stroke: "#03d3fc" },
  ];

  const medianYAxes: yAxis[] = [
    {
      yAxisId: "weight",
      orientation: "left",
      domain: ["dataMin - 1", "dataMax + 1"],
    },
  ];

  const medianXAxes: xAxis[] = [{ dataKey: "date" }];

  const medianLines: Line[] = [
    { dataKey: "weight", yAxisId: "weight", stroke: "#fc03d2" },
    { dataKey: "medianweight", yAxisId: "weight", stroke: "#03d3fc" },
  ];

  return (
    <div className={styles.container}>
      <LineChart
        data={data}
        yAxes={yAxes}
        xAxes={xAxes}
        lines={lines}
        syncId="defaultChart"
      />
      <LineChart
        data={mergeMedianToData}
        yAxes={medianYAxes}
        xAxes={medianXAxes}
        lines={medianLines}
        syncId="medianWeightChart"
      />
    </div>
  );
}

function convertToHealthpoint(
  d: QueryDocumentSnapshot<DocumentData>
): Healthpoint {
  const dp = d.data();
  const ts = new Timestamp(dp.date.seconds, dp.date.nanoseconds);

  return {
    id: d.id,
    date: ts.toDate().toISOString().split("T")[0],
    weight: dp.weight,
    bf: dp.bf,
    calories: dp.calories,
  };
}

async function getData() {
  const querySnapshot = await getDocs(collection(db, "healthpoints"));
  return querySnapshot.docs.map(convertToHealthpoint);
}
