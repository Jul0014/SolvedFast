import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre_producto: { type: String, required: true },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
    /*categoria: { type: String, required: true },*/ 
    marca: { type: String, required: true },
    estado: { type: Boolean, default: true }, 
});

export default mongoose.model("Producto", productoSchema);
