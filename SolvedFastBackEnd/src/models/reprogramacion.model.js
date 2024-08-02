import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reprogramacionSchema = new Schema({
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
    },
    fecha_inicial_servicio: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("Reprogramacion", reprogramacionSchema);