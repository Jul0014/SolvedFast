import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  Typography
} from "@mui/material";
import servicioSchema from "../js/servicio.schema";
import dayjs from "dayjs";
import { es } from "dayjs/locale/es";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";


dayjs.extend(utc);
dayjs.locale("es");
dayjs.extend(localeData);

export const VerServicioDialog = ({
  open,
  handleClose,
  servicio,
  handleInputChange,
  handleSaveService,
}) => {
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

  const token = localStorage.getItem('token'); 

  const [productos, setProductos] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = async () => {
    try {
      await servicioSchema.validate(servicio, { abortEarly: false });
      handleSaveService();
      setErrors({});
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

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/productosWOP", 
          {
              headers: {
                  "Authorization": `Bearer ${token}`,
              }
          }
          );
        setProductos(response.data.productos);
      } catch (error) {
        console.log("Error al obtener productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleSubmitForm = async () => {
    await validateForm();
    
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Servicio</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Número de Llamada"
              fullWidth
              margin="normal"
              value={servicio.numero_llamada}
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
              value={servicio.tienda}
              name="tienda"
              onChange={handleInputChange}
              error={!!errors.tienda}
              helperText={errors.tienda}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Marca"
              fullWidth
              margin="normal"
              value={servicio.producto.marca}
              name="marca"
              onChange={handleInputChange}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={productos}
              getOptionLabel={(option) => option.nombre_producto}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={
                productos.find((item) => item._id === servicio.producto._id) ||
                null
              }
              onChange={(event, newValue) => {
                handleInputChange({
                  target: {
                    name: "producto",
                    value: newValue,
                  },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Producto"
                  fullWidth
                  margin="normal"
                />
              )}
            />
            {errors.producto && 
            <Typography variant="caption" color={"error"}>
            {errors.producto}
            </Typography>}
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Fecha Visita"
              fullWidth
              margin="normal"
              value={dayjs(servicio.fecha_visita).utc().format("YYYY-MM-DD")}
              name="fecha_visita"
              onChange={handleInputChange}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.fecha_visita}
              helperText={errors.fecha_visita}
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tipo Servicio"
              fullWidth
              margin="normal"
              value={servicio.tipo_servicio}
              name="tipo_servicio"
              onChange={handleInputChange}
              error={!!errors.tipo_servicio}
              helperText={errors.tipo_servicio}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              label="Estado Realizado"
              control={
                <Checkbox
                  checked={servicio.estado_realizado}
                  onChange={() =>
                    handleInputChange({
                      target: {
                        name: "estado_realizado",
                        value: !servicio.estado_realizado,
                      },
                    })
                  }
                  name="estado_realizado"
                  icon={<CloseIcon />}
                  checkedIcon={<CheckIcon />}
                />
              }
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={servicio.color}
                onChange={handleInputChange}
                name="color"
                label="Color"
                sx={{ backgroundColor: servicio.color }}
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
            <TextField
              label="Serie de Producto"
              fullWidth
              margin="normal"
              value={servicio.serie}
              name="serie"
              onChange={handleInputChange}
              error={!!errors.serie}
              helperText={errors.serie}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl component="fieldset">
              <legend>Turno</legend>
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={servicio.turno === "T/M"}
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
                      checked={servicio.turno === "T/T"}
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
                      checked={servicio.turno === "T/D"}
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
              value={servicio.comentario}
              name="comentario"
              onChange={handleInputChange}
              error={!!errors.comentario}
              helperText={errors.comentario}
            />
          </Box>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmitForm} variant="contained">
          Guardar Edición
        </Button>
      </DialogActions>
    </Dialog>
  );
};
