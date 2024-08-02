import * as React from 'react';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Grid } from '@mui/material';

import dayjs from 'dayjs';
import suspensionSchema from '../js/suspensionSchema';

export default function FormSuspencion({ open, handleClose, formValues, handleChange, handleDateChange, handleInputChange, handleSubmit }) {
    const [errors, setErrors] = useState({});
    const validateForm = async () => {
        try {
            await suspensionSchema.validate(formValues, { abortEarly: false });
            setErrors({});
            handleSubmit();
        } catch (err) {
            const validationErrors = {};
            if (err.inner) {
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
            }
            setErrors(validationErrors);
            console.log("Validation errors:", validationErrors);
        }
    };

    const handleCloseForm = () => {
        setErrors({})
        handleClose()
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        validateForm();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Suspender Técnico</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="suceso"
                                    label="Suceso"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={formValues.suceso}
                                    onChange={handleChange}
                                    error={!!errors.suceso}
                                    helperText={errors.suceso}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    name="comentario"
                                    label="Comentario"
                                    type="text"
                                    fullWidth
                                    multiline={true}
                                    variant="outlined"
                                    value={formValues.comentario}
                                    onChange={handleChange}
                                    error={!!errors.comentario}
                                    helperText={errors.comentario}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Fecha de Inicio"
                                    value={formValues.fecha_inicio ? dayjs(formValues.fecha_inicio) : null}
                                    renderInput={() => null} // This removes the text field
                                    onChange={(date) => handleDateChange('fecha_inicio', date)} // Check this line
                                    disablePast
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.fecha_inicio,
                                            helperText: errors.fecha_inicio,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <DatePicker
                                    label="Fecha de Fin"
                                    value={formValues.fecha_fin ? dayjs(formValues.fecha_fin) : null}
                                    renderInput={() => null} // This removes the text field
                                    onChange={(date) => handleDateChange('fecha_fin', date)}
                                    disablePast
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.fecha_fin,
                                            helperText: errors.fecha_fin,
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <DialogActions>
                            <Button onClick={handleCloseForm} color="primary">
                                Cancelar
                            </Button>
                            <Button type="submit" color="primary" variant='contained'>
                                Guardar
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </LocalizationProvider>
    );
}