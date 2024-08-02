import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import AddTelephonNumberForm from "./AddTelephonNumberForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const EditClienteModal = ({
  open,
  handleClose,
  cliente,
  setClientes,
  updateCliente,
}) => {
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [telephons, setTelephons] = useState([]);
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    setTipoDocumento(cliente.tipo_documento);
    setTelephons(cliente.num_telefono);
  }, [cliente]);

  const formik = useFormik({
    initialValues: {
      documento_identidad: cliente.documento_identidad,
      tipo_documento: cliente.tipo_documento,
      nombres: cliente.nombres,
      apellido_paterno: cliente.apellido_paterno,
      apellido_materno: cliente.apellido_materno,
      distrito: cliente.distrito,
      provincia: cliente.provincia,
      direccion: cliente.direccion,
      referencia: cliente.referencia,
      comentario: cliente.comentario,
    },
    validationSchema: Yup.object({
      documento_identidad: Yup.string().when(
        "tipo_documento",
        (tipo_documento, schema) => {
          return tipo_documento == "0"
            ? schema.nullable(true).notRequired().length(0, "Debe estar vacío")
            : tipo_documento == "1"
            ? schema
                .length(8, "Debe tener 8 dígitos")
                .matches(/^\d*$/, "Solo puede contener números")
            : schema.length(12, "Debe tener 12 dígitos");
        }
      ),
      nombres: Yup.string()
        .required("Los nombres son requeridos")
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(25, "Nombres demasiados largos"),
      apellido_paterno: Yup.string()
        .required("Apellido paterno es requerido")
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(25, "Apellido paterno demasiado largo"),
      apellido_materno: Yup.string()
        .required("Apellido materno es requerido")
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(25, "Apellido materno demasiado largo"),
      distrito: Yup.string()
        .required("Distrito es requerido")
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(25, "El distrito es demasiado largo"),
      provincia: Yup.string()
        .required("Provincia es requerido")
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(25, "La provincia es demasiada larga"),
      direccion: Yup.string()
        .required("Dirección es requerida")
        .transform((value) => value.replace(/\s+/g, " ").trim())
        .max(100, "Direccion demasiada larga"),
    }),
    onSubmit: (values) => {
      values.num_telefono = telephons;
      if (telephons.length == 0) return;

      axios
        .put(`http://localhost:8000/api/cliente/${cliente._id}`, values, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      })
        .then((response) => {
          updateCliente(response.data);
          handleClose();
          toast.success("Cliente actualizado con éxito");
        })
        .catch((error) => {
          console.error("Error updating cliente:", error);
          toast.error("Hubo un error al actualizar el cliente");
        });
    },
  });

  const handleEditCliente = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleTipoDocumentoChange = (event) => {
    setTipoDocumento(event.target.value);
    formik.setFieldValue("tipo_documento", event.target.value);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          Editar Cliente
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="tipo_documento">Tipo de Documento</InputLabel>
                <Select
                  labelId="tipo_documento"
                  name="tipo_documento"
                  id="tipo_documento"
                  value={formik.values.tipo_documento}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.tipo_documento &&
                    Boolean(formik.errors.tipo_documento)
                  }
                >
                  <MenuItem value={"0"}>
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"1"}>DNI</MenuItem>
                  <MenuItem value={"2"}>Carnet de Extranjería</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="documento_identidad"
                label="Documento de Identidad"
                name="documento_identidad"
                value={formik.values.documento_identidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.documento_identidad &&
                  Boolean(formik.errors.documento_identidad)
                }
                helperText={
                  formik.touched.documento_identidad &&
                  formik.errors.documento_identidad
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="nombres"
                label="Nombres"
                name="nombres"
                value={formik.values.nombres}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nombres && Boolean(formik.errors.nombres)}
                helperText={formik.touched.nombres && formik.errors.nombres}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="apellido_paterno"
                label="Apellido Paterno"
                name="apellido_paterno"
                value={formik.values.apellido_paterno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.apellido_paterno &&
                  Boolean(formik.errors.apellido_paterno)
                }
                helperText={
                  formik.touched.apellido_paterno &&
                  formik.errors.apellido_paterno
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="apellido_materno"
                label="Apellido Materno"
                name="apellido_materno"
                value={formik.values.apellido_materno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.apellido_materno &&
                  Boolean(formik.errors.apellido_materno)
                }
                helperText={
                  formik.touched.apellido_materno &&
                  formik.errors.apellido_materno
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="provincia"
                label="Provincia"
                name="provincia"
                value={formik.values.provincia}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.provincia && Boolean(formik.errors.provincia)
                }
                helperText={formik.touched.provincia && formik.errors.provincia}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="distrito"
                label="Distrito"
                name="distrito"
                value={formik.values.distrito}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.distrito && Boolean(formik.errors.distrito)
                }
                helperText={formik.touched.distrito && formik.errors.distrito}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="direccion"
                label="Dirección"
                name="direccion"
                value={formik.values.direccion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.direccion && Boolean(formik.errors.direccion)
                }
                helperText={formik.touched.direccion && formik.errors.direccion}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="referencia"
                label="Referencia"
                name="referencia"
                value={formik.values.referencia}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.referencia && Boolean(formik.errors.referencia)
                }
                helperText={
                  formik.touched.referencia && formik.errors.referencia
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="comentario"
                label="Comentario"
                name="comentario"
                value={formik.values.comentario}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.comentario && Boolean(formik.errors.comentario)
                }
                helperText={
                  formik.touched.comentario && formik.errors.comentario
                }
              />
            </Grid>
          </Grid>
        </form>

        <Box mb={2}>
          <AddTelephonNumberForm
            elementsArray={telephons}
            setTF={setTelephons}
          />
        </Box>

        {telephons.length == 0 && (
          <Typography variant="caption" color={"error"}>
            Se debe de tener al menos un número de teléfono
          </Typography>
        )}

        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
            <Button onClick={handleCancel} variant="outlined" sx={{ mr: 1 }}>
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={handleEditCliente} variant="contained">
              Guardar cambios
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditClienteModal;
