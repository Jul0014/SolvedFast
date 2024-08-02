import { CalendarDialog } from "../Components/CalendarDialog";
import { VerServicioDialog } from "../Components/verServicioDialog";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "../Components/DeleteConfirmationDialog";

import React, { Fragment, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { toast } from "react-toastify";
import { Backdrop } from "@mui/material";
import Menu from "../Components/Menu";
import TodayIcon from "@mui/icons-material/Today";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs";
import { es } from "dayjs/locale/es";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import axios from "axios";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { AsignarTecnicoDialog } from "../Components/AsignarTecnicoDialog";
import { convertLength } from "@mui/material/styles/cssUtils";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
dayjs.extend(utc);
dayjs.locale("es");
dayjs.extend(localeData);
dayjs.utc(-5);

const HojaTrabajo = () => {
  const [day, setDay] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [servicios, setServicios] = useState([]);
  const [totalServicios, setTotalServicios] = useState(0);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const getHojaTrabajo = async (date) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/hoja_trabajo/${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServicios(res.data.servicios);
      setTotalServicios(res.data.total);
    } catch (error) {
      toast.error("Falló al cargar servicios");
    }
  };
  const downloadHojaTrabajo = async (date) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/hoja_trabajo/download/${date}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${date}.pdf`; // File name you want to download as
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setLoading(false);
      toast.success("Hoja de trabajo descargada correctamente");
    } catch (error) {
      console.error("Error downloading:", error);
      setLoading(false);
      toast.error("Falló al descargar la hoja de trabajo");
    }
  };

  const checkServicio = async (id_servicio) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/servicio/check/${id_servicio}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      getHojaTrabajo(day);
      toast.success("Servicio checkeado correctamente");
    } catch (error) {
      console.log("error");
    }
  };
  const reprogramarServicio = async (id, date) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/servicio/reprogramar`,
        { id, date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Servicio reprogramado correctamente");

      getHojaTrabajo(day);
    } catch (error) {
      toast.error("Falló al reprogramar");
    }
  };
  const updateServicio = async (servicio) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/servicio",
        servicio,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Servicio actualizado correctamente");
      getHojaTrabajo(day);
    } catch (error) {
      toast.error("Falló al actualizar");
    }
  };

  useEffect(() => {
    getHojaTrabajo(day);
  }, [day]);

  const handleDownload = () => {
    downloadHojaTrabajo(day);
  };

  const handleReturn = () => {
    setDay(dayjs(new Date()).format("YYYY-MM-DD"));
  };
  const handleTomorrow = () => {
    const currentDay = dayjs(day);
    const tomorrow = currentDay.add(1, "day");

    setDay(tomorrow.format("YYYY-MM-DD"));

    /*if (tomorrow.day() === 0) {
      setDay(tomorrow.add(1, "day").format("YYYY-MM-DD"));
    } else {
      setDay(tomorrow.format("YYYY-MM-DD"));
    }*/
  };

  const handleCloseLoading = () => {
    setLoading(false);
  };

  const handleYesterday = () => {
    const currentDay = dayjs(day);
    const yesterday = currentDay.add(-1, "day");

    setDay(yesterday.format("YYYY-MM-DD"));

    /*if (yesterday.day() === 0) {
      setDay(yesterday.add(-1, "day").format("YYYY-MM-DD"));
    } else {
      setDay(yesterday.format("YYYY-MM-DD"));
    }*/
  };

  const handleClickSend = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/send-file",
        { date: day },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response data:", response.data);
      // Handle the response data here, e.g., showing a success message
      handleCloseLoading();
      toast.success("Correos enviados con éxito");
    } catch (error) {
      console.error("Error:", error);
      handleCloseLoading();
      toast.error("Problemas al enviar el correo");
      // Handle the error here, e.g., showing an error message
    }
  };

  const handleCheckServicio = (id) => {
    checkServicio(id);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const [openDialogReprogramar, setOpenDialogReprogramar] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialogReprogramar(true);
  };

  const handleCloseDialog = () => {
    setOpenDialogReprogramar(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value).format("YYYY-MM-DD"));
  };

  const handleReprogramar = () => {
    reprogramarServicio(selectedId, selectedDate);
    handleCloseDialog();
  };

  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [servicioEditing, setServicioEditing] = useState({
    _id: "",
    numero_llamada: "",
    tienda: "",
    producto: {
      _id: "",
      marca: "",
      categoria: "",
    },
    fecha_visita: "",
    tipo_servicio: "",
    color: "",
    turno: "",
  });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "producto" && value) {
      // newValue is an object from Autocomplete, set it to _id
      const newValue = value._id;
      setServicioEditing({
        ...servicioEditing,
        producto: newValue,
      });
    } else {
      setServicioEditing({
        ...servicioEditing,
        [name]: value,
      });
    }
  };

  const handleEditarServicio = async (servicio) => {
    setServicioEditing(servicio);
    setOpenDialogEdit(true);
  };
  const handleCloseEditarServicio = () => {
    setOpenDialogEdit(false);
    setServicioEditing({
      _id: "",
      numero_llamada: "",
      tienda: "",
      producto: {
        _id: "",
        marca: "",
        categoria: "",
      },
      fecha_visita: "",
      tipo_servicio: "",
      color: "",
      turno: "",
    });
  };
  const handleSaveService = () => {
    updateServicio(servicioEditing);
    getHojaTrabajo(day);
    handleCloseEditarServicio();
  };
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredServicios, setFilteredServicios] = useState([]);

  useEffect(() => {
    setFilteredServicios(servicios);
  }, [servicios]);

  const handleChangeSearchTerm = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = servicios.filter((servicio) => {
      const numeroLlamada = servicio.numero_llamada
        ? servicio.numero_llamada.toLowerCase()
        : "";
      const nombre =
        servicio.cliente && servicio.cliente.nombres
          ? servicio.cliente.nombres.toLowerCase()
          : "";
      const apellido_paterno =
        servicio.cliente && servicio.cliente.apellido_paterno
          ? servicio.cliente.apellido_paterno.toLowerCase()
          : "";
      const apellido_materno =
        servicio.cliente && servicio.cliente.apellido_materno
          ? servicio.cliente.apellido_materno.toLowerCase()
          : "";
      const distrito =
        servicio.cliente && servicio.cliente.distrito
          ? servicio.cliente.distrito.toLowerCase()
          : "";
      const numTelefono =
        servicio.cliente && servicio.cliente.num_telefono
          ? String(servicio.cliente.num_telefono).toLowerCase()
          : "";

      return (
        numeroLlamada.includes(searchTerm) ||
        nombre.includes(searchTerm) ||
        apellido_paterno.includes(searchTerm) ||
        apellido_materno.includes(searchTerm) ||
        distrito.includes(searchTerm) ||
        numTelefono.includes(searchTerm)
      );
    });

    setFilteredServicios(filtered);
    setSearchTerm(searchTerm);
  };

  const [openDialogAsignar, setOpenDialogAsignar] = useState(false);

  const handleOpenDialogAsignar = (servicio) => {
    setSelectedCliente(servicio.cliente._id);
    setServicioEditing(servicio);
    setOpenDialogAsignar(true);
  };
  const handleCloseDialogAsignar = () => {
    setOpenDialogAsignar(false);
  };

  const [selectedCliente, setSelectedCliente] = useState();

  const handleAsignarTecnico = async (servicio, id_tecnico) => {
    try {
      console.log("Servicio-----------------")
      console.log(servicio);
      console.log("Técnico-----------------")
      console.log(id_tecnico);

      const response = await axios.patch(
        "http://localhost:8000/api/servicio/asignar",
        {
          date: day,
          servicio,
          idTecnico: id_tecnico,
          clienteId: selectedCliente,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Asignacion satisfactoria");
      getHojaTrabajo(day);
      setOpenDialogAsignar(false);
    } catch (error) {
      toast.error("Falló al asignar");
    }
  };

  const [servicioEliminando, setServicioEliminando] = useState({});
  const [openEliminar, setOpenEliminar] = useState(false);

  const handleEliminarServicio = (servicio) => {
    console.log(servicio);
    setServicioEliminando(servicio);
    setOpenEliminar(true);
    console.log(servicioEliminando);
    console.log(servicioEliminando._id);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/servicio/${servicioEliminando._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServicioEliminando({});
      getHojaTrabajo(day);
      toast.success("Servicio eliminado correctamente");
    } catch (error) {
      toast.error("Error al elimnar el servicio");
    }
  };

  return (
    <Fragment>
      <Menu />
      <Box mt={4} mx="auto" maxWidth={"80%"}>
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
          justifyContent="space-between"
        >
          <Typography variant="h1" component="div">
            Hoja de trabajo
          </Typography>
          <Typography variant="h2" component="div">
            {day}
          </Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          flexGrow={1}
          justifyContent="space-between"
          mb={2}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              startIcon={<ArrowLeftIcon />}
              variant="contained"
              color="success"
              sx={{ mr: 2 }}
              onClick={handleYesterday}
            >
              Anterior
            </Button>
            <TextField
              label="Buscar por fecha"
              margin="normal"
              value={day}
              name="Fecha"
              type="date"
              onChange={handleDayChange}
              sx={{ width: 300 }}
            />

            <Button
              endIcon={<ArrowRightIcon />}
              variant="contained"
              color="success"
              sx={{ ml: 2 }}
              onClick={handleTomorrow}
            >
              Siguiente
            </Button>

            {dayjs(new Date()).format("YYYY-MM-DD") != day && (
              <Button
                startIcon={<TodayIcon />}
                variant="contained"
                color="success"
                sx={{ ml: 2 }}
                onClick={handleReturn}
              >
                Hoy
              </Button>
            )}

            <Button
              startIcon={<DownloadIcon />}
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={handleDownload}
            >
              Descargar
            </Button>

            <Button
              startIcon={<RecordVoiceOverIcon />}
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
              onClick={handleClickSend}
            >
              Enviar a técnicos
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            align="center"
          >
            <Typography variant="h6" component="div">
              {servicios.length == 0
                ? "No hay servicios programados para este día"
                : "En total son: " + totalServicios + " servicios"}
            </Typography>
            <p style={{ fontWeight: "bold", marginTop: 0 }}>
              *Se cuentan ya agrupados*
            </p>
          </Box>
        </Box>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Buscar por nombre de cliente, número de llamada, número de teléfono o distrito"
            margin="normal"
            fullWidth
            value={searchTerm}
            onChange={handleChangeSearchTerm}
          />
        </Grid>
        <Box sx={{ display: "flex", alignItems: "center" }}></Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                }}
              >
                <TableCell>Id</TableCell>
                <TableCell>Nº de Llamada / Marca</TableCell>
                <TableCell>Descripcción</TableCell>
                <TableCell>Turno</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>¿Asignar?</TableCell>
                <TableCell>¿Reprogramar?</TableCell>
                <TableCell>¿Realizado?</TableCell>
                <TableCell>¿Editar?</TableCell>
                <TableCell align="center">Técnico Encargado</TableCell>
                <TableCell>¿Eliminar?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredServicios.length > 0 &&
                filteredServicios.map((servicio, index) => (
                  <TableRow key={servicio._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {servicio.numero_llamada +
                        " / " +
                        (servicio.producto ? servicio.producto.marca : "")}
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        {servicio.cliente.nombres +
                          " " +
                          servicio.cliente.apellido_paterno +
                          " " +
                          servicio.cliente.apellido_materno}
                      </span>{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {servicio.cliente.num_telefono.join("/")}
                      </span>{" "}
                      <span style={{ color: "purple", fontWeight: "bold" }}>
                        {servicio.cliente.distrito}
                      </span>{" "}
                      {servicio.cliente.direccion} {servicio.cliente.referencia}{" "}
                      -{" "}
                      {servicio.producto
                        ? servicio.producto.nombre_producto
                        : ""}{" "}
                      ({servicio.tipo_servicio}){" "}
                      <span
                        style={{
                          color: "red",
                          background: "#FFFF00",
                          fontWeight: "bold",
                        }}
                      >
                        {servicio.comentario}
                      </span>{" "}
                    </TableCell>
                    <TableCell align="center"
                      style={{
                        background:
                          servicio.turno === "T/M" || servicio.turno === "T/T"
                            ? "yellow"
                            : "",
                      }}
                    >
                      {servicio.turno}
                    </TableCell>
                    <TableCell sx={{ background: servicio.color }}></TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDialogAsignar(servicio)}
                      >
                        <EngineeringIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleOpenDialog(servicio._id)}
                      >
                        <CalendarTodayIcon style={{ cursor: "pointer" }} />
                      </IconButton>
                      <CalendarDialog
                        open={
                          openDialogReprogramar && selectedId === servicio._id
                        }
                        onClose={handleCloseDialog}
                        onDateChange={handleDateChange}
                        handleReprogramar={handleReprogramar}
                        fecha={servicio.fecha_visita}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {servicio.estado_realizado ? (
                        <IconButton
                          onClick={() => {
                            handleCheckServicio(servicio._id);
                          }}
                        >
                          <CheckCircleOutlineIcon color="success" />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            handleCheckServicio(servicio._id);
                          }}
                        >
                          <CancelIcon color="error" />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="editar"
                        onClick={() => handleEditarServicio(servicio)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {servicio.tecnico
                        ? servicio.tecnico.nombres
                        : "Aún no asignado"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleEliminarServicio(servicio)} // Cambiado
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <DeleteConfirmationDialog
          open={openEliminar}
          handleClose={() => setOpenEliminar(false)}
          handleConfirm={handleConfirm}
          selectedPersonInfo={`Este servicio será eliminado`}
        />

        {openDialogEdit && (
          <VerServicioDialog
            open={openDialogEdit}
            servicio={servicioEditing}
            handleInputChange={handleInputChange}
            handleClose={handleCloseEditarServicio}
            handleSaveService={handleSaveService}
          />
        )}
        {openDialogAsignar && (
          <AsignarTecnicoDialog
            open={openDialogAsignar}
            onClose={handleCloseDialogAsignar}
            handleAsignarTecnico={handleAsignarTecnico}
            servicio={servicioEditing}
            servicios={servicios}
            day={day}
          />
        )}

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleCloseLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Fragment>
  );
};
export default HojaTrabajo;
