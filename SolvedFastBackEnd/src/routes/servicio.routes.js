import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
  createServicio,
  deleteServicio,
  updateServicio,
  checkServicio,
  getAllServicios,
  findServicio,
  reprogramarServicio,
  countServiciosByDate,
  asignarServicio,
  getServiciosByDate,
  countServiciosByClienteAndDate,
  deleteServiciosWithoutCliente,
} from "../controllers/servicio.controller.js";

router.get("/servicios", authenticateUser, getAllServicios);
router.post("/servicio", authenticateUser, createServicio);
router.put("/servicio", authenticateUser, updateServicio);
router.patch("/servicio/asignar", authenticateUser, asignarServicio);
router.delete("/servicio/:id_servicio", authenticateUser, deleteServicio);
router.get('/servicios/count/:fecha1', authenticateUser, countServiciosByDate);
router.get('/servicios/getByDate/:fecha2', authenticateUser, getServiciosByDate);

//router.delete("/servicios/sin-client", deleteServiciosWithoutCliente);

router.get("/servicios/:id/:date", authenticateUser, countServiciosByClienteAndDate);

router.patch("/servicio/check/:id", authenticateUser, checkServicio);

router.post("/servicio/find", authenticateUser, findServicio);
router.patch("/servicio/reprogramar", authenticateUser, reprogramarServicio);

export default router;
