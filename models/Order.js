/**
 * Modelo de órdenes e items. Operaciones sobre orders y order_items.
 */

const pool = require('../config/db');

const createOrder = async (userId, total, stripePaymentIntent = null) => {
  const client = await pool.connect();
  try {
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, stripe_payment_intent)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total, fecha, stripe_payment_intent`,
      [userId, total, stripePaymentIntent]
    );
    return orderResult.rows[0];
  } finally {
    client.release();
  }
};

const createOrderWithItems = async (userId, cartItems, stripePaymentIntent = null) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let total = 0;
    for (const item of cartItems) {
      total += Number(item.precio) * Number(item.cantidad);
    }
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total, stripe_payment_intent)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, total, fecha`,
      [userId, total, stripePaymentIntent]
    );
    const order = orderResult.rows[0];
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.cantidad, item.precio]
      );
    }
    await client.query('COMMIT');
    return order;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

const getOrdersByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, total, fecha, stripe_payment_intent
     FROM orders WHERE user_id = $1 ORDER BY fecha DESC`,
    [userId]
  );
  return result.rows;
};

const getOrderItemsByOrderId = async (orderId) => {
  const result = await pool.query(
    `SELECT oi.id, oi.order_id, oi.product_id, oi.cantidad, oi.precio_unitario,
            p.nombre, p.codigo
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );
  return result.rows;
};

const getOrderByIdAndUser = async (orderId, userId) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [orderId, userId]
  );
  return result.rows[0];
};

module.exports = {
  createOrder,
  createOrderWithItems,
  getOrdersByUserId,
  getOrderItemsByOrderId,
  getOrderByIdAndUser,
};
