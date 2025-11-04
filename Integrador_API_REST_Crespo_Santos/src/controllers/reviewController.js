// src/controllers/reviewController.js
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.list = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('user', 'name').populate('product', 'name');
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

exports.listByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    res.json({ success: true, data: reviews });
  } catch (err) { next(err); }
};

// promedio de calificaciones por producto
exports.topAvg = async (req, res, next) => {
  try {
    const agg = await Review.aggregate([
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1, count: -1 } },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { productName: '$product.name', avgRating: 1, count: 1 } },
      { $limit: 20 }
    ]);
    res.json({ success: true, data: agg });
  } catch (err) { next(err); }
};

// POST: sólo si el usuario compró el producto
exports.create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product, rating, comment } = req.body;
    if (!product || !rating) return res.status(400).json({ success:false, error:'product y rating requeridos' });

    // verificar que exista una orden del usuario con ese producto
    const bought = await Order.findOne({ user: userId, 'items.product': mongoose.Types.ObjectId(product) });
    if (!bought) return res.status(403).json({ success:false, error:'Solo los usuarios que compraron el producto pueden reseñarlo' });

    // crear reseña
    const review = await Review.create({ user: userId, product, rating: Number(rating), comment });

    // Actualizar datos cache en Product (ratingsAvg, reviewsCount) - atomico
    const stats = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(product) } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats.length) {
      await Product.findByIdAndUpdate(product, { $set: { ratingsAvg: stats[0].avg, reviewsCount: stats[0].count } });
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const rev = await Review.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!rev) return res.status(404).json({ success:false, error:'Reseña no encontrada' });
    res.json({ success: true, data: rev });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const rev = await Review.findByIdAndDelete(req.params.id);
    if (!rev) return res.status(404).json({ success:false, error:'Reseña no encontrada' });
    // actualizar cache product
    const stats = await Review.aggregate([
      { $match: { product: rev.product } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats.length) {
      await Product.findByIdAndUpdate(rev.product, { $set: { ratingsAvg: stats[0].avg, reviewsCount: stats[0].count } });
    } else {
      await Product.findByIdAndUpdate(rev.product, { $set: { ratingsAvg: null, reviewsCount: 0 } });
    }
    res.json({ success: true, data: 'Reseña eliminada' });
  } catch (err) { next(err); }
};
