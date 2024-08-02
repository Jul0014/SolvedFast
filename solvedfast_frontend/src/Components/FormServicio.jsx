import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { FormControl, Box, FormControlLabel, Checkbox } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem, Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useEffect } from "react";
import servicioSchema from "../js/servicioSchema.js";

import axios from "axios";
import dayjs from 'dayjs';

const FormServicio = ({ open, onClose, onAddService, findSimilarServices, findSimilarServicesBack, countServicios, setSelectedDate }) => {
  
  const [error, setError] = useState({});
  const [productos, setProductos] = useState([]);
  const [productoError, setProductoError] = useState(false); // State for product error

  const [nuevoServicio, setNuevoServicio] = useState({
    numero_llamada: "",
    tienda: "",
    producto: "",
    fecha_visita: "",
    tipo_servicio: "Instalación",
    color: "WHITE",
    turno: "T/D",
  });

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

  const tiposServicios = [
    "Instalación",
    "Reparación",
  ];

  var similarServices = [];

  useEffect(() => {
    const getProductos = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:8000/api/productosWOP`, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });

        setProductos(response.data.productos);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    getProductos();
  }, []);

  const getServiciosPorDiaBack = async (fecha) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/api/servicios/count/${fecha}`, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      return parseInt(response.data.count, 10);
    } catch (error) {
      return error;
    }
  };

  const getServiciosPorDiaBack2 = async (fecha) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/api/servicios/getByDate/${fecha}`, 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );
      return response.data.servicios;
    } catch (error) {
      return error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoServicio({
      ...nuevoServicio,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    if (date) {
        const selectedDate = new Date(date); // Ensure date is a Date object
        const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
        setNuevoServicio({
            ...nuevoServicio,
            fecha_visita: utcDate.toISOString().split('T')[0], // Extract only the date part
        });

        setSelectedDate(dayjs(selectedDate).format("YYYY-MM-DD"));
    } else {
        setNuevoServicio({
            ...nuevoServicio,
            fecha_visita: "",
        });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    setError({ mensaje: "", error: false });
  };

  const validateForm = async (newService) => {
		try {
			await servicioSchema.validate(newService, { abortEarly: false });
			setError({});
      similarServices = findSimilarServices(newService);
      const date = new Date(newService.fecha_visita);
      const formattedDate = date.toISOString().split('T')[0];
      const serviciosPorDiaBack = await getServiciosPorDiaBack(formattedDate);
      const serviciosPorDiaFront = countServicios(formattedDate);
      const serviciosPorDiaBack2 = await getServiciosPorDiaBack2(formattedDate);
      console.log(serviciosPorDiaBack2);
      console.log(similarServices.length);
      if (similarServices.length == 0){
        similarServices = findSimilarServicesBack(newService, serviciosPorDiaBack2);
        console.log(similarServices.length);
      }

      if (similarServices.length == 0) {
        if ((serviciosPorDiaBack + serviciosPorDiaFront) > 39) {
          setError({message: "Ya hay 40 servicios para este día.", error:true});
        }else {
          if (!nuevoServicio.producto) { // Check if product is selected
            setProductoError(true); // Set product error state
          } else {
            setProductoError(false); // Clear product error state
            onAddService(nuevoServicio, productos);
            setNuevoServicio({
              numero_llamada: nuevoServicio.numero_llamada,
              tienda: nuevoServicio.tienda,
              producto: nuevoServicio.producto,
              fecha_visita: nuevoServicio.fecha_visita,
              tipo_servicio: nuevoServicio.tipo_servicio,
              turno: nuevoServicio.turno,
              color: nuevoServicio.color,
            });
            onClose();
          }
        }
      }else{
        setError({message: "Ya hay servicios creados en esta fecha usando el mismo producto, tipo de servicio y en el mismo día.", error:true});
      }
		} catch (err) {
		  const validationErrors = {};
			if (err.inner) {
				err.inner.forEach((error) => {
				validationErrors[error.path] = error.message;
				});
			}
			setError(validationErrors);
		}
	};

  const handleAddService = async () => {
    validateForm(nuevoServicio);
  };

  const handleClose = () => {
    setNuevoServicio({
      numero_llamada: "",
      tienda: "",
      producto: "",
      fecha_visita: "",
      tipo_servicio: "",
      color: "",
      turno: "T/D",
    });

    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear Nuevo Servicio</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Numero de Llamada"
                fullWidth
                margin="normal"
                value={nuevoServicio.numero_llamada}
                name="numero_llamada"
                onChange={handleInputChange}
                error={!!error.numero_llamada}
                helperText={error.numero_llamada}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tienda"
                fullWidth
                margin="normal"
                value={nuevoServicio.tienda}
                name="tienda"
                onChange={handleInputChange}
                error={!!error.tienda}
                helperText={error.tienda}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={productos}
                disableClearable
                getOptionLabel={(option) => `${option.nombre_producto} - ${option.marca}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={
                  productos.find((item) => item._id === (nuevoServicio.producto?._id || ""))
                }
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "producto",
                      value: newValue._id, // Guardar el _id del producto seleccionado
                    },
                  });
                  setProductoError(false); // Clear product error on change
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Producto"
                    fullWidth
                    margin="normal"
                    error={productoError} // Show product error
                    helperText={productoError ? "Debe seleccionar un producto" : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Fecha de Visita"
                value={nuevoServicio.fecha_visita ? dayjs(nuevoServicio.fecha_visita) : null}
                fullWidth
                name="fecha_visita"
                renderInput={() => null}
                onChange={handleDateChange}
                disablePast
                format="DD/MM/YYYY"
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: !!error.fecha_visita,
                        helperText: error.fecha_visita,
                    },
                }}
            />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Servicio</InputLabel>
                <Select
                  value={nuevoServicio.tipo_servicio}
                  onChange={handleInputChange}
                  name="tipo_servicio"
                  label="Tipo de Servicio"
                >
                  {tiposServicios.map((tipo) => (
                    <MenuItem
                      key={tipo}
                      value={tipo}
                    >
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  value={nuevoServicio.color}
                  onChange={handleInputChange}
                  name="color"
                  label="Color"
                  sx={{ backgroundColor: nuevoServicio.color }}
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
                        checked={nuevoServicio.turno === "T/M"}
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
                        checked={nuevoServicio.turno === "T/T"}
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
                        checked={nuevoServicio.turno === "T/D"}
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
                value={nuevoServicio.comentario}
                name="comentario"
                onChange={handleInputChange}
              />
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAddService} variant="contained">
            Agregar Servicio
          </Button>
        </DialogActions>
        <Snackbar
          open={error.error}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="info">
            {error.message}
          </Alert>
        </Snackbar>
      </Dialog>
    </LocalizationProvider>
  );
}

export default FormServicio;
