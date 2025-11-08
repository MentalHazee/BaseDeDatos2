import jwt from "jsonwebtoken";
import Usuario from "../models/user.model.js";

export const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token no proporcionado o inválido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    req.user = usuario; // guardamos el usuario en la request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expirado" });
    }
    return res.status(401).json({ success: false, message: "Token inválido" });
  }
};

// Verifica si el usuario tiene rol admin
export const esAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ success: false, message: "Acceso denegado: se requiere rol admin" });
  }
  next();
};

// Permite acceso solo al dueño o admin
export const esPropietarioOAdmin = (req, res, next) => {
  if (req.user.rol === "admin" || req.user._id.toString() === req.params.userId) {
    return next();
  }
  return res.status(403).json({ success: false, message: "No tenés permiso para acceder a estos datos" });
};
