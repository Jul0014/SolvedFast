import * as React from 'react';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { TablePagination } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import HistorialTecnico from './HistorialTecnico';

const StyledTableCell = styled(TableCell)(({}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#e4e4e4',
        textAlign: 'center',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: 'center',
    },
}));

const StyledTableRow = styled(TableRow)(({}) => ({
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function CustomizedTable({openSus, openQSus, rows, deleteTecnico, updateTecnico, page, setPage, rowsPerPage, setRowsPerPage, totalRows}) {

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedTecnico, setSelectedTecnico] = useState(null);
    const handleDeleteOpen = (tecnico) => {
        setSelectedTecnico(tecnico);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setSelectedTecnico(null);
        setDeleteOpen(false);
    };
    
    const handleDeleteConfirm = () => {
        deleteTecnico(selectedTecnico._id);
        handleDeleteClose();
    };

    /* Historial tecnico */
    const [historialOpen, setHistorialOpen] = useState(false);

    const handleHistorialOpen = (tecnico) => {
        setSelectedTecnico(tecnico);
        setHistorialOpen(true);
    };

    const handleHistorialClose = () => {
        setSelectedTecnico(null);
        setHistorialOpen(false);
    };

    return (
        <Paper>
        <TableContainer component={Paper} sx={{boxShadow: 0}}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Nombres</StyledTableCell>
                        <StyledTableCell>Apellidos</StyledTableCell>
                        <StyledTableCell>Teléfono</StyledTableCell>
                        <StyledTableCell>Especialidades</StyledTableCell>
                        <StyledTableCell>Estado</StyledTableCell>
                        <StyledTableCell>Suspender</StyledTableCell>
                        <StyledTableCell>Acciones</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row._id}>
                            <StyledTableCell  component="th" scope="row">
                                {row.nombres}
                            </StyledTableCell>
                            <StyledTableCell>{row.apellido_paterno + " " + row.apellido_materno}</StyledTableCell>
                            <StyledTableCell>
                                {row.num_telefono.map((elem, index) => (
                                        <div key={index}>{elem}</div>
                                    ))
                                }
                            </StyledTableCell>
                            <StyledTableCell>
                                {row.especialidad.map((esp, index) => (
                                        <div key={index}>{esp.nombre_especialidad}</div>
                                    ))
                                }
                            </StyledTableCell>
                            <StyledTableCell>{row.estado ? 'Activo' : 'Suspendido'}</StyledTableCell>
                            <StyledTableCell>{row.estado ? 
                                <Button 
                                    variant="contained" 
                                    color="success"
                                    onClick={() => openSus(row)}
                                >
                                    Suspender
                                </Button> : 
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => openQSus(row)}
                                >
                                    Quitar Suspención
                                </Button>}
                            </StyledTableCell>
                            <StyledTableCell>
                                <IconButton
                                    aria-label="verHistorial" 
                                    color="#e4e4e4"
                                    onClick={() => handleHistorialOpen(row)}
                                >
                                    <VisibilityIcon/>                                    
                                </IconButton>
                                <IconButton 
                                    aria-label="update" 
                                    color="warning"
                                    onClick={() => updateTecnico(row)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    aria-label="delete" 
                                    color="error" 
                                    onClick={() => handleDeleteOpen(row)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>

        {selectedTecnico && (
            <DeleteConfirmationDialog
              open={deleteOpen}
              handleClose={handleDeleteClose}
              handleConfirm={handleDeleteConfirm}
              selectedPersonInfo={selectedTecnico.nombres + " " + selectedTecnico.apellido_materno + " " + selectedTecnico.apellido_paterno}
            />
        )}

        {selectedTecnico && (
            <HistorialTecnico
              open={historialOpen}
              handleClose={handleHistorialClose}
              historial={selectedTecnico.historial_tecnico}
            />
        )}
        </Paper>
    );
}