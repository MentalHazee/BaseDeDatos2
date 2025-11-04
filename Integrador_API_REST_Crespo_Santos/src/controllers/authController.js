// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const signToken = (user) => {
  return jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, addresses } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error: 'email y password requeridos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success:false, error: 'Email ya registrado' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, addresses, role: 'user' });

    const token = signToken(user);
    res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email }, token } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error: 'email y password requeridos' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success:false, error: 'Credenciales inválidas' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success:false, error: 'Credenciales inválidas' });

    const token = signToken(user);
    res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (err) { next(err); }
};
