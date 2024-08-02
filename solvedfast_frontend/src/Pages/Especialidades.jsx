import * as React from "react";
import { Fragment, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-toastify";
import EspecialidadTable from "../Components/EspecialidadTable";
import FormCatgEsp from "../Components/FormCatgEsp";
import AddIcon from "@mui/icons-material/Add";
import Menu from "../Components/Menu";

export default function Especialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEspecialidades, setTotalEspecialidades] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const token = localStorage.getItem('token'); 
  const [formValues, setFormValues] = useState({
    id: "",
    nombre: "",
  });

  const fetchEspecialidades = async (page, rowsPerPage) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/especialidades`, {
        params: {
          page: page + 1, // The API expects 1-based page number
          perPage: rowsPerPage,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setEspecialidades(response.data.especialidades);
      setTotalEspecialidades(response.data.totalPages * rowsPerPage);
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    }
  };

  useEffect(() => {
    fetchEspecialidades(page, rowsPerPage);
  }, [page, rowsPerPage, refresh]);

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
      nombre_especialidad: formValues.nombre
    };
    axios
      .post("http://localhost:8000/api/especialidad", value, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
      .then((response) => {
        handleClose();
        toast.success("Especialidad creada con éxito");
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error creating especialidad:", error);
        toast.error("Error al crear el especialidad: " + error.response.data.error);
        handleClose();
        setRefresh(!refresh);
      });
  };

  /* Edit Form  Values */

  const handleClickOpenEdit = (row) => {
    setOpen(false);
    setFormValues({id: row._id, nombre: row.nombre_especialidad});
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
      nombre_especialidad: formValues.nombre
    };

    try {
      const response = await axios.put(`http://localhost:8000/api/especialidad/${formValues.id}`, value, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
      handleCloseEdit();
      setRefresh(!refresh);
      toast.success("Especialidad actualizada con éxito");
    } catch (error) {
      console.error("Error updating especialidad:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error("Error al actualizar la especialidad: " + error.response.data.error);
      } else {
        toast.error("Error al actualizar la especialidad.");
      }
      handleCloseEdit();
      setRefresh(!refresh);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/especialidad/disable/${id}`, {}, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      setRefresh(!refresh);
      toast.success("Especialidad eliminada con éxito");
    } catch (error) {
      toast.error("Error al eliminar especialidad: " + error.message);
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
            <Typography variant="h2">Especialidades</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="success"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
              >
                AGREGAR ESPECIALIDAD
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
            <EspecialidadTable
              rows={especialidades}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={totalEspecialidades}
              updateEsp={handleClickOpenEdit}
              deleteEsp={handleDelete}
            />
          </Grid>
        </Grid>
      </Box>

      <FormCatgEsp
        open={open}
        title={"Agregar Especialidad"}
        flagEdit={false}
        handleClose={handleClose}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmit}
      />

      <FormCatgEsp
        open={openEdit}
        title={"Editar Especialidad"}
        flagEdit={true}
        handleClose={handleCloseEdit}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmitEdit}
      />
    </Fragment>
  );
}
