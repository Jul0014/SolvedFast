import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e4e4e4',
        textAlign: 'center',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({}) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function HistorialTecnico({ open, handleClose, historial }) {
    const formatDate = (dateString) => {
        if (dateString == null || dateString === ''){
            return dateString
        }
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    const handleCloseDialog = () => {
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>Historial Técnico</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell>Suceso</StyledTableCell>
                                <StyledTableCell>Comentario</StyledTableCell>
                                <StyledTableCell>Fecha de Inicio</StyledTableCell>
                                <StyledTableCell>Fecha de Fin</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {historial.map((item, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{item.suceso}</StyledTableCell>
                                    <StyledTableCell>{item.comentario}</StyledTableCell>
                                    <StyledTableCell>{formatDate(item.fecha_inicio)}</StyledTableCell>
                                    <StyledTableCell>{formatDate(item.fecha_inicio)}</StyledTableCell>
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