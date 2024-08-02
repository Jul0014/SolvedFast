// updateTecnicoEstado.js
import mongoose from "mongoose";
import Tecnico from "./models/tecnico.model.js";

// MongoDB connection URI
const mongoURI = "mongodb://localhost:27017/your_database_name"; // Update with your actual MongoDB URI

// Connect to the MongoDB database
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Function to update the estado of Tecnicos with expired fecha_fin
const updateExpiredTecnicos = async () => {
    const now = new Date();

    try {
        const updated = await Tecnico.updateMany(
            { "historial_tecnico.fecha_fin": { $lte: now }, estado: false },
            { $set: { estado: true } }
        );

        console.log(`Updated ${updated.nModified} tecnicos.`);
    } catch (err) {
        console.error("Error updating tecnicos:", err);
    } finally {
        mongoose.connection.close();
    }
};

// Run the update function
updateExpiredTecnicos();