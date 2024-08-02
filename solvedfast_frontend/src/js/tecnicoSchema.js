import * as yup from "yup";

const personSchema = yup.object().shape({
  tipo_documento: yup.string().required("Tipo de documento es requerido"),
  documento_identidad: yup
    .string()
    .when("tipo_documento", (tipo_documento, schema) => {
      return tipo_documento == "0"
        ? schema.nullable(true).notRequired().length(0, "Debe estar vacío")
        : tipo_documento == "1"
        ? schema
            .length(8, "Debe tener 8 dígitos")
            .matches(/^\d*$/, "Solo puede contener números")
        : schema.length(12, "Debe tener 12 dígitos");
    }),
    nombres: yup
    .string()
    .required("Los nombres son requeridos")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .max(25, "Nombres demasiado largos"),
    apellido_paterno: yup
    .string()
    .required("Apellido paterno es requerido")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .max(25, "Apellido paterno demasiado largo"),
  apellido_materno: yup
    .string()
    .required("Apellido materno es requerido")
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/, "Solo se permiten letras y espacios")
    .transform(value => value.replace(/\s+/g, ' ').trim())
    .max(25, "Apellido materno demasiado largo"),
  especialidad: yup
    .array()
    .of(yup.string())
    .nullable(true)
    .min(1, "Se debe de tener al menos una especialidad"),
  num_telefono: yup
    .array()
    .of(yup.string())
    .nullable(true)
    .min(1, "Se debe de tener al menos un número de teléfono"),
    correo: yup.string().email("Debe ser un correo electrónico válido").required("El correo es requerido"),
});

export default personSchema;
