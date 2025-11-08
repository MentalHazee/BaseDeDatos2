import Categoria from "../models/category.model.js";
import Producto from "../models/product.model.js";

// CRUD básico
export const getCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.find();
    res.json({ success: true, data: categorias });
  } catch (err) { next(err); }
};

export const createCategoria = async (req, res, next) => {
  try {
    const nueva = await Categoria.create(req.body);
    res.status(201).json({ success: true, data: nueva });
  } catch (err) { next(err); }
};

export const updateCategoria = async (req, res, next) => {
  try {
    const actualizada = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: actualizada });
  } catch (err) { next(err); }
};

export const deleteCategoria = async (req, res, next) => {
  try {
    await Categoria.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Categoría eliminada" });
  } catch (err) { next(err); }
};

// cantidad de productos por categoría
export const getCategoriaStats = async (req, res, next) => {
  try {
    const stats = await Producto.aggregate([
      { $group: { _id: "$categoria", cantidad: { $sum: 1 } } },
      { $lookup: { from: "categorias", localField: "_id", foreignField: "_id", as: "categoria" } },
      { $unwind: "$categoria" },
      { $project: { _id: 0, categoria: "$categoria.nombre", cantidad: 1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};
