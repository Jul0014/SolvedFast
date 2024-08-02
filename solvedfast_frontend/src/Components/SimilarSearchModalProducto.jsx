import React from "react";
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent } from "@mui/material";

export default function SimilarSearchModalProducto({
  showSimilarModal,
  setSimilarModal,
  title,
  encontrados,
  handleCreateAnyway,
  handleSelect,
}) {
  return (
    <Dialog
      open={showSimilarModal}
      onClose={() => setSimilarModal(false)}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {encontrados && encontrados.map((producto) => (
          <Box key={producto._id} mb={2} p={2} border={1} borderRadius={2}>
            <Typography>
              <strong>Nombre del Producto:</strong> {producto.nombre_producto}
            </Typography>
            <Typography>
              <strong>Marca:</strong> {producto.marca}
            </Typography>
            <Typography>
              <strong>Categoría:</strong> {producto.categoria}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSelect(producto)}
            >
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
