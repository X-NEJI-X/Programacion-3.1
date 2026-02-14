/**
 * Controlador de carrito: ver, agregar, vaciar. Solo el usuario autenticado accede a su carrito.
 */

const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getMyCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const items = await Cart.getCartByUserId(userId);
    const total = items.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0);
    res.json({ items, total: Math.round(total * 100) / 100 });
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { product_id, cantidad } = req.body;
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    const added = await Cart.addItem(userId, product_id, cantidad || 1);
    const items = await Cart.getCartByUserId(userId);
    const total = items.reduce((sum, item) => sum + Number(item.precio) * Number(item.cantidad), 0);
    res.status(201).json({ items, total: Math.round(total * 100) / 100 });
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Cart.clearCart(userId);
    res.json({ message: 'Carrito vaciado correctamente.', items: [], total: 0 });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyCart,
  addItem,
  clearCart,
};
