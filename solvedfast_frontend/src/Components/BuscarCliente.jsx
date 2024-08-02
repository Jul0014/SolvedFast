import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Pagination,
  TablePagination
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FormCliente from "./FormCliente";
import axios from "axios";

const BuscarCliente = ({ handleSelectCliente, handleNext, setActionFlag }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalClientes, setTotalClientes] = useState(0);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('token'); 

  //AGREGAR  CLIENTES INICIO
  const [telefonos, setTelefonos] = useState([]);
  const [openSubModal, setSubModal] = useState(false);
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [formValues, setFormValues] = useState({
    _id: "",
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
        searchSimilar, 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        );

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
    /*axios
      .post("http://localhost:8000/api/cliente", formValues)
      .then((response) => {
        handleClose();
        toast.success("Cliente creado con éxito");
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error creating cliente:", error);
        toast.error("Error al crear el cliente: " + error.response.data.error);
        handleClose();
        setRefresh(!refresh);
      });*/
    console.log(formValues);
    handlePickCliente(formValues);
    handleNext();
    setActionFlag(1);
  };
  //AGREGAR CLIENTES FIN

  const handleAddCliente = (cliente) => {
    setClientes([...clientes, cliente]);
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

  const handleSetCurrentPage = async (event, page) => {
    setCurrentPage(page);
    await handleFind(page);
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchClientes = async (page, perPage) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/clientes`, {
        params: {
          page: page + 1, // The API expects 1-based page number
          perPage: rowsPerPage,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setClientes(response.data.clientes);
      setTotalClientes(response.data.totalPages * perPage);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      num_telefono: telefonos,
    }));
  }, [telefonos]);

  const handleFind = async () => {
    try {
        await axios
        .post("http://localhost:8000/api/cliente/find", { data: searchQuery }, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      })
        .then((response) => {
          setClientes(response.data.clientes);
          setCurrentPage(0);
        })
        .catch((error) => {
          console.error("Error searching clientes:", error);
        });
    } catch (error) {
      console.error("Error al buscar clientes:", error);
    }
  };

  const handlePickCliente = (cliente) => {
    setActionFlag(0);
    setClienteSeleccionado(cliente);
    handleSelectCliente(cliente);
  };

  const handleSelectClient = (client) => {
    handlePickCliente(client);
    handleNext();
  }

  const handleOpenCrearCliente = () => {
    setActionFlag(1);
    setOpen(true);
  }


  return (
    <Grid container spacing={2} height={"40vh"}>
      <Grid item xs={12}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={7}>
            <TextField
              label="Buscar por nombre, DNI o teléfono"
              margin="normal"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" onClick={handleFind}>
              Buscar
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
                color="success"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCrearCliente}
              >
                {" "}
                Crear Cliente
              </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "25vh", overflowY: "auto" }}
        >
          {" "}
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  fontWeight: "bold",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <TableCell>Nombre</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Referencia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow
                  key={cliente._id}
                  onClick={() => handlePickCliente(cliente)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      clienteSeleccionado &&
                      clienteSeleccionado._id === cliente._id
                        ? "#e0e0e0"
                        : "inherit",
                  }}
                >
                  <TableCell>{cliente.nombres}</TableCell>
                  <TableCell>{cliente.documento_identidad ? cliente.documento_identidad : "No se proporcionó"}</TableCell>
                  <TableCell>{cliente.num_telefono[0]}</TableCell>
                  <TableCell>{cliente.direccion}</TableCell>
                  <TableCell>{cliente.referencia ? cliente.referencia: "No se proporcionó"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10]}
            component = "div"
            rowsPerPage={rowsPerPage}
            count={parseInt(totalClientes)}
            page={parseInt(currentPage)}
            onChange={handleSetCurrentPage}
            onPageChange={(event, newPage) => handleChangePage(newPage)}
          />
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
          handleSelect={handleSelectClient}
          setActionFlag={setActionFlag}
        ></FormCliente>
      </Grid>
    </Grid>
  );
};

export default BuscarCliente;
