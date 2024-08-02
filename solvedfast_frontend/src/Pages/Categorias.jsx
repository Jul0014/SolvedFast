import * as React from "react";
import { Fragment, useState, useEffect } from "react";
import ClientesTable from "../Components/ClientesTable";
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

import FormCliente from "../Components/FormCliente";
import CategoriaTable from "../Components/CategoriaTable";
import FormCatgEsp from "../Components/FormCatgEsp";

export default function Categorias() {

  /* Get Categorias */
  const [categorias, setCategorias] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const token = localStorage.getItem('token'); 

  const fetchCategorias = async (page, rowsPerPage) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/categorias`, {
        params: {
          page: page + 1, // The API expects 1-based page number
          perPage: rowsPerPage,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setCategorias(response.data.categorias);
      setTotalCategorias(response.data.totalPages * rowsPerPage);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  useEffect(() => {
    fetchCategorias(page, rowsPerPage);
  }, [page, rowsPerPage, refresh]);

  /* Create Form Values */
  const [open, setOpen] = useState(false);
  const [openSubModal, setSubModal] = useState(false);
  const [formValues, setFormValues] = useState({
      id: "",
      nombre: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({
      id: "",
      nombre: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    const value = {
      nombre_categoria: formValues.nombre
    }
    axios
      .post("http://localhost:8000/api/categoria", value, 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        )
      .then((response) => {
        handleClose();
        toast.success("Categoría creada con éxito");
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error creating categoría:", error);
        toast.error("Error al crear el categoría: " + error.response.data.error);
        handleClose();
        setRefresh(!refresh);
      });
  };

  /* Edit Form  Values */
  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpenEdit = (row) => {
    setOpen(false);
    setSubModal(false);
    setFormValues({id: row._id, nombre: row.nombre_categoria});
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);

    setFormValues({
      id: "",
      nombre: "",
    });
  };

  const handleSubmitEdit = async () => {
    const value = {
      id: formValues.id,      
      nombre_categoria: formValues.nombre
    }

    console.log(formValues)
    console.log(value)
    
    try {
      const response = await axios.put(`http://localhost:8000/api/categoria/${formValues.id}`, value, 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );
     
      handleCloseEdit();
      setRefresh(!refresh);
      toast.success("Categoría actualizada con éxito");
    } catch (error) {
      console.error("Error updating categoría:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error("Error al actualizar la categoría: " + error.response.data.error);
      } else {
        toast.error("Error al actualizar la categoría.");
      }
      handleCloseEdit();
      setRefresh(!refresh);
    }
  };

  /* Delete */
  const handleDelete = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/categoria/disable/${id}`, {},
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );
      setRefresh(!refresh);
      toast.success("Categoría eliminada con éxito");
    } catch (error) {
      toast.error("Error al eliminar categoría: " + error.message);
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
            <Typography variant="h2">Categorías</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="success"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
              >
                AGREGAR CATEGORÍA
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
            <CategoriaTable
              rows={categorias}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={totalCategorias}
              updateCatg={handleClickOpenEdit}
              deleteCatg={handleDelete}
            ></CategoriaTable>
          </Grid>
        </Grid>

        <FormCatgEsp
          open={open}
          title={"Agregar Categoría"}
          flagEdit={false}
          handleClose={handleClose}
          formValues={formValues}
          handleChange={handleChange}
          handleSubmitForm={handleSubmit}
        >
        </FormCatgEsp>

        <FormCatgEsp
        open={openEdit}
        title={"Editar Categoría"}
        flagEdit={true}
        handleClose={handleCloseEdit}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmitEdit}
      ></FormCatgEsp>
      </Box>
    </Fragment>
  );
}