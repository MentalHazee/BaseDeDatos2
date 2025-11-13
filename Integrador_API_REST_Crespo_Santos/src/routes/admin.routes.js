import { Router } from "express";
import {
  registrarUsuario,
  obtenerPerfil,
  obtenerUsuarios,
  eliminarUsuario
} from "../controllers/admin.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Registro y login
router.post("/register", registrarUsuario);

// Perfil propio (requiere login)
router.get("/perfil", verificarToken, obtenerPerfil);

// Solo admin puede ver y eliminar usuarios
router.get("/", verificarToken, esAdmin, obtenerUsuarios);
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);

export default router;