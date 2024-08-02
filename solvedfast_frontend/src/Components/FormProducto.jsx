import * as React from "react";
import { Fragment, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Grid, MenuItem } from "@mui/material"; // Asegúrate de importar MenuItem desde @mui/material

import axios from "axios";

export default function FormProducto({
  open,
  title,
  handleClose,
  formValues,
  handleChange,
  handleSubmitForm,
  flagEdit = false,
  openSubModal = false,
  setSubModal = () => {},
  encontrados = [],
  handleCreateAnyway = () => {},
  handleSelect = () => {},
}) {
  const [categorias, setCategorias] = useState([]); // Inicializa categorias como un array vacío
  const token = localStorage.getItem('token'); 

  console.log(formValues)

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categorias", 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );
      setCategorias(response.data.categorias); // Asigna los datos de categorias desde la respuesta
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmitForm();
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {flagEdit && <Alert severity="warning" sx={{mb:2}}>La edición puede alterar los datos actuales.</Alert>}
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="nombre_producto"
                  label="Nombre del Producto"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.nombre_producto}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="marca"
                  label="Marca"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formValues.marca}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  margin="dense"
                  name="categoria"
                  label="Categoría"
                  fullWidth
                  variant="outlined"
                  value={formValues.categoria._id}
                  onChange={handleChange}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria._id} value={categoria._id}>
                      {categoria.nombre_categoria}
                    </MenuItem>
                  ))}
                  {!categorias.some((categoria) => categoria._id === formValues.categoria._id) && (
                    <MenuItem value={formValues.categoria._id}>
                      {formValues.categoria.nombre_categoria}
                    </MenuItem>
                  )}
                </TextField>
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
