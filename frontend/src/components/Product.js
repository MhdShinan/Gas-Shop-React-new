import React, { useState } from 'react';
import Small from "../assets/images/download.jpeg";
import Medium from "../assets/images/download (4).jpeg";
import Large from "../assets/images/images.jpeg";
import xLarge from "../assets/images/download (3).jpeg";

function ProductCard({ title, image }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const openOverlay = () => {
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="relative bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square w-full bg-gray-100 rounded-md mb-2 overflow-hidden">
        {image && (
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover rounded-md"
          />
        )}
      </div>
      <div className="text-center">
        <h3
          onClick={openOverlay}
          className="text-sm font-medium text-gray-900 cursor-pointer truncate"
        >
          {title}
        </h3>
      </div>

      {/* Overlay */}
      {isOverlayOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-80">
            <h4 className="text-xl font-bold mb-4 text-center">Contact</h4>
            <div className="flex justify-center space-x-4">
              <a href="tel:+1234567890" className="text-blue-500">
                <i className="fas fa-phone-alt"></i> Call
              </a>
              <a href="https://maps.google.com/?q=location" target="_blank" rel="noopener noreferrer" className="text-green-500">
                <i className="fas fa-map-marker-alt"></i> Visit
              </a>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={closeOverlay}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductGrid() {
  const products = [
    { id: 1, title: 'Product 1', image: Small },
    { id: 2, title: 'Product 2', image: Medium },
    { id: 3, title: 'Product 3', image: Large },
    { id: 4, title: 'Product 4', image: xLarge },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="w-full bg-blue-500 text-white text-center py-3 mb-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Other Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
