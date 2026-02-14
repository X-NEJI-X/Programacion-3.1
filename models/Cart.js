/**
 * Modelo de carrito. Operaciones sobre la tabla cart.
 */

const pool = require('../config/db');

const getCartByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT c.id, c.user_id, c.product_id, c.cantidad, c.created_at,
            p.codigo, p.nombre, p.precio, p.descripcion
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const addItem = async (userId, productId, cantidad = 1) => {
  const result = await pool.query(
    `INSERT INTO cart (user_id, product_id, cantidad)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET cantidad = cart.cantidad + EXCLUDED.cantidad
     RETURNING id, user_id, product_id, cantidad, created_at`,
    [userId, productId, cantidad]
  );
  return result.rows[0];
};

const updateQuantity = async (userId, cartItemId, cantidad) => {
  const result = await pool.query(
    `UPDATE cart SET cantidad = $1
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [cantidad, cartItemId, userId]
  );
  return result.rows[0];
};

const removeItem = async (userId, cartItemId) => {
  const result = await pool.query(
    'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING id',
    [cartItemId, userId]
  );
  return result.rows[0];
};

const clearCart = async (userId) => {
  await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
};

module.exports = {
  getCartByUserId,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
};
