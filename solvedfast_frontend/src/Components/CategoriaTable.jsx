import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#e4e4e4",
        textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        textAlign: "center",
    },
}));

const StyledTableRow = styled(TableRow)(({}) => ({
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

export default function CategoriaTable({ rows, page, setPage, rowsPerPage, setRowsPerPage, totalRows, updateCatg, deleteCatg }) {

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
    };
    

    /* Delete Confirmation */
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedCatg, setSelectedCatg] = useState(null);

    const handleDeleteOpen = (categoria) => {
        setSelectedCatg(categoria);
        setDeleteOpen(true);
    };

    const handleDeleteClose = () => {
        setSelectedCatg(null);
        setDeleteOpen(false);
    };

    const handleDeleteConfirm = () => {
        console.log(selectedCatg)
        deleteCatg(selectedCatg._id);
        handleDeleteClose();
    };


    return (
        <Paper>
            <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Nombre</StyledTableCell>
                            <StyledTableCell>Acciones</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row._id}>
                                <StyledTableCell>{row.nombre_categoria}</StyledTableCell>
                                <StyledTableCell>

                                    <IconButton
                                        aria-label="edit"
                                        color="warning"
                                        onClick={() => updateCatg(row)}
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

            {selectedCatg && (
                <DeleteConfirmationDialog
                    open={deleteOpen}
                    handleClose={handleDeleteClose}
                    handleConfirm={handleDeleteConfirm}
                    selectedPersonInfo={selectedCatg.nombre_categoria}
                />
            )}
        </Paper>
    );
}
