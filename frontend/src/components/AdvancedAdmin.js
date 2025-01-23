import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, Toaster } from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const App = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    size: "",
    description: "",
    price: "",
    stock: "",
    image: "",
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
      toast.error("Error fetching products!");
      console.error(error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload and convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Add a new product (POST)
  const addProduct = async () => {
    try {
      await axios.post(`${API_URL}/add`, formData);
      toast.success("Product added successfully!");
      fetchProducts();
      resetForm();
    } catch (error) {
      toast.error("Error adding product!");
      console.error(error);
    }
  };

  // Update an existing product (PUT)
  const updateProduct = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, formData);
      toast.success("Product updated successfully!");
      fetchProducts();
      resetForm();
      setEditing(false);
    } catch (error) {
      toast.error("Error updating product!");
      console.error(error);
    }
  };

  // Delete a product (DELETE) with confirmation alert
  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/${id}`)
          .then(() => {
            toast.success("Product deleted successfully!");
            fetchProducts();
          })
          .catch((error) => {
            toast.error("Error deleting product!");
            console.error(error);
          });
      }
    });
  };

  // Reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      size: "",
      description: "",
      price: "",
      stock: "",
      image: "",
    });
    setEditId(null);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster />
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
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
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
            <img
              src={product.image}
              alt={product.title}
              className="rounded-md mb-4 w-full h-40 object-cover"
            />
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
