"use client";
import Button from "@mui/material/Button";

interface DeleteDataItemProps {
  params: any;
}

export default function DeleteDataItem(props: DeleteDataItemProps) {
  const { params } = props;

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
}
