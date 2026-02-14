/**
 * Manejo de errores centralizado.
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
