import * as React from 'react';
import { Fragment } from 'react';
import { IconButton, TextField, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import telephonNumberSchema from '../js/telefonNumberSchema';
import { TableFList } from './TableLists';

export default function AddTelephonNumberForm({elementsArray, setTF}) {
    const { control, handleSubmit, reset, formState: { errors }, setError } = useForm({
        resolver: yupResolver(telephonNumberSchema),
        defaultValues: { num_telefono: "" }
    });

    const handleFieldAdd = (data) => {
        if (!data.num_telefono || data.num_telefono.trim() === "") {
            setError("num_telefono", {
                type: "manual",
                message: "No puede estar vacío",
            });
            return;
        }

        const found = elementsArray.find((element) => element === data.num_telefono);
        if (found != null) {
            setError("num_telefono", {
                type: "manual",
                message: "Ya ha sido añadido",
            });
            return;
        }

        if (elementsArray.length >= 5) {
            setError("num_telefono", {
                type: "manual",
                message: "No se pueden añadir más de 5 números",
            });
            return;
        }

        setTF((prevArray) => {
            return [...prevArray, data.num_telefono];
        });

        reset();  // Reset the form field value
    };

    const handleEraseField = (index) => {
        const newArray = [...elementsArray];
        newArray.splice(index, 1);
        setTF(newArray);
    };

    return (
        <Fragment>
            <TableFList 
                listElements={elementsArray} 
                labelField={"Número de Teléfono"} 
                handleEraseField={handleEraseField} 
            />
            <form onSubmit={handleSubmit(handleFieldAdd)}>
                <Grid
                    spacing={2}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{mt: 2}}
                >
                    <Grid item xs={5}>
                        <Controller
                            name="num_telefono"
                            control={control}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    label="Nuevo teléfono"
                                    type="text"
                                    error={!!errors.num_telefono}
                                    helperText={errors.num_telefono?.message}
                                />
                            )}
                        />
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