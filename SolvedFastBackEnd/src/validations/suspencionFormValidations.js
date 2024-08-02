import { isDate, parse, isValid, parseISO} from 'date-fns';
import { validateComentario } from './personaFunctionsValidations.js';

// Function to validate if suceso is provided
const validateSuceso = (suceso) => {
    const errors = [];
    if (!suceso) {
        errors.push("Suceso es requerido");
    }
    return errors;
};


// Function to validate fecha_inicio
const validateFechaInicio = (fecha_inicio) => {
    const errors = [];
    if (!fecha_inicio) {
        errors.push("Fecha de inicio es requerida");
    } else {
        const parsedFechaInicio = parse(fecha_inicio, "yyyy-MM-dd", new Date());
        if (!isDate(parsedFechaInicio) || !isValid(parseISO(fecha_inicio))) {
            errors.push("Fecha de inicio es inválida");
        }
    }
    return errors;
};

// Function to validate fecha_fin
const validateFechaFin = (fecha_fin, parsedFechaInicio) => {
    const errors = [];
    if (fecha_fin) {
        const parsedFechaFin = parse(fecha_fin, "yyyy-MM-dd", new Date());
        if (!isDate(parsedFechaFin) || !isValid(parseISO(fecha_fin))) {
            errors.push("Fecha de fin es inválida");
        } else if (parsedFechaFin < parsedFechaInicio) {
            errors.push("Fecha de fin no puede ser antes de la fecha de inicio");
        }
    }
    return errors;
};

// Function to validate removing suspension
export const validateQuitarSuspension = (data) => {
    const { suceso, comentario } = data;
    const errors = [];

    errors.push(...validateSuceso(suceso));
    errors.push(...validateComentario(comentario));

    return errors;
};

// Function to validate suspension
export const validateSuspension = (data) => {
    const { suceso, comentario, fecha_inicio, fecha_fin } = data;
    const errors = [];

    errors.push(...validateSuceso(suceso));
    errors.push(...validateComentario(comentario));
    errors.push(...validateFechaInicio(fecha_inicio));
    errors.push(...validateFechaFin(fecha_fin, parse(fecha_inicio, "yyyy-MM-dd", new Date())));

    return errors;
};