import * as yup from "yup";

const productoSchema = yup.object().shape({
    nombre_producto: yup
        .string()
        .required("El nombre es requerido")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .transform(value => value.replace(/\s+/g, ' ').trim())
        .max(120, "Nombre demasiado largo"),
    marca: yup
        .string()
        .required("La marca es requerida")
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .transform(value => value.replace(/\s+/g, ' ').trim())
        .max(25, "Marca demasiado larga"),
});

export default productoSchema;
