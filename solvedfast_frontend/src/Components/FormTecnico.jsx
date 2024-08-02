import * as React from "react";
import { Fragment, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { useState } from "react";
import AddTelephonNumberForm from "./AddTelephonNumberForm";

import AddEspecialidadForm from "./AddEspecialidadForm";
import SimilarSearchModal from "./SimilarSearchModal";

import personSchema from "../js/tecnicoSchema";

import PropTypes from 'prop-types';


export default function FormTecnico ({
    open,
    title,
    handleClose,
    formValues,
    handleChange,
    handleSubmitForm,
    telephons,
    setTelephons,
    especialidadesArray,
    setEspecialidadesArray,
    openSubModal = false,
    subModaltitle = '',
    setSubModal = () => {},
    tecnicosEncontrados = [],
    handleCreateTecnicoAnyway = () => {},
    handleSelectTecnico = () => {},
  }) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [open]);

  const validateForm = async () => {
    try {
      await personSchema.validate(formValues, { abortEarly: false });
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
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
            <form onSubmit={handleFormSubmit}>
                <FormControl fullWidth margin="normal">
                <InputLabel id="tipo_documento_label">
                    Tipo de Documento
                </InputLabel>
                <Select
                    labelId="tipo_documento_label"
                    name="tipo_documento"
                    id="tipo_documento"
                    value={formValues.tipo_documento}
                    label="Tipo de Documento"
                    onChange={handleChange}
                    error={!!errors.tipo_documento}
                >
                    <MenuItem value={"0"}>
                    <em>None</em>
                    </MenuItem>
                    <MenuItem value={"1"}>DNI</MenuItem>
                    <MenuItem value={"2"}>Carnet de Extranjería</MenuItem>
                </Select>
                {errors.tipo_documento && 
                <Typography variant="caption" color={"error"}>
                {errors.tipo_documento}
                </Typography>}
                </FormControl>

                <TextField
                autoFocus
                margin="dense"
                name="documento_identidad"
                label="Documento de Identidad"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.documento_identidad}
                onChange={handleChange}
                error={!!errors.documento_identidad}
                helperText={errors.documento_identidad}
                />
                <TextField
                required
                autoFocus
                margin="dense"
                name="nombres"
                label="Nombres"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.nombres}
                onChange={handleChange}
                error={!!errors.nombres}
                helperText={errors.nombres}
                />
                <TextField
                required
                margin="dense"
                name="apellido_paterno"
                label="Apellido Paterno"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.apellido_paterno}
                onChange={handleChange}
                error={!!errors.apellido_paterno}
                helperText={errors.apellido_paterno}
                />
                <TextField
                required
                margin="dense"
                name="apellido_materno"
                label="Apellido Materno"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.apellido_materno}
                onChange={handleChange}
                error={!!errors.apellido_materno}
                helperText={errors.apellido_materno}
                />
                <TextField
                required
                margin="dense"
                name="correo"
                label="Correo"
                type="text"
                fullWidth
                variant="outlined"
                value={formValues.correo}
                onChange={handleChange}
                error={!!errors.correo}
                helperText={errors.correo}
                />
            </form>

            <AddTelephonNumberForm
                elementsArray={telephons}
                setTF={setTelephons}
            />
            {errors.num_telefono && (
                <Typography variant="caption" color={"error"}>
                {errors.num_telefono}
                </Typography>
            )}

            <AddEspecialidadForm
                elementsArray={especialidadesArray}
                setTF={setEspecialidadesArray}
            />
            {errors.especialidad && (
                <Typography variant="caption" color={"error"}>
                {errors.especialidad}
                </Typography>
            )}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancelar
            </Button>
            <Button
                onClick={handleFormSubmit}
                color="primary"
                variant="contained"
            >
                Guardar
            </Button>
            </DialogActions>
        </Dialog>

        <SimilarSearchModal
            showSimilarModal={openSubModal}
            title={subModaltitle}
            setSimilarModal={setSubModal}
            encontrados={tecnicosEncontrados}
            handleCreateAnyway={handleCreateTecnicoAnyway}
            handleSelect={handleSelectTecnico}
        ></SimilarSearchModal>
    </Fragment>
  );
}
