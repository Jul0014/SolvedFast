import * as yup from "yup";
import dayjs from "dayjs";
import { parse, isDate, subDays } from 'date-fns';

const today = dayjs().startOf('day');

const servicioSchema = yup.object().shape({
    numero_llamada: yup
        .string()
        .matches(/^[1-9A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[1-9A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(15, "Número de llamada demasiado largo"),
    tienda: yup
        .string()
        .required("Tienda es requerida")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .max(20, "Nombre demasiado largos"),
    producto: yup
        .string()
        .required("Producto es requerido"),
    fecha_visita: yup
        .date()
        .transform((value, originalValue) => {
            if (isDate(value)) return value;
            const parsedDate = parse(originalValue, "yyyy-MM-dd", new Date());
            return parsedDate;
        })
        .typeError('Fecha de inicio es inválida')
        .required('Fecha de inicio es requerida')
        .min(subDays(new Date(), 1), 'Fecha de inicio no puede ser en el pasado'),
    tipo_servicio: yup
        .string()
        .required("Tipo de servicio es requerido")
        .matches(/^[áéíóúA-Za-z0-9\s]+$/, "Tipo de servicio no puede contener caracteres especiales")
        .max(15, "Nombres demasiado largos"),
    color: yup
        .string()
        .required("Color es requerido"),
    turno: yup
        .string()
        .required("Turno es requerido"),
    comentario: yup
        .string()
        .nullable(true)
        .max(120, "Comentario no puede tener más de 120 caracteres"),
    
});

export default servicioSchema;
