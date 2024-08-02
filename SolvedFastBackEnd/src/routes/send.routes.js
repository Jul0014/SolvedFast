import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
    sendFile,
} from "../controllers/sendmessaje.js";

router.post('/send-file', authenticateUser, sendFile);

export default router;
