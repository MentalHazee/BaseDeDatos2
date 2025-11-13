import { Router } from "express";
import {
  getResenas,
  createResena,
  getTopResenas
} from "../controllers/review.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas requieren login
router.post("/add", verificarToken, createResena);
router.get("/", verificarToken, getResenas);
router.get("/top", verificarToken, getTopResenas);

export default router;