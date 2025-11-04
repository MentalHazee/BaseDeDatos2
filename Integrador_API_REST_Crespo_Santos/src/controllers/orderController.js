// src/controllers/orderController.js
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success:false, error:'Carrito vacío' });
    }

    // validar stock y preparar items
    const items = [];
    for (const it of cart.items) {
      if (it.product.stock < it.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ success:false, error:`Stock insuficiente para ${it.product.name}` });
      }
      items.push({
        product: it.product._id,
        quantity: it.quantity,
        price: it.priceAtAdd ?? it.product.price,
        subtotal: (it.priceAtAdd ?? it.product.price) * it.quantity
      });
      // decrementar stock
      await Product.findByIdAndUpdate(it.product._id, { $inc: { stock: -it.quantity } }, { session });
    }

    const total = items.reduce((acc, i) => acc + i.subtotal, 0);

    const order = await Order.create([{
      user: userId,
      items,
      total,
      status: 'pending',
      paymentMethod: req.body.paymentMethod || 'unknown',
      address: req.body.address || null
    }], { session });

    // vaciar carrito
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ success: true, data: order[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const ord = await Order.findById(req.params.id).populate('user', 'name email').populate('items.product', 'name price');
    if (!ord) return res.status(404).json({ success:false, error:'Orden no encontrada' });
    res.json({ success: true, data: ord });
  } catch (err) { next(err); }
};

exports.getByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId }).populate('items.product', 'name price').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ord = await Order.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
    if (!ord) return res.status(404).json({ success:false, error:'Orden no encontrada' });
    res.json({ success: true, data: ord });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};
