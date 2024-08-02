import React, { useState } from "react";
import * as yup from "yup";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from '@mui/material/DialogActions';
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

// Define the validation schema
const validationSchema = (fecha) =>
  yup.object().shape({
    fecha_visita: yup
      .date()
      .required("Fecha visita es requerida")
      .test("different-date", "Debe seleccionar una fecha diferente", function (value) {
        if (!value) return false;
        // Convert value to YYYY-MM-DD format for comparison
        const formattedValue = new Date(value).toISOString().split('T')[0];
        return formattedValue !== fecha.substring(0, 10);
      }),
  });

export const CalendarDialog = ({ open, onClose, onDateChange, handleReprogramar, fecha }) => {
  const [fecha_visita, setFechaVisita] = useState(fecha.substring(0, 10));
  const [error, setError] = useState("");

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFechaVisita(value);
    setError("");  // Clear the error when the user starts typing
    onDateChange(e);
  };

  const handleSubmit = async () => {
    try {
      await validationSchema(fecha).validate({ fecha_visita: fecha_visita });
      
      setError("");
      handleReprogramar(fecha_visita);
    } catch (validationError) {
      setError(validationError.message);
    }
  };

  return (
    <Dialog open={open} >
      <DialogTitle>Seleccione una fecha</DialogTitle>
      <DialogContent
        sx={{ display: "flex", alignItems: "center", width: "40vh" }}
      >
        <TextField
          label="Fecha Visita"
          fullWidth
          margin="normal"
          name="fecha_visita"
          onChange={handleDateChange}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={fecha_visita}
          inputProps={{ min: fecha.substring(0, 10) }}
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
          <Button onClick={onClose}>CANCELAR</Button>
          <Button
          variant="contained"
          onClick={handleSubmit}>REPROGRAMAR</Button>
      </DialogActions>
    </Dialog>
  );
};
