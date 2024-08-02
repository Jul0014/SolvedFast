import mongoose from "mongoose";
import Persona from "./persona.model.js";

const Schema = mongoose.Schema;

const tecnicoSchema = new Schema({
  especialidad: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Especialidad",
    },
  ],
  correo: {type: String, required: true},
  estado: { type: Boolean, required: true, default: true },
  historial_tecnico: [
    {
      suceso: { type: String, required: true },
      comentario: { type: String },
      fecha_inicio: { type: Date },
      fecha_fin: { type: Date },
    },
  ],
  fecha_fin: { type: Date, index: { expireAfterSeconds: 0 } },
});

const Tecnico = Persona.discriminator("Tecnico", tecnicoSchema);

export default Tecnico;
