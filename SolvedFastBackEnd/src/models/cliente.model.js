import mongoose from "mongoose";
import Persona from "./persona.model.js";

const clienteSchema = new mongoose.Schema({
	distrito: String,
	provincia: String,
	direccion: String,
	referencia: String,
	historial_servicios: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Servicio",
		},
	],
	comentario: String,
});

const Cliente = Persona.discriminator('Cliente', clienteSchema);

export default Cliente;