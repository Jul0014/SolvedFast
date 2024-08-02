import * as yup from "yup";

const genericSchema = yup.object().shape({
    nombre: yup
        .string()
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
        .transform(value => value.replace(/\s+/g, ' ').trim())
        .max(20, "Nombre demasiado largo"),
});

export default genericSchema;
