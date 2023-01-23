"use client";
import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Healthpoint from "@/interfaces/Healthpoint";
import EditToolbar from "./EditToolbar";
import DeleteDataItem from "./DeleteDataItem";

const convertToDate = (params: GridValueGetterParams) => {
  return new Date(params.row.date);
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID" },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    editable: true,
    type: "date",
    valueGetter: convertToDate,
  },
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
    renderCell: (params) => <DeleteDataItem params={params} />,
  },
];

interface DatagridProps {
  data: Healthpoint[];
}

export default function Datagrid(props: DatagridProps) {
  const { data } = props;

  const [rows, setRows] = React.useState(data);

  const handleEvent = (newRow: Healthpoint, oldRow: Healthpoint) => {
    // TODO: Update DB
    console.log(newRow, oldRow);
    return newRow;
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5]}
      experimentalFeatures={{ newEditingApi: true }}
      editMode="row"
      processRowUpdate={handleEvent}
      disableSelectionOnClick
      components={{
        Toolbar: EditToolbar,
      }}
      componentsProps={{
        toolbar: { setRows },
      }}
    />
  );
}
