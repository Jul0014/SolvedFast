import * as React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { IconButton, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import especialidadSchema from '../js/especialidadSchema';
import { TableFList } from './TableLists';
import axios from 'axios';

export default function AddEspecialidadForm({ elementsArray, setTF }) {
    const [especialidadesDS, setEspDS] = useState([]);
    const [catalogoEsp, setCatalogEsp] = useState([]);
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/especialidades', 
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    }
                    );
                setCatalogEsp(response.data.especialidades);

                if (elementsArray.length != 0) {
                    let filteredEspecialidades = response.data.especialidades
                        .filter(especialidad => 
                            elementsArray.includes(especialidad._id)
                        ).map(especialidad => especialidad.nombre_especialidad);
                    setEspDS(filteredEspecialidades);
                }
            } catch (error) {
                console.error("Hubo un error al obtener las especialidades", error);
            }
        };

        fetchEspecialidades();
    }, []);

    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: yupResolver(especialidadSchema),
        defaultValues: { especialidad: '' }
    });

    const handleFieldAdd = (data) => {
        const selectedEspecialidad = catalogoEsp.find(e => e._id === data.especialidad);

        if (!selectedEspecialidad) {
            setError("especialidad", {
                type: "manual",
                message: "Especialidad no válida",
            });
            return;
        }

        const found = elementsArray.find((element) => element === selectedEspecialidad._id);
        
        if (found != null) {
            setError("especialidad", {
                type: "manual",
                message: "Ya ha sido añadido",
            });
            return;
        }

        if (elementsArray.length >= 5) {
            setError("especialidad", {
                type: "manual",
                message: "No se pueden añadir más de 5 especialidades",
            });
            return;
        }

        setTF((prevArray) => {
            return [...prevArray, selectedEspecialidad._id];
        });

        setEspDS((prevArray) => {
            return [...prevArray, selectedEspecialidad.nombre_especialidad];
        });

        reset();  // Reset the form field value
    };

    const handleEraseField = (index) => {
        const newArray = [...elementsArray];
        newArray.splice(index, 1);
        setTF(newArray);

        const newArrayShow = [...especialidadesDS];
        newArrayShow.splice(index, 1);
        setEspDS(newArrayShow);
    };

    return (
        <Fragment>
            <TableFList 
                listElements={especialidadesDS} 
                labelField={"Especialidades"} 
                handleEraseField={handleEraseField} 
            />
            <form onSubmit={handleSubmit(handleFieldAdd)}>
                <Grid
                    spacing={2}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                >
                    <Grid item xs={5}>
                        <FormControl fullWidth>
                            <Controller
                                name="especialidad"
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <FormControl fullWidth error={Boolean(errors.especialidad)}>
                                            <InputLabel id="especialidad">Especialidad *</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="especialidad"
                                                label="Especialidad"
                                                value={field.value || ''}
                                            >
                                                <MenuItem key="default" value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {catalogoEsp.map((especialidad) => (
                                                    <MenuItem key={especialidad._id} value={especialidad._id}>
                                                        {especialidad.nombre_especialidad}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <Typography variant="caption" color={'error'}>
                                                {errors.especialidad && <Typography variant="caption" color={'error'}>{errors.especialidad.message}</Typography>}
                                            </Typography>
                                        </FormControl>
                                    </div>
                                )}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton type="submit">
                            <AddIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </form>
        </Fragment>
    );
}