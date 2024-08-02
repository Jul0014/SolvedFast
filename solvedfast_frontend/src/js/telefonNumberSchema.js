import * as yup from "yup";

const telephonNumberSchema = yup.object().shape({
  num_telefono: yup
    .string()
    .nullable(true) // Allows the value to be null
    .notRequired() // Field is not required
    .matches(/^[1-9]\d*$/, "Solo puede contener números y no puede empezar con 0") // Adjusted to disallow starting with 0
    .test(
      "len",
      "Debe tener 6 o 9 dígitos",
      (val) => !val || val.length === 6 || val.length === 9
    ),
});

export default telephonNumberSchema;
