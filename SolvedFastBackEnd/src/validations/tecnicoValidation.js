import { validateTipoDocumento, validateNames, validateEspecialidad, validateNumTelefono } from "./personaFunctionsValidations.js";
// Main validation function
const validationTecnico = async (data) => {
    const {
      documento_identidad,
      tipo_documento,
      nombres,
      apellido_paterno,
      apellido_materno,
      num_telefono,
      especialidad,
    } = data;
  
    const errors = [];

    // Validate tipo_documento
    errors.push(...validateTipoDocumento(tipo_documento, documento_identidad));
  
    // Validate nombres
    errors.push(...validateNames(nombres, 'Nombres'));

    // Validate apellido_paterno
    errors.push(...validateNames(apellido_paterno, 'Apellido paterno'));

    // Validate apellido_materno
    errors.push(...validateNames(apellido_materno, 'Apellido materno'));

    // Validate especialidad
    errors.push(...await validateEspecialidad(especialidad));

    // Validate num_telefono
    errors.push(...validateNumTelefono(num_telefono));
  
    return errors.flat();
};

export default validationTecnico;
