import * as React from 'react';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';

import quitarSuspensionSchema from '../js/quitarSuspensionSchema';

export default function FormQuitarSuspencion({open, handleClose, formValues, handleChange, handleSubmit}) {

    const [errors, setErrors] = useState({});

    const validateForm = async () => {
        try {
            await quitarSuspensionSchema.validate(formValues, { abortEarly: false });
            setErrors({});
            handleSubmit();
        } catch (err) {
            console.error(err)
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

    const handleFormSubmit = (e) => {
        e.preventDefault();
        validateForm();
    };

    const handleCloseForm = () => {
        setErrors({})
        handleClose()
    }

    return(
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Quitar Suspención Técnico</DialogTitle>
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
    );
}