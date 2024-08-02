import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
  createCliente,
  deleteCliente,
  updateCliente,
  getAllClientes,
  getCliente,
  findCliente,
  searchSimilarCliente,
} from "../controllers/cliente.controller.js";

// Protect all the routes with authenticateUser middleware
router.get("/clientes", getAllClientes);
router.post("/cliente", authenticateUser, createCliente);
router.post("/cliente/find", authenticateUser, findCliente);
router.put("/cliente/:id", authenticateUser, updateCliente);
router.delete("/cliente/:id", authenticateUser, deleteCliente);
router.post("/cliente/similar", authenticateUser, searchSimilarCliente);
router.get("/cliente/:id", authenticateUser, getCliente);

export default router;