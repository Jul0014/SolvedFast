import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";


export const AsignarTecnicoDialog = ({
  open,
  onClose,
  handleAsignarTecnico,
  servicio,
  day,
  servicios
}) => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoSelected, setTecnicoSelected] = useState({});
  const [error, setError] = useState({})
  const token = localStorage.getItem('token'); 
  
  const tecnico = servicio.tecnico
  
  
  useEffect(() => {
    if (!tecnico) {
      setTecnicoSelected({ _id: " " });
    } else {
      setTecnicoSelected(tecnico);
    }

    axios
      .get("http://localhost:8000/api/tecnicosAvailable", 
        {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }
        )
      .then((res) => {
        console.log("tecnicos ", res.data.tecnicos)
        setTecnicos(res.data.tecnicos);
      })
      .catch((err) => {
        console.log(err);
      });
    
  }, []);  
  

  const handleSubmitForm = () => {
    console.log(servicios);
    console.log(tecnicoSelected);
  
    // Filter servicios based on tecnicoSelected
    const filteredServicios = servicios.filter((servicio) => servicio.tecnico && servicio.tecnico._id == tecnicoSelected._id);
  
    // Check if there are 10 or more servicios
    if (filteredServicios.length >= 10) {
      toast.error('No se pueden asignar más servicios a este técnico.');
      return;
    }
  
    // Proceed with assigning the tecnico
    if (tecnicoSelected._id === " ") {
      setError({ tecnico: "Se necesita un Técnico para reprogramar" });
    } else {
      handleAsignarTecnico(servicio, tecnicoSelected._id);
    }
  };



  const handleInputChange = (e) => {
    const { value } = e.target;

    if (!value) {
      setTecnicoSelected({ _id: " " });
    } else {
      setTecnicoSelected(value);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Asignar un técnico al servicio</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={tecnicos}
          getOptionLabel={(option) => option.nombres}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          value={
            tecnicos.find((item) => item._id === tecnicoSelected._id) || null
          }
          onChange={(event, newValue) => {
            handleInputChange({
              target: {
                name: "tecnico",
                value: newValue,
              },
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="tecnico" fullWidth margin="normal" error={!!error.tecnico} helperText={error.tecnico} />
          )}
        ></Autocomplete>

        <Button fullWidth variant="contained" onClick={handleSubmitForm}>
          Asignar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
