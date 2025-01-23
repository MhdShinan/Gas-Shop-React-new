import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const App = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    size: "",
    description: "",
    price: "",
    stock: "",
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:3001/api/products";

  // Fetch all products (GET)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new product (POST)
  const addProduct = async () => {
    try {
      await axios.post(`${API_URL}/add`, formData);
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Update an existing product (PUT)
  const updateProduct = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, formData);
      fetchProducts();
      resetForm();
      setEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Delete a product (DELETE)
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      image: "",
      size: "",
      description: "",
      price: "",
      stock: "",
    });
    setEditId(null);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Product Management
      </h1>

      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Edit Product" : "Add Product"}
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="image"
            placeholder="Image (URL or Base64)"
            value={formData.image}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="size"
            placeholder="Size"
            value={formData.size}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md col-span-1 md:col-span-2 lg:col-span-3"
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
        </form>
        <button
          onClick={editing ? updateProduct : addProduct}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {editing ? "Update Product" : "Add Product"}
        </button>
        {editing && (
          <button
            onClick={resetForm}
            className="mt-4 ml-4 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Products List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-gray-800">{product.title}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-blue-600 font-semibold">${product.price}</span>
              <span className="text-gray-600">Stock: {product.stock}</span>
            </div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => {
                  setFormData(product);
                  setEditId(product._id);
                  setEditing(true);
                }}
                className="flex items-center justify-center w-10 h-10 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => deleteProduct(product._id)}
                className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
