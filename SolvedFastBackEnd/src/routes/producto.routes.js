import { Router } from "express";
import authenticateUser from "../middlewares/auth.middleware.js";

const router = Router();

import {
    createProducto,
    updateProducto,
    disableProducto,
    deleteProducto,
    getProducto,
    getAllProductos,
    getAllEnabledProductos,
    getAllProductosWOP,
} from "../controllers/producto.controller.js";

router.get("/productos", authenticateUser, getAllEnabledProductos);
router.get("/productos/all", authenticateUser, getAllProductos);
router.post("/producto", authenticateUser, createProducto);
router.put("/producto/:id", authenticateUser, updateProducto);
router.put("/producto/disable/:id", authenticateUser, disableProducto);
router.get("/producto/:id", authenticateUser, getProducto);
router.delete("/producto/:id_producto", authenticateUser, deleteProducto);
router.get("/productosWOP", authenticateUser, getAllProductosWOP);

export default router;

