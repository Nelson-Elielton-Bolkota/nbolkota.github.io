const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct
} = require('../controllers/products');

// Rotas CRUD
router.post('/', createProduct);
router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;