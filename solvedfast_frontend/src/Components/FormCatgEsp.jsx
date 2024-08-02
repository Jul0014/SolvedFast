import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import genericSchema from "../js/genericFormSchema";

export default function FormCatgEsp({
  open,
  title,
  flagEdit,
  handleClose,
  formValues,
  handleChange,
  handleSubmitForm
}) {

    console.log(formValues)
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    documento_identidad: false,
    nombres: false,
    apellido_paterno: false,
    apellido_materno: false,
    provincia: false,
    distrito: false,
    direccion: false,
    referencia: false,
    comentario: false,
    tipo_documento: false
  });

  useEffect(() => {
    setErrors({});
    setTouched({
      documento_identidad: false,
      nombres: false,
      apellido_paterno: false,
      apellido_materno: false,
      provincia: false,
      distrito: false,
      direccion: false,
      referencia: false,
      comentario: false,
      tipo_documento: false
    });
  }, [open]);

  const validateForm = async () => {
    try {
      await genericSchema.validate(formValues, { abortEarly: false });
      setErrors({});
      handleSubmitForm();
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
      console.log("Validation errors:", validationErrors);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Ensure this is called on a form submit event
    validateForm();
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {flagEdit && <Alert severity="warning">La edición puede alterar los datos actuales.</Alert>}
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} sm={12} sx={{ mt: 1 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="nombre"
                  label="Nombre"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.nombre}
                  onChange={handleChange}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleFormSubmit} color="primary" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
