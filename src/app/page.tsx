import * as React from "react";
import styles from "./page.module.css";
import Datagrid from "../components/Datagrid/Datagrid";
import {
  collection,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import db from "../firebase";

export default async function Home() {
  const data = await getData();
  return (
    <div className={styles.grid}>
      <Datagrid data={data} />
    </div>
  );
}

function convertToHealthpoint(d: QueryDocumentSnapshot<DocumentData>) {
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
