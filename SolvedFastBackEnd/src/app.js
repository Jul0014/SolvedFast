import { fileURLToPath } from "url";
import path, { dirname } from "path";
import morgan from "morgan";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import tecnicoRoutes from "./routes/tecnico.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import servicioRoutes from "./routes/servicio.routes.js";
import programarRoutes from "./routes/programar.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import hoja_trabajoRoutes from "./routes/hoja_trabajo.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js"
import especialidadRoutes from "./routes/especialidad.routes.js"
import sendMessageRoutes from "./routes/send.routes.js"
import usuarioRoutes from "./routes/usuario.routes.js";
import { connectDB } from "./database.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(
  cors({
    origin: "http://localhost:" + (process.env.PORT || 5173),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api", tecnicoRoutes);
app.use("/api", clienteRoutes);
app.use("/api", servicioRoutes);
app.use("/api", programarRoutes);
app.use("/api", productoRoutes);
app.use("/api", hoja_trabajoRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", especialidadRoutes);
app.use("/api", sendMessageRoutes);
app.use("/api", usuarioRoutes);

const frontendBuildPath = path.join(__dirname, "public", "dist");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

await connectDB();

export default app;
