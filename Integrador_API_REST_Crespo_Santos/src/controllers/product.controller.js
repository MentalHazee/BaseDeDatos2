import Producto from "../models/product.model.js";
import Resena from "../models/review.model.js";

// Listar productos con su categoría
export const obtenerProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find();
    await Producto.populate(productos, { path: "categoria"});
    res.json({ success: true, data: productos });
  } catch (err) { next(err); }
};

// Filtrar por rango de precio y marca
export const filtrarProductos = async (req, res, next) => {
  try {
    const { min, max, marca } = req.query;

    const filtro = {
      $and: [
        { precio: { $gte: Number(min) || 0 } },
        { precio: { $lte: Number(max) || 999999 } }
      ]
    };
    if (marca) filtro.$and.push({ marca: { $eq: marca } });

    const productos = await Producto.find(filtro);
    res.json({ success: true, data: productos });
  } catch (err) { next(err); }
};

// Productos más reseñados
export const productosTop = async (req, res, next) => {
  try {
    const top = await Resena.aggregate([
      { $group: { _id: "$producto", totalResenas: { $sum: 1 } } },
      { $sort: { totalResenas: -1 } },
      { $limit: 5 },
      { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
      { $unwind: "$producto" }
    ]);
    res.json({ success: true, data: top });
  } catch (err) { next(err); }
};

// Actualizar stock
export const actualizarStock = async (req, res, next) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { $set: { stock: req.body.stock } },
      { new: true }
    );
    res.json({ success: true, data: producto });
  } catch (err) { next(err); }
};

// CRUD base
export const crearProducto = async (req, res, next) => {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json({ success: true, data: nuevo });
  } catch (err) { next(err); }
};

export const actualizarProducto = async (req, res, next) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: actualizado });
  } catch (err) { next(err); }
};

export const eliminarProducto = async (req, res, next) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Producto eliminado" });
  } catch (err) { next(err); }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res, next) => {
  try {
    const producto = await Producto.findById(req.params.id).populate("categoria");
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.json({ success: true, data: producto });
  } catch (err) {
    next(err);
  }
};
