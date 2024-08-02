import Cliente from "./cliente.model.js";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const servicioSchema = new Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  historial_reprogramaciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reprogramacion",
    required: false,
  }],
  numero_llamada: { type: String, default: "Particular" },
  tienda: String,
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
  },
  serie: {
    type: String,
    default: "Sin serie",
  },
  fecha_visita: {
    type: Date,
    required: true,
  },
  tipo_servicio: String,
  estado_realizado: { type: Boolean, default: true },
  turno: String,
  color: String,
  comentario: {
    type: String,
    default: "",
  },
  tecnico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tecnico"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the virtual property 'veces_reprogramado'
servicioSchema.virtual('veces_reprogramado').get(function() {
  return this.historial_reprogramaciones.length;
});

/*
servicioSchema.pre("save", function (next) {
  if (this.tienda) {
    this.tienda = this.tienda.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.marca) {
    this.marca = this.marca.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.producto) {
    this.producto = this.producto.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.serie) {
    this.serie = this.serie.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.tipo_servicio) {
    this.tipo_servicio = this.tipo_servicio
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }
  if (this.turno) {
    this.turno = this.turno.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.color) {
    this.color = this.color.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.comentario) {
    this.comentario = this.comentario.replace(/\s+/g, " ").trim().toUpperCase();
  }
  if (this.encargado) {
    this.encargado = this.encargado.replace(/\s+/g, " ").trim().toUpperCase();
  }

  next();
});

servicioSchema.post("findOneAndDelete", async function (doc) {
  try {
    const cliente = await Cliente.findById(doc.cliente);

    if (cliente) {
      cliente.hist_servicios.pull(doc._id);
      await cliente.save();
    }
  } catch (error) {
    console.error(
      "Error al eliminar el servicio del historial del cliente:",
      error
    );
    throw error;
  }
});
*/

servicioSchema.post("save", async function (doc) {
  try {
    const cliente = await Cliente.findById(doc.cliente);

    if (cliente) {
      cliente.historial_servicios.push(doc._id);
      await cliente.save();
    }
  } catch (error) {
    console.error(
      "Error al actualizar el historial de servicios del cliente:",
      error
    );
    throw error;
  }
});

servicioSchema.set('toJSON', { virtuals: true });
servicioSchema.set('toObject', { virtuals: true });

export default mongoose.model("Servicio", servicioSchema);
