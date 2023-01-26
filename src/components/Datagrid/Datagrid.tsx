"use client";
import { useTransition } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Healthpoint from "@/interfaces/Healthpoint";
import EditToolbar from "./EditToolbar";
import DeleteDataItem from "./DeleteDataItem";
import { doc, setDoc } from "firebase/firestore";
import db from "@/firebase";
import { useRouter } from "next/navigation";

// TODO: Fix the f******* dates
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

export const revalidate = 86400;

interface DatagridProps {
  data: Healthpoint[];
}

export default function Datagrid(props: DatagridProps) {
  const { data } = props;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEvent = async (newRow: Healthpoint, oldRow: Healthpoint) => {
    const docToUpdate = doc(db, "healthpoints", oldRow.id);
    await setDoc(docToUpdate, newRow);

    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });

    return newRow;
  };

  return (
    <DataGrid
      rows={data}
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
    />
  );
}
