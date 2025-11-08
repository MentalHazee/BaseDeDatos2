import Resena from "../models/review.model.js";
import Orden from "../models/order.model.js";

// Listar todas las reseñas con usuario y producto
export const getResenas = async (req, res, next) => {
  try {
    const resenas = await Resena.find()
      .populate("usuario", "nombre email")
      .populate("producto", "nombre precio");
    res.json({ success: true, data: resenas });
  } catch (err) { next(err); }
};

// Reseñas de un producto
export const getResenasPorProducto = async (req, res, next) => {
  try {
    const resenas = await Resena.find({ producto: req.params.productId }).populate("usuario", "nombre");
    res.json({ success: true, data: resenas });
  } catch (err) { next(err); }
};

// Promedio de calificaciones por producto
export const getTopResenas = async (req, res, next) => {
  try {
    const top = await Resena.aggregate([
      { $group: { _id: "$producto", promedio: { $avg: "$calificacion" }, cantidad: { $sum: 1 } } },
      { $sort: { promedio: -1 } },
      { $lookup: { from: "productos", localField: "_id", foreignField: "_id", as: "producto" } },
      { $unwind: "$producto" }
    ]);
    res.json({ success: true, data: top });
  } catch (err) { next(err); }
};

// Crear reseña solo si el usuario compró el producto
export const createResena = async (req, res, next) => {
  try {
    const { usuario, producto } = req.body;

    const comprada = await Orden.findOne({
      usuario,
      "items.producto": producto
    });

    if (!comprada)
      return res.status(403).json({ success: false, message: "No podés reseñar un producto que no compraste" });

    const nueva = await Resena.create(req.body);
    res.status(201).json({ success: true, data: nueva });
  } catch (err) { next(err); }
};
