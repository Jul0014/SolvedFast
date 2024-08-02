import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
    createEspecialidad,
    getAllEspecialidades,
    updateEspecialidad,
    deleteEspecialidad,
    disableEspecialidad,
    getEspecialidad,
    getAllEnabledEspecialidades,
} from "../controllers/especialidad.controller.js";

router.get("/especialidades", authenticateUser, getAllEnabledEspecialidades);
router.get("/especialidades/all", authenticateUser, getAllEspecialidades);
router.post("/especialidad", authenticateUser, createEspecialidad);
router.put("/especialidad/:id", authenticateUser, updateEspecialidad);
router.put("/especialidad/disable/:id", authenticateUser, disableEspecialidad);
router.delete("/especialidad/:id", authenticateUser, deleteEspecialidad);

export default router;


