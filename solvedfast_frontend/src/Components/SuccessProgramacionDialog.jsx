import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export const SuccessDialog = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleRealizarOtraProgramacion = () => {
    window.location.reload();
    onClose();
  };

  const handleIrAlMenuPrincipal = () => {
    navigate("/hojatrabajo");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon color="success" fontSize="large" />
          <Typography variant="h6" component="span" style={{ marginLeft: 8 }}>
            Felicidades
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          La programación se ha realizado correctamente.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleRealizarOtraProgramacion}
          color="primary"
          startIcon={<ReplayIcon />}
        >
          Realizar otra programación
        </Button>
        <Button
          onClick={handleIrAlMenuPrincipal}
          color="primary"
          startIcon={<HomeIcon />}
        >
          Ir a la hoja de trabajo
        </Button>
      </DialogActions>
    </Dialog>
  );
};
