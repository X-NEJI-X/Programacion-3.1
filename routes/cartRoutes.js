/**
 * Rutas de carrito. Todas requieren autenticación y afectan solo al usuario logueado.
 */

const express = require('express');
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { addToCartRules, validate } = require('../validators/cartValidator');

const router = express.Router();

router.get('/', verifyToken, cartController.getMyCart);
router.post('/add', verifyToken, addToCartRules, validate, cartController.addItem);
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
