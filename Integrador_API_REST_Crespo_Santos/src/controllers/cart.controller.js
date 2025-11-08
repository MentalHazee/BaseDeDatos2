import Carrito from "../models/cart.model.js";
import Producto from "../models/product.model.js";

// Obtener carrito del usuario
export const obtenerCarrito = async (req, res, next) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.user.id }).populate("productos.producto");
    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado" });
    res.json({ success: true, data: carrito });
  } catch (err) {
    next(err);
  }
};

// Agregar producto al carrito
export const agregarAlCarrito = async (req, res, next) => {
  try {
    const { productoId, cantidad } = req.body;
    let carrito = await Carrito.findOne({ usuario: req.user.id });

    if (!carrito) {
      carrito = new Carrito({ usuario: req.user.id, productos: [] });
    }

    const productoExistente = carrito.productos.find(
      (p) => p.producto.toString() === productoId
    );

    if (productoExistente) {
      productoExistente.cantidad += cantidad;
    } else {
      carrito.productos.push({ producto: productoId, cantidad });
    }

    await carrito.save();
    res.json({ success: true, data: carrito });
  } catch (err) {
    next(err);
  }
};

// Eliminar producto del carrito
export const eliminarDelCarrito = async (req, res, next) => {
  try {
    const { productoId } = req.params;
    const carrito = await Carrito.findOneAndUpdate(
      { usuario: req.user.id },
      { $pull: { productos: { producto: productoId } } },
      { new: true }
    );
    res.json({ success: true, data: carrito });
  } catch (err) {
    next(err);
  }
};

// Vaciar carrito completo
export const vaciarCarrito = async (req, res, next) => {
  try {
    await Carrito.findOneAndUpdate(
      { usuario: req.user.id },
      { $set: { productos: [] } }
    );
    res.json({ success: true, message: "Carrito vaciado" });
  } catch (err) {
    next(err);
  }
};
