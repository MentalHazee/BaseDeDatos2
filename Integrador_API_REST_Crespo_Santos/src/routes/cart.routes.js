import { Router } from "express";
import {
  agregarAlCarrito,
  obtenerCarrito,
  eliminarDelCarrito,
  vaciarCarrito
} from "../controllers/cart.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas requieren login
router.post("/add", verificarToken, agregarAlCarrito);
router.get("/", verificarToken, obtenerCarrito);
router.delete("/remove/:productId", verificarToken, eliminarDelCarrito);
router.delete("/clear", verificarToken, vaciarCarrito);

export default router;
