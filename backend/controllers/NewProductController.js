const Product = require('../models/productModel');

// Get all unique product titles with their images
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $group: {
          _id: "$title",
          image: { $first: "$image" }
        }
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          image: 1
        }
      }
    ]);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all size variants for a specific product title
const getProductsByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    
    const products = await Product.find({ title })
      .select('size price stock -_id')
      .lean();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found with this title' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductsByTitle
};