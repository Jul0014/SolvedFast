import * as yup from 'yup';

const especialidadSchema = yup.object().shape({
    especialidad: yup.string().required("Especialidad es requerido")
});

export default especialidadSchema;