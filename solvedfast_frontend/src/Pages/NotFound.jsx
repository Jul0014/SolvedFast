import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const style = {
        height: 350,
    };

    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/');
    };

    return (
        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        >
            <Typography variant="h2" component="div" gutterBottom>
                401 - Necesitas autenticación
            </Typography>
            <Typography variant="body1" component="div">
                Inicia sesión
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleLoginRedirect}
                sx={{mt:4}}
            >
                Iniciar Sesión
            </Button>
        </Box>
    );
};

export default NotFound;