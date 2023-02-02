"use client";
import db from "../../firebase";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  height: "50%",
  justifyContent: "space-evenly",
};

export default function EditToolbar() {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<{ [index: string]: any }>({
    date: new Date().toISOString().split("T")[0],
    bf: 0,
    weight: 0,
    calories: 0,
  });
  const router = useRouter();

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleMouseDown = (event: React.MouseEvent) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  const handleAdd = () => {
    openModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  const handleSubmit = async () => {
    const newHealthPoints = { ...fields };
    newHealthPoints.date = new Date(newHealthPoints.date);
    newHealthPoints.bf = parseFloat(newHealthPoints.bf);
    newHealthPoints.weight = parseFloat(newHealthPoints.weight);
    newHealthPoints.calories = parseFloat(newHealthPoints.calories);
    await addDoc(collection(db, "healthpoints"), newHealthPoints);
    router.refresh();
    resetAdd();
    closeModal();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields((oldFields) => ({
      ...oldFields,
      [event.target.id]: event.target.value,
    }));
  };

  const resetAdd = () => {
    setFields({
      date: new Date().toISOString().split("T")[0],
      bf: 0,
      weight: 0,
      calories: 0,
    });
  };

  return (
    <>
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
      <div>
        <Modal open={open} onClose={closeModal}>
          <Box sx={style}>
            <Typography>Add a Health Point</Typography>
            <TextField
              id="date"
              label="Date"
              variant="standard"
              type="date"
              value={fields.date}
              onChange={handleChange}
            />
            <TextField
              id="weight"
              label="Weight (lbs)"
              variant="standard"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={fields.weight}
              onChange={handleChange}
            />
            <TextField
              id="bf"
              label="Body Fat (%)"
              variant="standard"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={fields.bf}
              onChange={handleChange}
            />
            <TextField
              id="calories"
              label="Calories"
              variant="standard"
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              value={fields.calories}
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}
