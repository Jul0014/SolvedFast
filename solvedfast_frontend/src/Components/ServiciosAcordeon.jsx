import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ServiciosAcordeon = ({ servicios, productos, getMarcaProductById, getProductNameById, actionFlag }) => {

  const [serviciosList, setServiciosList] = useState(servicios);

  const [productosList, setProductosList] = useState(productos);

  const deleteItem = (index) => {
    const updatedServicios = [...serviciosList];
    servicios.splice(index, 1);
    updatedServicios.splice(index, 1);
    setServiciosList(updatedServicios);
  };


  useEffect(() => {
    setServiciosList(servicios);
    setProductosList(productos);
  }, [servicios, productos]);

  return (
    <Box
      width="100%"
      height={"33vh"}
      mt={2}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Box maxHeight={"32vh"} overflow="auto" width={"50%"}>
        {serviciosList.length === 0 && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography sx={{ fontWeight: "bold" }}>
              No hay servicios para mostrar
            </Typography>
            <Typography>Los servicios se mostrarán aquí</Typography>
          </Box>
        )}
        {serviciosList.map((servicio, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1">{`Servicio: ${getProductNameById(servicio.producto)}`}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Número de Llamada:</strong>{" "}
                    {servicio.numero_llamada}
                  </Typography>
                  <Typography>
                    <strong>Tienda:</strong> {servicio.tienda}
                  </Typography>
                  <Typography>
                    <strong>Marca:</strong> {getMarcaProductById(servicio.producto)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Fecha de Visita:</strong> {servicio.fecha_visita}
                  </Typography>
                  <Typography>
                    <strong>Tipo Servicio:</strong> {servicio.tipo_servicio}
                  </Typography>
                  <Typography>
                    <strong>Turno:</strong> {servicio.turno}
                  </Typography>
                  <Typography>
                    <strong>Color:</strong>{" "}
                    <span
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        backgroundColor: servicio.color,
                      }}
                    ></span>
                  </Typography>
                </Grid>
                <Button onClick={() => deleteItem(index)}>eliminar</Button>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};