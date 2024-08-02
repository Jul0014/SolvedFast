import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
  register,
  login,
  verifyTokenUser,
  logout, // Import the logout function
} from "../controllers/usuario.controller.js";

router.post("/user/register", authenticateUser, register);
router.post("/user/login", login);
router.get("/user/verify", verifyTokenUser);
router.post("/user/logout", authenticateUser, logout); // Add the logout route

export default router;