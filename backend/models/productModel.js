const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // Base64 encoded image string
  size: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  stock: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
