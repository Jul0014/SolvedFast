import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
  getHojaTrabajo,
  downloadExcel,
} from "../controllers/hoja_trabajo.controller.js";

router.get("/hoja_trabajo/:date", authenticateUser, getHojaTrabajo);

router.get("/hoja_trabajo/download/:date", authenticateUser, downloadExcel);

export default router;
