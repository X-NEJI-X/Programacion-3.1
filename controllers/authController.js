/**
 * Controlador de autenticación: registro y login.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create(nombre, email, hash, rol || 'usuario');
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login correcto.',
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  me,
};
