import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from 'dayjs';
import axios from "axios";
import Menu from "../Components/Menu";

import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import BuscarCliente from "../Components/BuscarCliente";
import { CrearServicio } from "../Components/CrearServicio.jsx";
import { ConfirmarDatos } from "../Components/ConfirmarDatos.jsx";
import { ServiciosAcordeon } from "../Components/ServiciosAcordeon.jsx";
import { SuccessDialog } from "../Components/SuccessProgramacionDialog.jsx";
import { programarRequest } from "../api/programar.js";

const Programar = () => {
  const [actionFlag, setActionFlag] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"));


  const token = localStorage.getItem('token'); 
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    cliente: {
      _id: "",
      tipo_documento: "0",
      nombres: "",
      apellido_materno: "",
      apellido_paterno: "",
      documento_identidad: "",
      num_telefono: [],
      distrito: "",
      provincia: "",
      direccion: "",
      referencia: "",
      comentario: "",
      historial_servicios: [],
    },
    servicios: [],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState([])
  const [succesProgramacion, setSuccessProgramacion] = useState(false);
  const navigate = useNavigate();

  const CreateCliente = (cliente) => {
    axios
      .post("http://localhost:8000/api/cliente", cliente, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      })
      .then((response) => {
        toast.success("Cliente creado con éxito");
        console.log(response);
      })
      .catch((error) => {
        console.error("Error creating cliente:", error);
        toast.error("Error al crear el cliente: " + error.response.data.error);
      });
  };

  const handleCloseDialogProgramacion = () => {
    setSuccessProgramacion(false);
  };

  const isClienteValid = () => {
    return formData.cliente._id;
  };

  useEffect(() => {
    console.log(formData);  
  }, [formData]);

  const findSimilarServices = (nuevoServicio) => {
    return formData.servicios.filter(
      (servicio) =>
        servicio.cliente === nuevoServicio.cliente &&
        servicio.producto === nuevoServicio.producto &&
        servicio.fecha_visita === nuevoServicio.fecha_visita &&
        servicio.tipo_servicio === nuevoServicio.tipo_servicio
    );
  };

  const findSimilarServicesBack = (nuevoServicio, serviciosTotales) => {
    return serviciosTotales.filter(
      (servicio) =>
        servicio.cliente === formData.cliente._id &&
        servicio.producto === nuevoServicio.producto &&
        servicio.fecha_visita === nuevoServicio.fecha_visita &&
        servicio.tipo_servicio === nuevoServicio.tipo_servicio
    );
  };

  const countServicesForDay = (fecha) => {
    const reducedDate = reducirFecha(fecha);
    return formData.servicios.filter(
      (servicio) => reducirFecha(servicio.fecha_visita) === reducedDate
    ).length;
  };

  const countServiceByClient = async ( ) => {

    try {
      const response = await axios.get(`http://localhost:8000/api/servicios/${formData.cliente._id}/${selectedDate}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      const countSC = response.data.count;
      console.log(response)
      return countSC
    } catch (error) {
      console.error("Error al contar servicios:", error);
    }
  };

  const handleAddService = async (newService, productoService) => {
    if (actionFlag == 0){
      const totalServiciosCliente = await countServiceByClient();
      console.log("total de servicios: ", totalServiciosCliente)
      if (totalServiciosCliente >= 10){
        console.log("entro")
        toast.error("El cliente ya tiene 10 servicios creados para el mismo día, escoge otro día");
        return;
      }
      
    }

    console.log(newService.fecha_visita)
    console.log(countServicesForDay(newService.fecha_visita) )
    if (countServicesForDay(newService.fecha_visita) >= 10) {
      toast.error("No se pueden agregar más de 10 servicios por cliente para el mismo día");
      return;
    }

    setFormData({
      ...formData,
      servicios: [...formData.servicios, newService],
    });
    setProductos([productoService]);
  };

  const handleInputChangeClient = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      cliente: {
        ...prevFormData.cliente,
        [name]: value,
      },
    }));
  };

  const handleSelectCliente = (cliente) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      cliente,
    }));
  };

  const handleNext = async () => {
    if (activeStep === 0 && !isClienteValid()) {
      setSnackbarOpen(true);
      return;
    }

    if (activeStep === 1 && formData.servicios.length === 0) {
      setSnackbarOpen(true);
      return;
    }

    if (activeStep === 2) {
      try {
        await programarRequest(formData);
        setSuccessProgramacion(true);
      } catch (e) {
        setSnackbarOpen(true);
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const getProductNameById = (id) => {
    const product = productos.flat().find((producto) => producto._id == id);
    return product ? product.nombre_producto : "Producto no encontrado";
  };

  const getMarcaProductById = (id) => {
    const product = productos.flat().find((producto) => producto._id == id);
    return product ? product.marca : "Marca del producto no encontrado";
  };

  const reducirFecha = (fecha) => {
    const date = new Date(fecha);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

  const countServicios = (fecha) => {
    const serviciosEncontrados = formData.servicios.flat().filter((servicio) => reducirFecha(servicio.fecha_visita) === fecha);
    return parseInt(serviciosEncontrados.length, 10);
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BuscarCliente handleSelectCliente={handleSelectCliente} handleNext={handleNext} setActionFlag={setActionFlag}/>;
      case 1:
        return (
          <Box sx={{ width: "100%" }}>
            <ServiciosAcordeon 
            servicios={formData.servicios} 
            productos={productos} 
            getProductNameById={getProductNameById}
            getMarcaProductById={getMarcaProductById}
            actionFlag={actionFlag}
            />
            <CrearServicio 
            onAddService={handleAddService}
            findSimilarServices={findSimilarServices}
            findSimilarServicesBack={findSimilarServicesBack}
            countServicios={countServicios}
            setSelectedDate={setSelectedDate}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <ConfirmarDatos
              cliente={formData.cliente}
              servicios={formData.servicios}
              productos={productos}
              getProductNameById={getProductNameById}
              getMarcaProductById={getMarcaProductById}
            />
          </Box>
        );
      default:
        return "Paso desconocido";
    }
  };

  return (
    <div>
      <Menu />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={"85vh"}
      >
        <Box
          width="70%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step key="Crear Cliente">
              <StepLabel>Buscar o crear un cliente</StepLabel>
            </Step>
            <Step key="Crear Servicio">
              <StepLabel>Seleccionar o crear servicio/s</StepLabel>
            </Step>
            <Step key="Confirmar Datos">
              <StepLabel>Confirmar Datos</StepLabel>
            </Step>
          </Stepper>
          <Box width="100%" maxHeight="80vh" mt={2}>
            {getStepContent(activeStep)}
            <Box display="flex" justifyContent="space-between" mt={2}>
              {activeStep !== 0 && (
                <Button onClick={handleBack}>Regresar</Button>
              )}
              <Button variant="contained" onClick={handleNext}>
                {activeStep === 2 ? "Confirmar" : "Siguiente"}
              </Button>
            </Box>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="error">
              {activeStep === 0 ? (
                <>
                  Por favor, complete todos los campos requeridos o seleccione un
                  cliente
                </>
              ) : activeStep === 1 ? (
                <>Por favor, agregue al menos un servicio</>
              ) : (
                <>Hubo un error al realizar la programación</>
              )}
            </Alert>
          </Snackbar>
          <SuccessDialog
            open={succesProgramacion}
            onClose={handleCloseDialogProgramacion}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Programar;
