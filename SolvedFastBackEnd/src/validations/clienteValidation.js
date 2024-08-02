import { validateTipoDocumento, validateNames, validateNumTelefono, validateComentario } from "./personaFunctionsValidations.js";
// Function to validate distrito
const validateDistrito = (distrito) => {
    const errors = [];

    if (!distrito) {
        errors.push("Distrito es requerido");
    } else {
        const trimmedDistrito = distrito.trim();
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(trimmedDistrito)) {
            errors.push("Solo se permiten letras y espacios en el distrito");
        }
        if (trimmedDistrito.length > 25) {
            errors.push("El distrito es demasiado largo");
        }
    }

    return errors;
};

// Function to validate provincia
const validateProvincia = (provincia) => {
    const errors = [];

    if (!provincia) {
        errors.push("Provincia es requerida");
    } else {
        const trimmedProvincia = provincia.trim();
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(trimmedProvincia)) {
            errors.push("Solo se permiten letras y espacios en la provincia");
        }
        if (trimmedProvincia.length > 25) {
            errors.push("La provincia es demasiado larga");
        }
    }

    return errors;
};

// Function to validate direccion
const validateDireccion = (direccion) => {
    const errors = [];

    if (!direccion) {
        errors.push("Dirección es requerida");
    } else {
        const trimmedDireccion = direccion.trim();
        if (trimmedDireccion.length > 100) {
            errors.push("Dirección demasiada larga");
        }
    }

    return errors;
};

// Main validation function
const validationCliente = async (data) => {
    const {
        documento_identidad,
        tipo_documento,
        nombres,
        apellido_paterno,
        apellido_materno,
        num_telefono,
        distrito,
        provincia,
        direccion,
        comentario,
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

    // Validate num_telefono
    errors.push(...validateNumTelefono(num_telefono));

    errors.push(...validateDistrito(distrito));

    errors.push(...validateProvincia(provincia));
    
    errors.push(...validateDireccion(direccion));

    errors.push(...validateComentario(comentario));
  
    return errors.flat();
};

export default validationCliente;
