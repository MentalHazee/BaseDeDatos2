import { Router } from "express";
import {
    getCategorias,
    createCategoria,
    updateCategoria,
} from "../controllers/category.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Crea categoría
router.post("/", verificarToken, esAdmin, createCategoria);

// Admin ve y actualiza todas
router.get("/", verificarToken, getCategorias);
router.put("/:id", verificarToken, esAdmin, updateCategoria);

export default router;
