"use client";
import * as React from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import styles from "./page.module.css";
import Button from "@mui/material/Button";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID" },
  { field: "date", headerName: "Date", flex: 1, editable: true, type: "date" },
  {
    field: "weight",
    headerName: "Weight (lbs)",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "bf",
    headerName: "Body Fat (%)",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "calories",
    headerName: "Calories (kcals)",
    type: "number",
    flex: 1,
    editable: true,
  },
  {
    field: "action",
    headerName: "Action",
    sortable: false,
    renderCell: (params) => {
      const onClick = (e: any) => {
        e.stopPropagation(); // don't select this row after clicking
        const id = params.row.id;
        // TODO: Execute delete
        console.log(id);
      };

      return (
        <Button
          onClick={onClick}
          variant="contained"
          color="error"
          disableElevation
        >
          Delete
        </Button>
      );
    },
  },
];

const rows = [
  { id: 1, date: "2023-01-23", weight: 164.0, bf: 16.5, calories: 2700 },
  { id: 2, date: "2023-01-23", weight: 164.0, bf: 16.5, calories: 2700 },
];

export default function Home() {
  const handleEvent = (newRow: any, oldRow: any) => {
    console.log(newRow, oldRow);
    // TODO: Call update
    return newRow;
  };

  return (
    <div className={styles.grid}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        experimentalFeatures={{ newEditingApi: true }}
        editMode="row"
        processRowUpdate={handleEvent}
        disableSelectionOnClick
      />
    </div>
  );
}
