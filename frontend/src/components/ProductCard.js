import React, { useState, useEffect } from "react";
import { BsClipboard2Data } from "react-icons/bs";
import { Close } from "@mui/icons-material";

export default function ProductCard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (showDeliveryForm) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeliveryForm]);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowDeliveryForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-4 mb-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Our Products</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Out of Stock Badge */}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg">
                  Out of Stock
                </div>
              )}

              <h2 className="text-[#0685F5] text-lg font-bold mb-4 text-center">
                {product.title}
              </h2>

              <div className="aspect-square w-full bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.title}`}
                  className="w-full h-full object-cover sm:w-32 sm:h-32 md:w-full md:h-full"
                />
              </div>
              <button
                className={`w-full py-2 text-sm font-bold rounded-lg transition-colors ${
                  product.stock === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0685F5] text-white hover:bg-blue-600"
                }`}
                onClick={() => product.stock > 0 && handleOrderClick(product)}
                disabled={product.stock === 0}
              >
                <BsClipboard2Data className="inline-block mr-2" />
                {product.stock > 0 ? "Details" : "Unavailable"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Form Modal */}
      {showDeliveryForm && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96 shadow-lg">
            <div className="text-center mb-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-40 h-40 object-cover mx-auto mb-4 rounded-md"
              />
              <h3 className="text-2xl font-bold">{selectedProduct.title}</h3>
              <p className="text-lg font-semibold text-gray-700 mt-4">
                Price: ${selectedProduct.price}
              </p>
              <p className="text-md text-gray-500 mt-2">
                Stock: {selectedProduct.stock}
              </p>
            </div>

            <button
              className="w-full py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
              onClick={() => setShowDeliveryForm(false)}
            >
              <Close className="inline-block mr-2" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
