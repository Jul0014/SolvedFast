import mongoose from "mongoose";
const Schema = mongoose.Schema;

const trimSpaces = (v) => v.replace(/\s+/g, " ").trim().toUpperCase();

const personaSchema = new Schema(
  {
    tipo_documento: { type: Number, default: 0 },
    documento_identidad: {
      type: String,
      set: trimSpaces,
    },
    nombres: {
      type: String,
      required: [true, "Los nombres son requeridos"],
      maxlength: [25, "Los nombres no pueden tener más de 25 caracteres"],
      set: trimSpaces,
    },
    apellido_paterno: {
      type: String,
      required: [true, "Apellido paterno es requerido"],
      maxlength: [25, "Apellido paterno no puede tener más de 25 caracteres"],
      set: trimSpaces,
    },
    apellido_materno: {
      type: String,
      required: [true, "Apellido materno es requerido"],
      maxlength: [25, "Apellido materno no puede tener más de 25 caracteres"],
      set: trimSpaces,
    },
    num_telefono: {
      type: [{ type: String }],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Debe haber al menos un número de teléfono",
      },
      required: [true, "Los números de teléfono son requeridos"],
    },
    fecha_creacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    discriminatorKey: "tipoPersona",
    collection: "personas",
  }
);

export default mongoose.model("Persona", personaSchema);
