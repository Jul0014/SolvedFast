import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import FormServicio from "./FormServicio";
export const CrearServicio = ({ onAddService, findSimilarServices, findSimilarServicesBack, countServicios, setSelectedDate }) => {
  const [dialogOpen, setDialogOpen] = useState(true);


  return (
    <Box>
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            color="success"
        >
            Agregar Servicio
        </Button>
        <FormServicio
        onAddService={onAddService}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        findSimilarServices={findSimilarServices}
        findSimilarServicesBack={findSimilarServicesBack}
        countServicios={countServicios}
        setSelectedDate={setSelectedDate}
        />
    </Box>
  );
};