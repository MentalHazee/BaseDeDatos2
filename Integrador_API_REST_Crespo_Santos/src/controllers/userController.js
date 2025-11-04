// src/controllers/userController.js
const User = require('../models/User');
const Cart = require('../models/Cart');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ success:false, error: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, phone, addresses, role } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error:'email y password requeridos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success:false, error:'Email ya existe' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, addresses, role: role || 'user' });

    // crear carrito vacío opcional
    await Cart.create({ user: user._id, items: [] });

    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success:false, error:'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    // eliminar carrito asociado
    await Cart.deleteOne({ user: id });
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success:false, error:'Usuario no encontrado' });
    res.json({ success: true, data: 'Usuario y carrito eliminados' });
  } catch (err) { next(err); }
};
