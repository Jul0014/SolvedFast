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

export default function Clientes() {
  /* Telefono y Especialidades */
  const [telefonos, setTelefonos] = useState([]);

  // Update formValues.num_telefono when telefonos changes
  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      num_telefono: telefonos,
    }));
  }, [telefonos]);

  /* Get Clientes */
  const [clientes, setClientes] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalClientes, setTotalClientes] = useState(0);
  const token = localStorage.getItem('token'); 

  const fetchClientes = async (page, rowsPerPage) => {
    // Retrieve token from localStorage or wherever it's stored

    try {
      const response = await axios.get("http://localhost:8000/api/clientes", {
        params: {
          page: page + 1, // The API expects 1-based page number
          perPage: rowsPerPage,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setClientes(response.data.clientes);
      setTotalClientes(response.data.totalPages * rowsPerPage);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes(page, rowsPerPage);
  }, [page, rowsPerPage, refresh]);

  /* Create Form Values */
  const [open, setOpen] = useState(false);
  const [openSubModal, setSubModal] = useState(false);
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [formValues, setFormValues] = useState({
    documento_identidad: "",
    tipo_documento: "0",
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    distrito: "",
    provincia: "",
    direccion: "",
    referencia: "",
    comentario: "",
    num_telefono: [],
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTelefonos([]);
    setFormValues({
      documento_identidad: "",
      tipo_documento: "0",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      distrito: "",
      provincia: "",
      direccion: "",
      referencia: "",
      comentario: "",
      num_telefono: [],
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
    const searchSimilar = {
      nombres: formValues.nombres,
      apellido_paterno: formValues.apellido_paterno,
      apellido_materno: formValues.apellido_materno,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/cliente/similar",
        searchSimilar, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });

      const similarClientes = response.data.clientesEncontrados;
      console.log(similarClientes);
      if (similarClientes.length > 0) {
        setClientesEncontrados(response.data.clientesEncontrados);
        setSubModal(true);
      } else {
        handleCreateClienteAnyway();
      }
    } catch (error) {
      console.error("Error creating cliente:", error);
    }
  };

  const handleCreateClienteAnyway = (event) => {
    axios
      .post("http://localhost:8000/api/cliente", formValues, 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        )
      .then((response) => {
        handleClose();
        setSubModal(false);
        toast.success("Cliente creado correctamente");
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error creating cliente:", error);
        toast.error("Error al crear el cliente: " + error.response.data.error);
        handleClose();
        setRefresh(!refresh);
      });
  };

  /* Edit Form Values */
  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpenEdit = (row) => {
    setOpen(false);
    setSubModal(false);
    setFormValues(row);
    setTelefonos(row.num_telefono);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);

    setFormValues({
      documento_identidad: "",
      tipo_documento: "0",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      distrito: "",
      provincia: "",
      direccion: "",
      referencia: "",
      comentario: "",
      num_telefono: [],
    });

    setTelefonos([]);
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/api/cliente/${formValues._id}`, formValues, 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );
     
      handleCloseEdit();
      setRefresh(!refresh);
      toast.success("Cliente actualizado con éxito");
    } catch (error) {
      console.error("Error updating cliente:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error("Error al actualizar el cliente: " + error.response.data.error);
      } else {
        toast.error("Error al actualizar el cliente.");
      }
      handleCloseEdit();
      setRefresh(!refresh);
    }
  };

  /* Delete */
  const handleDeleteCliente = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/cliente/${id}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );
      setRefresh(!refresh);
      toast.success("Cliente eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar suspención cliente: " + error.message);
      setRefresh(!refresh);
    }
  };

  /* Search Query*/
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = () => {
    if (searchQuery === "") {
      setRefresh(!refresh);
    } else {
      console.log(searchQuery);
      axios
        .post("http://localhost:8000/api/cliente/find", { data: searchQuery }, 
          {
              headers: {
                  "Authorization": `Bearer ${token}`,
              }
          }
          )
        .then((response) => {
          setClientes(response.data.clientes);
          setPage(0);
        })
        .catch((error) => {
          console.error("Error finding cliente:", error);
          toast.error("Error al encontrar al cliente: " + error.message);
        });
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
            <Typography variant="h2">Clientes</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="success"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
              >
                AGREGAR CLIENTE
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ pt: 1, pl: 6, pr: 6 }}
        >
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Buscar técnico por dato"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                color="primary"
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearchSubmit}
              >
                BUSCAR CLIENTE
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
            <ClientesTable
              rows={clientes}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={totalClientes}
              updateCliente={handleClickOpenEdit}
              deleteCliente={handleDeleteCliente}
            ></ClientesTable>
          </Grid>
        </Grid>
      </Box>

      <FormCliente
        open={open}
        title={"Agregar Cliente"}
        handleClose={handleClose}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmit}
        telephons={telefonos}
        setTelephons={setTelefonos}
        openSubModal={openSubModal}
        subModaltitle={"Clientes Similares"}
        setSubModal={setSubModal}
        encontrados={clientesEncontrados}
        handleCreateAnyway={handleCreateClienteAnyway}
        handleSelect={handleClickOpenEdit}
      ></FormCliente>

      <FormCliente
        open={openEdit}
        title={"Editar Cliente"}
        handleClose={handleCloseEdit}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmitEdit}
        telephons={telefonos}
        setTelephons={setTelefonos}
      ></FormCliente>
    </Fragment>
  );
}
