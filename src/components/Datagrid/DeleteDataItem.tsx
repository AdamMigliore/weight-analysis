"use client";
import db from "../../firebase";
import Button from "@mui/material/Button";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface DeleteDataItemProps {
  params: any;
}

export default function DeleteDataItem(props: DeleteDataItemProps) {
  const { params } = props;
  const router = useRouter();

  const onClick = async (e: any) => {
    e.stopPropagation(); // don't select this row after clicking
    const id = params.row.id;

    const docToDelete = doc(db, "healthpoints", id);
    await deleteDoc(docToDelete);

    router.refresh();
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
}
