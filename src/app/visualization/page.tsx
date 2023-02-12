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
import { findMedians } from "@/utils/findMedians";
import { findMaintenanceCalories } from "@/utils/getMaintenanceCalories";
import StackedAreaChart from "@/components/Chart/StackedAreaChart";
import Area from "@/interfaces/Area";

export const revalidate = 0;

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
  { dataKey: "medianWeight", yAxisId: "weight", stroke: "#03d3fc" },
];

const caloriesXAxes: xAxis[] = [{ dataKey: "pointNumber" }];
const caloriesArea: Area[] = [
  {
    dataKey: "average",
    type: "monotone",
    stackId: "avg",
    stroke: "#8884d8",
    fill: "#8884d8",
  },
  {
    dataKey: "maintenance",
    type: "monotone",
    stackId: "maint",
    stroke: "#82ca9d",
    fill: "#82ca9d",
  },
];

export default async function Visualization() {
  const data = await getData();
  data.sort((a, b) => a.date.localeCompare(b.date));
  findMedians(data);
  const { maintenanceCaloriesOverWeeks, averageCaloriesLoggedOverWeeks } =
    findMaintenanceCalories(data);

  const caloriesOverWeeks = maintenanceCaloriesOverWeeks.map((v, i) => ({
    pointNumber: i,
    average: averageCaloriesLoggedOverWeeks[i],
    maintenance: v,
  }));

  const preparedData = data.map((d) => ({ ...d, date: d.date.split("T")[0] }));

  return (
    <div className={styles.container}>
      <LineChart
        data={preparedData}
        yAxes={yAxes}
        xAxes={xAxes}
        lines={lines}
        syncId="defaultChart"
      />
      <LineChart
        data={preparedData}
        yAxes={medianYAxes}
        xAxes={medianXAxes}
        lines={medianLines}
        syncId="medianWeightChart"
      />
      <StackedAreaChart
        data={caloriesOverWeeks}
        xAxes={caloriesXAxes}
        area={caloriesArea}
        syncId="caloriesChart"
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
    date: ts.toDate().toISOString(),
    weight: dp.weight,
    bf: dp.bf,
    calories: dp.calories,
  };
}

async function getData() {
  const querySnapshot = await getDocs(collection(db, "healthpoints"));
  return querySnapshot.docs.map(convertToHealthpoint);
}
