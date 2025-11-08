import { Router } from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto
} from "../controllers/product.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

// Rutas de administrador
router.post("/", verificarToken, esAdmin, crearProducto);
router.put("/:id", verificarToken, esAdmin, actualizarProducto);
router.delete("/:id", verificarToken, esAdmin, eliminarProducto);

export default router;
