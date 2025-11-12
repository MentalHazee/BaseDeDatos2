import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// -----------------------------
// Registrar usuario
// -----------------------------
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password} = req.body;

    // Verificar si ya existe el usuario
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: "El email ya está registrado" });
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      email,
      password: password,
      rol: "cliente",
    });

    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al registrar usuario", error: error.message });
  }
};

// -----------------------------
// Login de usuario
// -----------------------------
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Comparar contraseñas
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "3h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al iniciar sesión", error: error.message });
  }
};

// -----------------------------
// Obtener perfil del usuario autenticado
// -----------------------------
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.user.id).select("-password");
    res.json({ success: true, usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener el perfil", error: error.message });
  }
};

// -----------------------------
// Obtener todos los usuarios (solo admin)
// -----------------------------
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password");
    res.json({ success: true, usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener usuarios", error: error.message });
  }
};

// -----------------------------
// Eliminar usuario (solo admin)
// -----------------------------
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioEliminado = await User.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar usuario", error: error.message });
  }
};
