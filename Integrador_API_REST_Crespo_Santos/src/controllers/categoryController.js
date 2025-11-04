// src/controllers/categoryController.js
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.create = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success:false, error:'name requerido' });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(409).json({ success:false, error:'Categoria ya existe' });

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const cats = await Category.find();
    res.json({ success: true, data: cats });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ success:false, error:'Categoria no encontrada' });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!cat) return res.status(404).json({ success:false, error:'Categoria no encontrada' });
    res.json({ success: true, data: cat });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    // opcional: controlar que no existan productos en la categoria antes de eliminar
    const products = await Product.findOne({ category: req.params.id });
    if (products) return res.status(400).json({ success:false, error:'La categoria tiene productos, no se puede eliminar' });

    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success:false, error:'Categoria no encontrada' });
    res.json({ success: true, data: 'Categoria eliminada' });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const stats = await Category.aggregate([
      { $lookup: { from: 'products', localField: '_id', foreignField: 'category', as: 'products' } },
      { $project: { name: 1, productsCount: { $size: '$products' } } },
      { $sort: { productsCount: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};
