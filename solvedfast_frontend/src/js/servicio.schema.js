import * as yup from 'yup';
import dayjs from "dayjs";

const productoSchema = yup.object().shape({
    _id: yup.string().min(2, "El producto es requerido"),
});
const servicioSchema = yup.object().shape({
    numero_llamada: yup
        .string()
        .required("Número de llamada es requerido")
        .matches(/^[áéíóúA-Za-z0-9\s]+$/, "Tienda no puede contener caracteres especiales"),
    tienda: yup
        .string()
        .required("Tienda es requerida")
        .matches(/^[áéíóúA-Za-z0-9\s]+$/, "Tienda no puede contener caracteres especiales"),
    producto: yup
        .string()
        .required("Producto es requerido"),
    fecha_visita: yup
        .date()
        .required("Fecha de visita es requerida"),
    tipo_servicio: yup
        .string()
        .required("Tipo de servicio es requerido")
        .matches(/^[áéíóúA-Za-z0-9\s]+$/, "Tipo de servicio no puede contener caracteres especiales"),
    color: yup
        .string()
        .required("Color es requerido"),
    turno: yup
        .string()
        .required("Turno es requerido"),
    comentario:   yup.string()
    .nullable(true)
    .notRequired()
    .max(120, "Comentario no puede tener más de 120 caracteres"),
    serie: yup
        .string()
        .nullable(true)
        .notRequired()
        .matches(/^[A-Za-z0-9\s]+$/, "Tienda no puede contener caracteres especiales"),
});

export default servicioSchema;