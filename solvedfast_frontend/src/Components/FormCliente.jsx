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
import { Grid } from "@mui/material";
import { useState } from "react";
import AddTelephonNumberForm from "./AddTelephonNumberForm";

import SimilarSearchModal from "./SimilarSearchModal";

import clienteSchema from "../js/clienteSchema";

export default function FormCliente({
	open,
	title,
	handleClose,
	formValues,
	handleChange,
	handleSubmitForm,
	telephons,
	setTelephons,
	openSubModal = false,
	setSubModal = () => {},
	encontrados = [],
	handleCreateAnyway = () => {},
	handleSelect = () => {},
	setActionFlag = () => {},
}) {
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
			await clienteSchema.validate(formValues, { abortEarly: false });
			setErrors({});
			handleSubmitForm(); 
			setActionFlag(1);
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

	const handleBlur = async (event) => {
		const { name, value } = event.target;
		setTouched((prev) => ({ ...prev, [name]: true }));
	  
		try {
		  await clienteSchema.validateAt(name, formValues);
		  setErrors((prev) => ({ ...prev, [name]: undefined }));
		} catch (err) {
		  setErrors((prev) => ({ ...prev, [name]: err.message }));
		}
	};

	const handleOnClose = () => {
		handleClose();
		setActionFlag(0);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault(); // Ensure this is called on a form submit event
		validateForm();
	};

	return (
		<Fragment>
		<Dialog open={open} onClose={handleOnClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
			<form onSubmit={handleFormSubmit}>
				<Grid container spacing={2} mb={2}>
					<Grid item xs={12} sm={6}>
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
					</Grid>

					<Grid item xs={12} sm={6} sx={{mt:1}}>
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
					</Grid>

					<Grid item xs={12} sm={6}>
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
					</Grid>

					<Grid item xs={12} sm={6}>
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
					</Grid>

					<Grid item xs={12} sm={6}>
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
					</Grid>

					<Grid item xs={12} sm={6}>
					<TextField
						required
						margin="dense"
						fullWidth
						id="provincia"
						label="Provincia"
						name="provincia"
						value={formValues.provincia}
						onChange={handleChange}
						error={!!errors.provincia}
						helperText={errors.provincia}
					/>
					</Grid>

					<Grid item xs={12} sm={6}>
					<TextField
						required
						fullWidth
						margin="dense"
						id="distrito"
						label="Distrito"
						name="distrito"
						value={formValues.distrito}
						onChange={handleChange}
						error={!!errors.distrito}
						helperText={errors.distrito}
					/>
					</Grid>

					<Grid item xs={12} sm={6}>
					<TextField
						required
						fullWidth
						margin="dense"
						id="direccion"
						label="Dirección"
						name="direccion"
						value={formValues.direccion}
						onChange={handleChange}
						error={!!errors.direccion}
						helperText={errors.direccion}
					/>
					</Grid>

					<Grid item xs={12} sm={6}>
					<TextField
						fullWidth
						id="referencia"
						margin="dense"
						label="Referencia"
						name="referencia"
						value={formValues.referencia}
						onChange={handleChange}
						error={!!errors.referencia}
						helperText={errors.referencia}
					/>
					</Grid>
					
					<Grid item xs={12} sm={6}>
					<TextField
						fullWidth
						id="comentario"
						margin="dense"
						label="Comentario"
						name="comentario"
						multiline={true}
						value={formValues.comentario}
						onChange={handleChange}
						error={!!errors.comentario}
						helperText={errors.comentario}
					/>
					</Grid>
				</Grid>
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

			</DialogContent>
			<DialogActions>
			<Button onClick={handleOnClose} color="primary">
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
			title={"Clientes Similares"}
			setSimilarModal={setSubModal}
			encontrados={encontrados}
			handleCreateAnyway={handleCreateAnyway}
			handleSelect={handleSelect}
		></SimilarSearchModal>
		</Fragment>
	);
}
