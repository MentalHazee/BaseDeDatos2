import { Router } from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  obtenerUsuarios,
  eliminarUsuario
} from "../controllers/user.controller.js";
import { verificarToken, esAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Registro y login
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

// Perfil propio (requiere login)
router.get("/perfil", verificarToken, obtenerPerfil);

// Solo admin puede ver y eliminar usuarios
router.get("/", verificarToken, esAdmin, obtenerUsuarios);
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);

export default router;
