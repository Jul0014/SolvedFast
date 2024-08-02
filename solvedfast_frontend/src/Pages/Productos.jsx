import * as React from "react";
import { Fragment, useState, useEffect } from "react";
import Menu from "../Components/Menu";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import axios from "axios";
import { toast } from "react-toastify";
import ProductosTable from "../Components/ProductosTable";
import FormProducto from "../Components/FormProducto";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProductos, setTotalProductos] = useState(0);
  const [formValues, setFormValues] = useState({
    nombre_producto: "",
    marca: "",
    categoria: "",
  });
  const [productosEncontrados, setProductosEncontrados] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const token = localStorage.getItem('token'); 

  const fetchProductos = async (page, rowsPerPage) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/productos`, {
        params: {
          page: page + 1, // The API expects 1-based page number
          perPage: rowsPerPage,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setProductos(response.data.productos);
      setTotalProductos(response.data.totalPages * rowsPerPage);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos(page, rowsPerPage);
  }, [page, rowsPerPage, refresh]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({
      nombre_producto: "",
      marca: "",
      categoria: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/producto",
        formValues, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      toast.success("Producto creado exitosamente");
      handleClose();
      setRefresh(!refresh); // Este refresh parece estar diseñado para forzar la recarga de productos, asegúrate de que funcione correctamente
  
      // Aquí deberías actualizar la lista de productos
      fetchProductos(page, rowsPerPage); // Llama a la función para obtener los productos nuevamente
    } catch (error) {
      console.error("Error creating producto:", error);
      toast.error("Error al crear el producto: " + error.response.data.error);
      handleClose();
      setRefresh(!refresh); // Asegúrate de que esto también esté funcionando correctamente
    }
  };
  
  const handleDisableProducto = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/producto/disable/${id}`, {}, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      setRefresh(!refresh);
      toast.success("Producto deshabilitado con éxito");
    } catch (error) {
      toast.error("Error al deshabilitar el producto: " + error.message);
      setRefresh(!refresh);
    }
  };

  const handleDeleteProducto = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/producto/${id}`, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      setRefresh(!refresh);
      toast.success("Producto eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar el producto: " + error.message);
      setRefresh(!refresh);
    }
  };

  const handleClickOpenEdit = (row) => {
    setOpen(false);
    setFormValues(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setFormValues({
      nombre_producto: "",
      marca: "",
      categoria: "",
    });
  };

  const handleSubmitEdit = async () => {
    try {
      console.log(formValues);
      const response = await axios.put(
        `http://localhost:8000/api/producto/${formValues._id}`,
        formValues, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      handleCloseEdit();
      setRefresh(!refresh);
      toast.success("Producto actualizado exitosamente");
    } catch (error) {
      console.error("Error updating producto:", error);
      toast.error(
        "Error al actualizar el producto: " +
          (error.response.data.error || "Error desconocido")
      );
      handleCloseEdit();
      setRefresh(!refresh);
    }
  };

  return (
    <Fragment>
      <Menu />
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 4, pl: 6, pr: 6 }}
        >
          <Grid item xs={12} md={8}>
            <Typography variant="h2">Productos</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="success"
                variant="contained"
                onClick={handleClickOpen}
              >
                AGREGAR PRODUCTO
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          direction="column"
          justifyContent="flex-end"
          sx={{ pt: 4, pl: 6, pr: 6 }}
        >
            <Grid item xs={12} md={12}>
            <ProductosTable
              rows={productos}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={totalProductos}
              updateProd={handleClickOpenEdit}
              disableProd={handleDisableProducto}
            />
          </Grid>
        </Grid>
      </Box>

      <FormProducto
        open={open}
        title={"Agregar Producto"}
        handleClose={handleClose}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmit}
        openSubModal={false} // Debería estar abierto si hay productos similares encontrados
        subModaltitle={"Productos Similares"}
        encontrados={productosEncontrados}
        handleSelect={handleClickOpenEdit}
      />
      <FormProducto
        open={openEdit}
        title={"Editar Producto"}
        flagEdit={true}
        handleClose={handleCloseEdit}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmitEdit}
      />
    </Fragment>
  );
}