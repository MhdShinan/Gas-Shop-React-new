import React, { useState, useEffect } from "react";
import I1 from "../assets/images/MEDIUM.jpeg";

// Sample product data (could be fetched from an API)
const products = [
  { id: 1, title: "Product 1", image: I1, price: "50/=", inStock: true },
  { id: 2, title: "Product 2", image: "/placeholder.svg?height=200&width=200", price: "70/=", inStock: false },
  { id: 3, title: "Product 3", image: "/placeholder.svg?height=200&width=200", price: "80/=", inStock: true },
  // Add more products...
];

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);

  const handleError = () => setImageError(true);

  return (
    <div className="card group border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform transform hover:scale-105 duration-300 bg-white h-72 sm:h-80 md:h-96">
      <div className="relative h-3/5">
        <img
          src={imageError ? "/placeholder.svg?height=200&width=200" : product.image}
          alt={product.title}
          onError={handleError}
          className="w-full h-full object-cover"
        />
        {!product.inStock && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4 h-2/5">
        <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{product.price}</p>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4 h-72 sm:h-80 md:h-96">
      <div className="w-full h-3/5 bg-gray-200 rounded-lg"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

function ProductSection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-4 mb-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">Other Products</h2>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductSection;
