import * as yup from 'yup';

const quitarSuspensionSchema = yup.object().shape({
    suceso: yup.string().required('Suceso es requerido'),
    comentario: yup.string().nullable(true).notRequired().max(120, "Comentario no puede tener más de 120 caracteres"),
});

export default quitarSuspensionSchema;