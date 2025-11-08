import { Router } from "express";
import {
  crearOrden,
  obtenerOrdenesUsuario,
  obtenerTodasLasOrdenes,
  actualizarEstadoOrden
} from "../controllers/order.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Usuario crea y ve sus órdenes
router.post("/", verificarToken, crearOrden);
router.get("/mias", verificarToken, obtenerOrdenesUsuario);

// Admin ve y actualiza todas
router.get("/", verificarToken, esAdmin, obtenerTodasLasOrdenes);
router.put("/:id", verificarToken, esAdmin, actualizarEstadoOrden);

export default router;
