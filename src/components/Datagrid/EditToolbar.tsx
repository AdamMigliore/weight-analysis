"use client";
import Healthpoint from "@/interfaces/Healthpoint";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: Healthpoint[]) => Healthpoint[]) => void;
}

export default function EditToolbar(props: EditToolbarProps) {
  const { setRows } = props;
  const handleMouseDown = (event: React.MouseEvent) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  const handleAdd = (event: any) => {
    // TODO: Open Modal, save, store
    // TODO: add as row
    setRows((oldrows: any) => [
      ...oldrows,
      { id: 4, date: new Date(), weight: 100, bf: 15, calories: 3000 },
    ]);
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        p: 1,
      }}
    >
      <Button
        onClick={handleAdd}
        onMouseDown={handleMouseDown}
        variant="outlined"
      >
        Add
      </Button>
    </Box>
  );
}
