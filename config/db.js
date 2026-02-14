/**
 * Configuración del pool de conexiones a PostgreSQL.
 * Compatible con Render: usa process.env.DATABASE_URL
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificar conexión al iniciar
pool.on('connect', () => {
  console.log('Conexión a PostgreSQL establecida.');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

module.exports = pool;
