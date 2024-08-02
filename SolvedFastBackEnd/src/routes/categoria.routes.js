import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoria,
    getAllCategorias,
    disableCategoria,
    getAllEnabledCategorias,
} from "../controllers/categoria.controller.js";

router.get("/categorias", authenticateUser, getAllEnabledCategorias);
router.get("/categorias/all", authenticateUser, getAllCategorias);
router.post("/categoria", authenticateUser, createCategoria);
router.put("/categoria/:id", authenticateUser, updateCategoria);
router.put("/categoria/disable/:id", authenticateUser, disableCategoria);
router.delete("/categoria/:id", authenticateUser, deleteCategoria);

router.get("/categoria/:id", authenticateUser, getCategoria);

export default router;
