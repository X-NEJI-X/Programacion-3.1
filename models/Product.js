/**
 * Modelo de producto (álbum). Operaciones sobre la tabla products.
 */

const pool = require('../config/db');

const COLS = 'id, codigo, nombre, precio, descripcion, artista, imagen, genero, anio, num_canciones, info_relevante, created_at';

const findAll = async () => {
  const result = await pool.query(
    `SELECT ${COLS} FROM products
     ORDER BY COALESCE(genero, '') ASC, anio ASC NULLS LAST, created_at DESC`
  );
  return result.rows;
};

const findByCode = async (codigo) => {
  const result = await pool.query(
    `SELECT ${COLS} FROM products WHERE codigo = $1`,
    [codigo]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT ${COLS} FROM products WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const create = async (data) => {
  const {
    nombre, codigo, precio, descripcion,
    artista, imagen, genero, anio, num_canciones, info_relevante,
  } = data;
  const result = await pool.query(
    `INSERT INTO products (nombre, codigo, precio, descripcion, artista, imagen, genero, anio, num_canciones, info_relevante)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${COLS}`,
    [
      nombre, codigo, precio || null, descripcion || null,
      artista || null, imagen || null, genero || null,
      anio != null && anio !== '' ? parseInt(anio, 10) : null,
      num_canciones != null && num_canciones !== '' ? parseInt(num_canciones, 10) : null,
      info_relevante || null,
    ]
  );
  return result.rows[0];
};

module.exports = {
  findAll,
  findByCode,
  findById,
  create,
};
