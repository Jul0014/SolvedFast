import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
    createTecnico,
    deleteTecnico,
    updateTecnico,
    getAllTecnicos,
    getTecnico,
    findTecnico,
    suspenderTecnico,
    quitarSuspensionTecnico,
    searchSimilarTecnico,
    getAllAvailableTecnicos,
} from "../controllers/tecnico.controller.js";

router.get("/tecnicos", authenticateUser,  getAllTecnicos);
router.post("/tecnico", authenticateUser, createTecnico);
router.put("/tecnico/:id", authenticateUser, updateTecnico);
router.delete("/tecnico/:id", authenticateUser, deleteTecnico);
router.post("/tecnico/find", authenticateUser, findTecnico);
router.get("/tecnico/:id", authenticateUser, getTecnico);
router.post("/tecnico/similar", authenticateUser, searchSimilarTecnico);

router.put("/tecnico/suspender/:id", authenticateUser, suspenderTecnico);
router.put("/tecnico/quitarsus/:id", authenticateUser, quitarSuspensionTecnico)

router.get("/tecnicosAvailable", authenticateUser, getAllAvailableTecnicos);

export default router;