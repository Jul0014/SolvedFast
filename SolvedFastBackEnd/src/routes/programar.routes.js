import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import { programar } from "../controllers/programar.controller.js";

router.post("/programar", authenticateUser, programar);

export default router;
