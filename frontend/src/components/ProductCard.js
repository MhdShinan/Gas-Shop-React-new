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

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="w-full bg-blue-500 text-white text-center py-3 mb-4 rounded-t-lg">
          <h2 className="text-xl font-bold">Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 flex flex-col items-center"
            >
              <h2 className="text-[#0685F5] text-2xl font-bold mb-6">
                {product.title}
              </h2>
              <div className="relative w-full h-64 mb-6">
                <div className="aspect-square w-full bg-gray-100 rounded-md mb-2 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.title} Gas Cylinder`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
              <button
                className="flex items-center gap-2 bg-[#0685F5] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => handleOrderClick(product)}
              >
                <BsClipboard2Data className="text-xl" />
                Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Form Modal */}
      {showDeliveryForm && selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="w-[250px] h-[450px] rounded-lg p-6 overflow-y-auto bg-white">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-40 h-40 object-cover mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-2xl font-bold">{selectedProduct.title}</h3>
                <p className="text-xl font-semibold mt-4">
                  Price: {selectedProduct.price}
                  <br />
                  Stock: {selectedProduct.stock}
                </p>
              </div>
              <button
                className="flex items-center gap-2 bg-red-500 text-white px-16 py-3 rounded-lg hover:bg-red-700 transition-colors"
                onClick={() => setShowDeliveryForm(false)}
              >
                <Close className="text-xl" />
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
