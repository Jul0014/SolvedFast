import mongoose from 'mongoose';
import Especialidad from "../models/especialidad.model.js";

// Function to validate tipo_documento
export const validateTipoDocumento = (tipo_documento, documento_identidad) => {
    const errors = [];
    if (tipo_documento === null || tipo_documento === undefined) {
        errors.push("Tipo de documento es requerido");
    } else {
        if (tipo_documento === "0") {
            if (documento_identidad.length !== 0) {
                errors.push("Debe estar vacío");
            }
        } else if (tipo_documento === "1") {
            if (documento_identidad.length !== 8) {
                errors.push("Debe tener 8 dígitos");
            }
            if (!/^\d*$/.test(documento_identidad)) {
                errors.push("Solo puede contener números");
            }
        } else if (tipo_documento === "2") {
            if (documento_identidad.length !== 12) {
                errors.push("Debe tener 12 dígitos");
            }
        } else if (tipo_documento != 0 && tipo_documento != 1 && tipo_documento != 2){
            errors.push("El tipo de documento es erróneo");
        }
    }
    return errors;
};

// Function to validate nombres, apellido_paterno, and apellido_materno
export const validateNames = (field, fieldName) => {
    const errors = [];
    if (!field) {
        errors.push(`${fieldName} es requerido`);
    } else {
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(field)) {
            errors.push(`Solo se permiten letras y espacios en ${fieldName}`);
        } else if (field.replace(/\s+/g, ' ').trim().length > 25) {
            errors.push(`${fieldName} demasiado largo`);
        }
    }
    return errors;
};

// Function to validate especialidad
export const validateEspecialidad = async (especialidad) => {
    const errors = [];
    if (!especialidad || !Array.isArray(especialidad) || especialidad.length < 1) {
        errors.push("Se debe de tener al menos una especialidad");
    } else {
        const specialtiesExist = await Promise.all(
            especialidad.map(async (id) => {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return `Especialidad con id ${id} no es un ObjectId válido`;
                }
                const exists = await Especialidad.findById(id);
                return exists ? null : `Especialidad con id ${id} no existe`;
            })
        );
        const specialtyErrors = specialtiesExist.filter(error => error !== null);
        if (specialtyErrors.length > 0) {
            errors.push(...specialtyErrors);
        }
    }
    return errors;
};

// Function to validate num_telefono
export const validateNumTelefono = (num_telefono) => {
    const errors = [];
    if (!num_telefono || !Array.isArray(num_telefono) || num_telefono.length < 1) {
        errors.push("Se debe de tener al menos un número de teléfono");
    } else {
        num_telefono.forEach((telefono) => {
            if (!/^[1-9]\d*$/.test(telefono)) {
                errors.push("Los números de teléfono solo pueden contener números y no pueden empezar con 0");
            }
            if (telefono.length !== 6 && telefono.length !== 9) {
                errors.push("Los números de teléfono deben tener 6 o 9 dígitos");
            }
        });
    }
    return errors;
};

export const validateComentario = (comentario) => {
    const errors = [];

    // Check if comentario exists and is a string
    if (comentario && typeof comentario !== "string") {
        errors.push("Comentario debe ser una cadena de caracteres");
    } 

    // Check the length of comentario
    if (comentario && comentario.length > 120) {
        errors.push("Comentario debe tener 120 caracteres o menos");
    }

    return errors;
};