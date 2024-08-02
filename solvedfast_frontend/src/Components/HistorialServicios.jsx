import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#e4e4e4",
    textAlign: "center",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({}) => ({
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // or "95%" for even wider
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function HistorialServicios({ open, handleClose, historial }) {
  const formatDate = (dateString) => {
    if (dateString == null || dateString === "") {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  const handleCloseDialog = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="xl">
      <DialogTitle>Historial de Servicios</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Número de Llamada</StyledTableCell>
                <StyledTableCell>Tienda</StyledTableCell>
                <StyledTableCell>Producto</StyledTableCell>
                <StyledTableCell>Serie</StyledTableCell>
                <StyledTableCell>Fecha de visita</StyledTableCell>
                <StyledTableCell>Tipo de Servicio</StyledTableCell>
                <StyledTableCell>Nombre del Técnico</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {historial.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{item.numero_llamada}</StyledTableCell>
                  <StyledTableCell>{item.tienda}</StyledTableCell>
                  <StyledTableCell>{item.nombre_producto}</StyledTableCell>
                  <StyledTableCell>{item.serie}</StyledTableCell>
                  <StyledTableCell>
                    {formatDate(item.fecha_visita)}
                  </StyledTableCell>
                  <StyledTableCell>{item.tipo_servicio}</StyledTableCell>
                  <StyledTableCell>
                    {item.tecnico
                      ? item.tecnico.nombres +
                        " " +
                        item.tecnico.apellido_paterno +
                        " " +
                        item.tecnico.apellido_materno
                      : "Sin asignar"}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
