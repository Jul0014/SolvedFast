import * as yup from 'yup';
import { parse, isDate, subDays } from 'date-fns'; // Import subDays function

const suspensionSchema = yup.object().shape({
    suceso: yup.string().required('Suceso es requerido'),
    comentario: yup.string().nullable(true).notRequired().max(120, "Comentario no puede tener más de 120 caracteres"),
    fecha_inicio: yup.date()
        .transform((value, originalValue) => {
            if (isDate(value)) return value;
            const parsedDate = parse(originalValue, "yyyy-MM-dd", new Date());
            return parsedDate;
        })
        .typeError('Fecha de inicio es inválida')
        .required('Fecha de inicio es requerida')
        .min(subDays(new Date(), 1), 'Fecha de inicio no puede ser en el pasado'),
    fecha_fin: yup.date()
        .transform((value, originalValue) => {
            if (isDate(value)) return value;
            const parsedDate = parse(originalValue, "yyyy-MM-dd", new Date());
            return parsedDate;
        })
        .typeError('Fecha de fin es inválida')
        .required('Fecha de fin es requerida')
        .min(yup.ref('fecha_inicio'), 'Fecha de fin no puede ser antes de la fecha de inicio'),
});

export default suspensionSchema;