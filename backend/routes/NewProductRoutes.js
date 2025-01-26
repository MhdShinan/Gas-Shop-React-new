const express = require('express');
const router = express.Router();
const { 
  getAllProducts,
  getProductsByTitle 
} = require('../controllers/NewProductController');

// Get all unique products (titles with images)
router.get('/', getAllProducts);

// Get all size variants for a specific product title
router.get('/:title', getProductsByTitle);

module.exports = router;