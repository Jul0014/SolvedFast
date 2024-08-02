import * as React from 'react';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Table, TableBody, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

export function TableFList({ listElements, labelField, handleEraseField }) {
    return (
        <TableContainer component={Paper} sx={{mt: 2}}>
            <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>{labelField}</StyledTableCell>
                        <StyledTableCell>Acción</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {listElements.map((element, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {element}
                            </StyledTableCell>
                            <StyledTableCell>
                                <IconButton 
                                    aria-label="delete" 
                                    color="error"
                                    onClick={() => handleEraseField(index)}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}