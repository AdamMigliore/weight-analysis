"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Healthpoint from "../../interfaces/Healthpoint";
import EditToolbar from "./EditToolbar";
import DeleteDataItem from "./DeleteDataItem";
import { doc, setDoc } from "firebase/firestore";
import db from "../../firebase";
import { useRouter } from "next/navigation";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID" },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    editable: true,
    type: "date",
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
  const router = useRouter();

  const handleEvent = async (newRow: any, oldRow: any) => {
    const docToUpdate = doc(db, "healthpoints", oldRow.id);
    const updatedHealthPoint = { ...newRow };
    updatedHealthPoint.date = new Date(updatedHealthPoint.date);
    updatedHealthPoint.bf = parseFloat(updatedHealthPoint.bf);
    updatedHealthPoint.weight = parseFloat(updatedHealthPoint.weight);
    updatedHealthPoint.calories = parseFloat(updatedHealthPoint.calories);
    await setDoc(docToUpdate, updatedHealthPoint);

    router.refresh();

    return newRow;
  };

  return (
    <DataGrid
      rows={data}
      columns={columns}
      pageSize={15}
      rowsPerPageOptions={[15]}
      experimentalFeatures={{ newEditingApi: true }}
      editMode="row"
      processRowUpdate={handleEvent}
      disableSelectionOnClick
      components={{
        Toolbar: EditToolbar,
      }}
      initialState={{
        sorting: {
          sortModel: [{ field: "date", sort: "desc" }],
        },
      }}
      autoHeight
    />
  );
}
