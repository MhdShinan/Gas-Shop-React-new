import React, { useState, useEffect } from "react";
import { BsCart4 } from "react-icons/bs";
import logo from "../assets/images/1.png";
import Small from "../assets/Gas/4.png";
import Medium from "../assets/Gas/3.png";
import Large from "../assets/Gas/2.png";
import xLarge from "../assets/Gas/1.png";
import Form from "./AdvancedOrderForm"; 

// Combined component ProductCard
export default function ProductCard() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);

  const [isReadyToPurchase] = useState(false);
  const products = [
    {
      title: "Small",
      image: Small,
      size: "2.5 kg",
      description: "Perfect for small households and occasional use",
      price: "$25.99",
    },
    {
      title: "Medium",
      image: Medium,
      size: "5.5 kg",
      description: "Ideal for regular home cooking needs",
      price: "$45.99",
    },
    {
      title: "Large",
      image: Large,
      size: "12.5 kg",
      description: "Great for large families and frequent cooking",
      price: "$75.99",
    },
    {
      title: "Extra Large",
      image: xLarge,
      size: "45 kg",
      description: "Best for commercial use and heavy consumption",
      price: "$149.99",
    },
  ];

  useEffect(() => {
    if (showDeliveryForm) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeliveryForm]);

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowDeliveryForm(true);
  };
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
              <br/>
              <button
                className="flex items-center gap-2 bg-[#0685F5] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => handleOrderClick(product)}
              >
                <BsCart4 className="text-xl" />
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Form Modal */}
      {showDeliveryForm && selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div
            className={`w-[600px] h-[500px] rounded-lg p-6 overflow-y-auto ${
              isReadyToPurchase ? "bg-white" : "bg-white"
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-center items-center mb-6 bg-blue-500 rounded-lg p-4">
                <img
                  src={logo}
                  alt="Uwais & Sons"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="text-center mb-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-40 h-40 object-cover mx-auto mb-4 rounded-lg"
                />
                <h3 className="text-2xl font-bold">{selectedProduct.title}</h3>
                <p className="text-xl font-semibold mt-4">
                  {selectedProduct.price}
                </p>
              </div>          
              {/* Action Buttons */}
              <button
                className="flex items-center gap-2 bg-[#0685F5] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <BsCart4 className="text-xl" />
                Order Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
