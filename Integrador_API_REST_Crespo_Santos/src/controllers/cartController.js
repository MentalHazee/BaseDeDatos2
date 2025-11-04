// src/controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const cart = await Cart.findOne({ user: usuarioId }).populate('items.product');
    if (!cart) return res.status(404).json({ success:false, error:'Carrito no encontrado' });
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
};

exports.addItem = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) return res.status(400).json({ success:false, error:'productId y quantity requeridos' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success:false, error:'Producto no encontrado' });
    if (product.stock < quantity) return res.status(400).json({ success:false, error:'Stock insuficiente' });

    const cart = await Cart.findOneAndUpdate(
      { user: usuarioId },
      {
        $setOnInsert: { user: usuarioId },
        $pull: { items: { product: productId } } // quitar si existe (reemplazamos)
      },
      { new: true, upsert: true }
    );

    // luego pusheamos el nuevo item con precio al momento
    cart.items.push({ product: productId, quantity: Number(quantity), priceAtAdd: product.price });
    await cart.save();

    const populated = await cart.populate('items.product');
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: usuarioId });
    if (!cart) return res.status(404).json({ success:false, error:'Carrito no encontrado' });

    // actualizar cantidad con $set en el subdocumento
    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ success:false, error:'Item no encontrado en el carrito' });

    item.quantity = Number(quantity);
    await cart.save();
    const populated = await cart.populate('items.product');
    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const { productId } = req.body;
    const cart = await Cart.findOneAndUpdate({ user: usuarioId }, { $pull: { items: { product: productId } } }, { new: true });
    if (!cart) return res.status(404).json({ success:false, error:'Carrito no encontrado' });
    const populated = await cart.populate('items.product');
    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};

exports.getTotal = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const cart = await Cart.findOne({ user: usuarioId }).populate('items.product');
    if (!cart) return res.status(404).json({ success:false, error:'Carrito no encontrado' });

    const items = cart.items.map(it => ({
      product: it.product._id,
      quantity: it.quantity,
      priceAtAdd: it.priceAtAdd ?? it.product.price,
      subtotal: (it.priceAtAdd ?? it.product.price) * it.quantity
    }));
    const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
    // agregar taxes/shipping si corresponde
    res.json({ success: true, data: { items, subtotal, total: subtotal } });
  } catch (err) { next(err); }
};
