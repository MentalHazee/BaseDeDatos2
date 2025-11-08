import Orden from "../models/order.model.js";
import Carrito from "../models/cart.model.js";

// Crear una orden
export const crearOrden = async (req, res, next) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.user.id }).populate("productos.producto");
    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ success: false, message: "El carrito está vacío" });
    }

    const total = carrito.productos.reduce(
      (acc, p) => acc + p.producto.precio * p.cantidad,
      0
    );

    const nuevaOrden = await Orden.create({
      usuario: req.user.id,
      productos: carrito.productos,
      total,
      estado: "pendiente"
    });

    // vaciar carrito después de crear la orden
    carrito.productos = [];
    await carrito.save();

    res.status(201).json({ success: true, data: nuevaOrden });
  } catch (err) {
    next(err);
  }
};

// Obtener todas las órdenes
export const obtenerTodasLasOrdenes = async (req, res, next) => {
  try {
    const ordenes = await Orden.find().populate("usuario productos.producto");
    res.json({ success: true, data: ordenes });
  } catch (err) {
    next(err);
  }
};

// Obtener una orden por ID
export const obtenerOrdenPorId = async (req, res, next) => {
  try {
    const orden = await Orden.findById(req.params.id).populate("usuario productos.producto");
    if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });
    res.json({ success: true, data: orden });
  } catch (err) {
    next(err);
  }
};

// Actualizar estado de una orden (la función que faltaba)
export const actualizarEstadoOrden = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!orden) return res.status(404).json({ success: false, message: "Orden no encontrada" });
    res.json({ success: true, data: orden });
  } catch (err) {
    next(err);
  }
};

// Obtener las órdenes del usuario logueado
export const obtenerOrdenesUsuario = async (req, res, next) => {
  try {
    const ordenes = await Orden.find({ usuario: req.user.id }).populate("productos.producto");
    res.json({ success: true, data: ordenes });
  } catch (err) {
    next(err);
  }
};

