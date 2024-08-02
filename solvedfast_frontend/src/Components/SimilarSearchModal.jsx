import React from "react";
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function SimilarSearchModal ({ showSimilarModal, setSimilarModal, title, encontrados, handleCreateAnyway, handleSelect}) {
    return(
        <Dialog
          open={showSimilarModal}
          onClose={() => setSimilarModal(false)}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {encontrados && encontrados.map((persona) => (
                    <Box key={persona._id} mb={2} p={2} border={1} borderRadius={2}>
                        <Typography><strong>Nombre:</strong> {persona.nombres} {persona.apellido_paterno} {persona.apellido_materno}</Typography>
                        <Typography><strong>Documento:</strong> {persona.documento_identidad}</Typography>
                        <Typography><strong>Teléfono:</strong> {persona.num_telefono.join(', ')} </Typography>

                        <Button variant="contained" color="primary" onClick={() => handleSelect(persona)}>
                            Seleccionar
                        </Button>
                    </Box>
                ))}
                <Grid container justifyContent="flex-end" spacing={2}>
                    <Grid item>
                        <Button onClick={() => setSimilarModal(false)} variant="outlined">
                            Cancelar
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleCreateAnyway} variant="contained" color="secondary">
                            Crear de Todos Modos
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}