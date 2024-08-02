import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Box} from '@mui/material';

const DeleteConfirmationDialog = ({ open, handleClose, handleConfirm, selectedPersonInfo }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Confirmar eliminación</DialogTitle>
    <DialogContent>
        <Box sx={{ fontWeight: 'bold', m: 1, fontSize: 'h6.fontSize' }}>
          {selectedPersonInfo}
        </Box>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminarlo? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>

    <DialogActions>
      <Button onClick={handleClose} variant="outlined">Cancelar</Button>
      <Button onClick={() => {
        handleConfirm();
        handleClose();
      }} variant="contained" color="error">Eliminar</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmationDialog;
