import * as React from "react";
import { Fragment, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FormControl, Box, FormControlLabel, Checkbox } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from "@mui/material/Grid";

import dayjs from 'dayjs';

const AddServicioModal = ({ formData, handleInputChange, productos, error }) => {

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(error);
    console.log(error);
  }, [errors]);

  const coloresPredefinidos = [
    { nombre: "NORMAL", codigo: "WHITE" },
    { nombre: "REPUESTO", codigo: "PINK" },
    { nombre: "COBRAR", codigo: "GRAY" },
    { nombre: "TRANSPORTE", codigo: "BLUE" },
    { nombre: "URGENTE", codigo: "YELLOW" },
    { nombre: "POSTERGADO", codigo: "ORANGE" },
    { nombre: "RECLAMO", codigo: "RED" },
    { nombre: "VENTA", codigo: "PURPLE" },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Numero de Llamada"
          fullWidth
          margin="normal"
          value={formData.numero_llamada}
          name="numero_llamada"
          onChange={handleInputChange}
          error={!!errors.numero_llamada}
          helperText={errors.numero_llamada}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Tienda"
          fullWidth
          margin="normal"
          value={formData.tienda}
          name="tienda"
          onChange={handleInputChange}
          error={!!errors.tienda}
          helperText={errors.tienda}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Producto</InputLabel>
          <Select
            value={formData.producto}
            onChange={handleInputChange}
            name="producto"
            label="Producto"
          >
            {productos.map((producto) => (
              <MenuItem
                key={producto.nombre_producto}
                value={producto._id}
              >
                {producto.nombre_producto + " - " + producto.marca}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Fecha Visita"
          fullWidth
          margin="normal"
          value={formData.fecha_visita}
          name="fecha_visita"
          onChange={handleInputChange}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.fecha_visita}
          helperText={errors.fecha_visita}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Tipo Servicio"
          fullWidth
          margin="normal"
          value={formData.tipo_servicio}
          name="tipo_servicio"
          onChange={handleInputChange}
          error={!!errors.tipo_servicio}
          helperText={errors.tipo_servicio}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Color</InputLabel>
          <Select
            value={formData.color}
            onChange={handleInputChange}
            name="color"
            label="Color"
            sx={{ backgroundColor: formData.color }}
          >
            {coloresPredefinidos.map((color, index) => (
              <MenuItem
                key={index}
                value={color.codigo}
                style={{ backgroundColor: color.codigo }}
              >
                {color.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <FormControl component="fieldset">
          <legend>Turno</legend>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.turno === "T/M"}
                  onChange={handleInputChange}
                  name="turno"
                  value="T/M"
                />
              }
              label="Mañana"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.turno === "T/T"}
                  onChange={handleInputChange}
                  name="turno"
                  value="T/T"
                />
              }
              label="Tarde"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.turno === "T/D"}
                  onChange={handleInputChange}
                  name="turno"
                  value="T/D"
                />
              }
              label="Todo el Día"
            />
          </Box>
        </FormControl>
      </Grid>
      <Box width={"100%"} ml={2}>
        <TextField
          multiline
          rows={4}
          label="Comentario"
          fullWidth
          margin="normal"
          value={formData.comentario}
          name="comentario"
          onChange={handleInputChange}
        />
      </Box>
    </Grid>
  );

  

  /*return (
    <Fragment>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog onClose={handleClose} >
        <DialogTitle>Agregar Servicio</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="num_llamada"
                  label="Número de Llamada"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  name="tienda"
                  label="Tienda"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <FormControl fullWidth margin="normal">
              <InputLabel id="producto">
                Producto
              </InputLabel>
              <Select
                labelId="producto"
                name="Producto"
                id="producto"
                label="Producto"
              >
                <MenuItem value={"0"}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"1"}>Producto1</MenuItem>
                <MenuItem value={"2"}>Producto2</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                  <FormControl fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    onChange={handleChange}
                    name="color"
                    label="Color"
                  >
                    {coloresPredefinidos.map((color, index) => (
                      <MenuItem
                        key={index}
                        value={color.codigo}
                        style={{ backgroundColor: color.codigo }}
                      >
                        {color.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Fecha de Inicio"
                  value={formValues.fecha_inicio ? dayjs(formValues.fecha_inicio) : null}
                  renderInput={() => null}
                  disablePast
                  slotProps={{
                      textField: {
                          fullWidth: true,
                      },
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  name="tipo_servicio"
                  label="Tipo de Servicio"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  name="marca"
                  label="Marca"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  name="turno"
                  label="Turno"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  name="comentario"
                  label="Comentario"
                  type="text"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            //onClick={handleFormSubmit}
            color="primary"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
    </Fragment>
  );*/
};

export default AddServicioModal;    