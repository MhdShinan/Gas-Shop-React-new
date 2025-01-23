const express = require('express');
const { addProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

// Routes
router.post('/add', addProduct); // Add a product
router.get('/', getAllProducts); // Get all products
router.put('/:id', updateProduct); // Update a product by ID
router.delete('/:id', deleteProduct); // Delete a product by ID

module.exports = router;
