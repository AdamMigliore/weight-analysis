"use client";
import db from "@/firebase";
import Button from "@mui/material/Button";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteDataItemProps {
  params: any;
}

export default function DeleteDataItem(props: DeleteDataItemProps) {
  const { params } = props;
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = async (e: any) => {
    e.stopPropagation(); // don't select this row after clicking
    const id = params.row.id;

    const docToDelete = doc(db, "healthpoints", id);
    await deleteDoc(docToDelete);

    startTransition(() => {
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
    });
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
