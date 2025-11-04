// src/controllers/productController.js
const Product = require('../models/Product');
const Review = require('../models/Review');

exports.create = async (req, res, next) => {
  try {
    const prod = await Product.create(req.body);
    res.status(201).json({ success: true, data: prod });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category', 'name description');
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const prod = await Product.findById(req.params.id).populate('category', 'name');
    if (!prod) return res.status(404).json({ success:false, error:'Producto no encontrado' });
    res.json({ success: true, data: prod });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!prod) return res.status(404).json({ success:false, error:'Producto no encontrado' });
    res.json({ success: true, data: prod });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ success:false, error:'Producto no encontrado' });
    // opcional: eliminar reviews relacionadas
    await Review.deleteMany({ product: req.params.id });
    res.json({ success: true, data: 'Producto eliminado' });
  } catch (err) { next(err); }
};

// filtro por rango de precio y marca
exports.filter = async (req, res, next) => {
  try {
    const { minPrice, maxPrice, brand, category } = req.query;
    const cond = [];
    if (minPrice || maxPrice) {
      const priceCond = {};
      if (minPrice) priceCond.$gte = Number(minPrice);
      if (maxPrice) priceCond.$lte = Number(maxPrice);
      cond.push({ price: priceCond });
    }
    if (brand) cond.push({ brand });
    if (category) cond.push({ category });

    const query = cond.length ? { $and: cond } : {};
    const prods = await Product.find(query).populate('category', 'name');
    res.json({ success: true, data: prods });
  } catch (err) { next(err); }
};

// top — productos más reseñados (cantidad)
exports.topReviewed = async (req, res, next) => {
  try {
    const top = await Product.aggregate([
      { $lookup: { from: 'reviews', localField: '_id', foreignField: 'product', as: 'reviews' } },
      { $project: { name: 1, brand: 1, price: 1, reviewsCount: { $size: '$reviews' } } },
      { $sort: { reviewsCount: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, data: top });
  } catch (err) { next(err); }
};

// actualizar stock (patch)
exports.updateStock = async (req, res, next) => {
  try {
    const { amount, operator } = req.body; // operator: 'inc' or 'set'
    if (operator === 'inc') {
      const prod = await Product.findByIdAndUpdate(req.params.id, { $inc: { stock: Number(amount) } }, { new: true });
      if (!prod) return res.status(404).json({ success:false, error:'Producto no encontrado' });
      return res.json({ success: true, data: prod });
    } else {
      const prod = await Product.findByIdAndUpdate(req.params.id, { $set: { stock: Number(amount) } }, { new: true });
      if (!prod) return res.status(404).json({ success:false, error:'Producto no encontrado' });
      return res.json({ success: true, data: prod });
    }
  } catch (err) { next(err); }
};
