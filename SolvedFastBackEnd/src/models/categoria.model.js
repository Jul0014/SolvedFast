import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    nombre_categoria: { type: String, required: true },
    estado: {type: Boolean, default: true},
});

export default mongoose.model("Categoria", categoriaSchema);