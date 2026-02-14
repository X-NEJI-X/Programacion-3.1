/**
 * Modelo de usuario. Operaciones sobre la tabla users.
 */

const pool = require('../config/db');

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, nombre, email, password, rol, created_at FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, nombre, email, rol, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const create = async (nombre, email, passwordHash, rol) => {
  const result = await pool.query(
    `INSERT INTO users (nombre, email, password, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, rol, created_at`,
    [nombre, email, passwordHash, rol]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  create,
};
