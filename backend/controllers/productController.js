const Product = require('../models/productModel');

// Controller to handle GET request to fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// POST method to save product details
const addProduct = async (req, res) => {
  try {
    const { title, image, size, description, price, stock } = req.body;

    if (!title || !image || !size || !description || !price || !stock) {
      return res.status(400).json({ message: 'Please provide all product details' });
    }

    const newProduct = new Product({
      title,
      image,
      size,
      description,
      price,
      stock
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, size, description, price, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, image, size, description, price, stock },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { getAllProducts, addProduct, updateProduct, deleteProduct };
