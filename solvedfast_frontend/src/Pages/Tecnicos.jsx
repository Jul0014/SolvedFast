import * as React from "react";
import { Fragment, useState, useEffect } from "react";
import CustomizedTable from "../Components/Table";

import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import FormTecnico from "../Components/FormTecnico";
import FormSuspencion from "../Components/FormSuspencion";
import FormQuitarSuspencion from "../Components/FormQuitarSuspencion";
import Menu from "../Components/Menu";

import axios from "axios";
import dayjs from "dayjs";

import { toast } from "react-toastify";

export default function Tecnicos() {
  /* Telefono y Especialidades */
  const [telefonos, setTelefonos] = useState([]);

  // Update formValues.num_telefono when telefonos changes
  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      num_telefono: telefonos,
    }));
  }, [telefonos]);

  const [especialidadesArray, setEspecialidades] = useState([]);

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      especialidad: especialidadesArray,
    }));
  }, [especialidadesArray]);

  /* Get Técnicos */
  const [tecnicos, setTecnicos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem('token'); 

  const fetchTecnicos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tecnicos`, {
        params: {
          page: page + 1, // The API expects 1-based page number
          perPage: rowsPerPage,
        },
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      console.log(response.data.tecnicos);
      setTecnicos(response.data.tecnicos);
      setTotal(response.data.totalPages * rowsPerPage);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTecnicos(page, rowsPerPage);
  }, [page, rowsPerPage, refresh]);

  /* Create Form Values */
  const [open, setOpen] = useState(false);
  const [openSubModal, setSubModal] = useState(false);
  const [tecnicosEncontrados, setTecnicosEncontrados] = useState([]);
  const [formValues, setFormValues] = useState({
    _id: "",
    documento_identidad: "",
    tipo_documento: "1", // Ensure this is a string if MenuItem values are strings
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    num_telefono: [],
    especialidad: [], // Initialize as an empty array
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setFormValues({
      _id: "",
      documento_identidad: "",
      tipo_documento: "1",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      num_telefono: [],
      especialidad: [], // Reset to initial empty array
    });

    setTelefonos([]);
    setEspecialidades([]);
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
        "http://localhost:8000/api/tecnico/similar",
        searchSimilar, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });

      const similarTecnicos = response.data.tecnicosEncontrados;
      if (similarTecnicos.length > 0) {
        setTecnicosEncontrados(response.data.tecnicosEncontrados);
        setSubModal(true);
      } else {
        handleCreateClienteAnyway();
      }
    } catch (error) {
      console.error("Error creating tecnico:", error);
    }
  };

  const handleCreateClienteAnyway = (event) => {
    axios
      .post("http://localhost:8000/api/tecnico", formValues, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    })
      .then((response) => {
        handleClose(false);
        setSubModal(false);
        toast.success("Tecnico creado con éxito");
        setTelefonos([]);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.error("Error creating tecnico:", error);
        toast.error("Error al crear el técnico: " + error.response.data.error);
        handleClose(false);
        setSubModal(false);
        setTelefonos([]);
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

    const elements = [];
    row.especialidad.map((element) => {
      elements.push(element._id);
    });
    setEspecialidades(elements);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);

    setFormValues({
      _id: "",
      documento_identidad: "",
      tipo_documento: "1",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      num_telefono: [],
      especialidad: [], // Reset to initial empty array
    });

    setTelefonos([]);
    setEspecialidades([]);
  };

  const handleSubmitEdit = () => {
    axios
      .put(`http://localhost:8000/api/tecnico/${formValues._id}`, formValues, {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
      })
      .then((response) => {
        handleCloseEdit();
        setRefresh(!refresh);
        toast.success("Tecnico actualizado con éxito");
      })
      .catch((error) => {
        console.error("Error creating tecnico:", error);
        toast.error(
          "Error al actualizar el técnico: " + error.response.data.error
        );
        setRefresh(!refresh);
        handleCloseEdit();
      });
  };

  /* Ban Form Values */
  const [openSus, setOpenSus] = useState(false);
  const [formValuesSus, setFormValuesSus] = useState({
    suceso: "",
    comentario: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const handleClickOpenSus = (row) => {
    setFormValues(row);
    setOpenSus(true);
  };

  const handleCloseSus = () => {
    setOpenSus(false);

    setFormValues({
      _id: "",
      documento_identidad: "",
      tipo_documento: "1",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      num_telefono: [],
      especialidad: [], // Reset to initial empty array
    });

    setFormValuesSus({
      suceso: "",
      comentario: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
  };

  const handleChangeSus = (event) => {
    const { name, value } = event.target;
    setFormValuesSus({ ...formValuesSus, [name]: value });
  };

  const handleDateChange = (name, date) => {
    if (date && dayjs(date).isValid()) {
      setFormValuesSus({ ...formValuesSus, [name]: date.toISOString() });
    } else {
      console.error("Invalid date input:", date);
    }
  };

  const isValidInput = (inputValue) => {
    // Check if the input value matches the expected format
    // You can use any validation method suitable for your application
    return /^(\d{1,2}\/\d{1,2}\/\d{4})$/.test(inputValue);
  };

  const handleInputChange = (name, inputValue) => {
    // Validate the input value before setting it to state
    console.log(inputValue);
    if (isValidInput(inputValue)) {
      setFormValues({
        ...formValues,
        [name]: inputValue,
      });
    }
  };

  const handleSubmitSus = () => {
    axios
      .put(
        `http://localhost:8000/api/tecnico/suspender/${formValues._id}`,
        formValuesSus, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      })
      .then((response) => {
        handleCloseSus();
        setRefresh(!refresh);
        toast.success("Técnico suspendido con éxito");
      })
      .catch((error) => {
        console.error("Error al suspender tecnico:", error.message);
        toast.error("Error al suspender tecnico: " + error.message);
        setRefresh(!refresh);
        handleCloseSus();
      });
  };

  /* Errase Ban Form Values */
  const [openQSus, setOpenQSus] = useState(false);
  const [formValuesQSus, setFormValuesQSus] = useState({
    suceso: "",
    comentario: "",
  });

  const handleClickOpenQSus = (row) => {
    setFormValues(row);
    setOpenQSus(true);
  };

  const handleCloseQSus = () => {
    setOpenQSus(false);

    setFormValues({
      documento_identidad: "",
      tipo_documento: "1",
      nombres: "",
      apellido_paterno: "",
      apellido_materno: "",
      num_telefono: [],
      especialidad: [], // Reset to initial empty array
    });

    setFormValuesQSus({
      suceso: "",
      comentario: "",
    });
  };

  const handleChangeQSus = (event) => {
    const { name, value } = event.target;
    setFormValuesQSus({ ...formValuesQSus, [name]: value });
  };

  const handleSubmitQSus = () => {
    // Handle form submission logic
    console.log(formValuesQSus);
    console.log(formValues._id);

    axios
      .put(
        `http://localhost:8000/api/tecnico/quitarsus/${formValues._id}`,
        formValuesQSus, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      })
      .then((response) => {
        handleCloseQSus();
        setRefresh(!refresh);
        toast.success("Suspención eliminada con éxito");
      })
      .catch((error) => {
        console.error("Error al eliminar suspención tecnico:", error.message);
        handleCloseQSus();
        toast.error("Error al eliminar suspención tecnico: " + error.message);
        setRefresh(!refresh);
      });
  };

  /* Search Query*/
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = () => {
    if (searchQuery === "") {
      setRefresh(!refresh);
    } else {
      console.log(searchQuery);
      axios
        .post("http://localhost:8000/api/tecnico/find", { data: searchQuery }, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      })
        .then((response) => {
          setTecnicos(response.data.tecnicos);
          setPage(0);
          //limpiar query?
        })
        .catch((error) => {
          console.error("Error finding tecnico:", error);
          toast.error(
            "Error al encontrar al tecnico: " + error.response.data.error
          );
        });
    }
  };

  /* Delete */

  const handleDeleteTecnico = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/tecnico/${id}`, {
          headers: {
              "Authorization": `Bearer ${token}`,
          }
      });
      setRefresh(!refresh);
      toast.success("Tecnico eliminado con éxito");
    } catch (error) {
      toast.error("Error al eliminar suspención tecnico: " + error.message);
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
            <Typography variant="h2">Técnicos</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                color="success"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
              >
                AGREGAR TÉCNICO
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
                BUSCAR TÉCNICO
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
            <CustomizedTable
              openSus={handleClickOpenSus}
              openQSus={handleClickOpenQSus}
              rows={tecnicos}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={total}
              deleteTecnico={handleDeleteTecnico}
              updateTecnico={handleClickOpenEdit}
            ></CustomizedTable>
          </Grid>
        </Grid>
      </Box>

      <FormTecnico
        open={open}
        title={"Agregar Técnico"}
        handleClose={handleClose}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmit}
        telephons={telefonos}
        setTelephons={setTelefonos}
        especialidadesArray={especialidadesArray}
        setEspecialidadesArray={setEspecialidades}
        openSubModal={openSubModal}
        subModaltitle={"Técnicos Similares"}
        setSubModal={setSubModal}
        tecnicosEncontrados={tecnicosEncontrados}
        handleCreateTecnicoAnyway={handleCreateClienteAnyway}
        handleSelectTecnico={handleClickOpenEdit}
      ></FormTecnico>
      <FormTecnico
        open={openEdit}
        title={"Editar Técnico"}
        handleClose={handleCloseEdit}
        formValues={formValues}
        handleChange={handleChange}
        handleSubmitForm={handleSubmitEdit}
        telephons={telefonos}
        setTelephons={setTelefonos}
        especialidadesArray={especialidadesArray}
        setEspecialidadesArray={setEspecialidades}
      ></FormTecnico>
      <FormSuspencion
        open={openSus}
        handleClose={handleCloseSus}
        formValues={formValuesSus}
        handleChange={handleChangeSus}
        handleDateChange={handleDateChange}
        handleSubmit={handleSubmitSus}
        handleInputChange={handleInputChange}
      ></FormSuspencion>
      <FormQuitarSuspencion
        open={openQSus}
        handleClose={handleCloseQSus}
        formValues={formValuesQSus}
        handleChange={handleChangeQSus}
        handleSubmit={handleSubmitQSus}
      ></FormQuitarSuspencion>
    </Fragment>
  );
}
