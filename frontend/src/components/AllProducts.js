import React, { useState, useEffect } from "react"
import I1 from '../assets/images/MEDIUM.jpeg'

// Sample product data (could be fetched from an API)
const products = [
  { id: 1, title: "Product 1", image: I1, price: "50/=" },
  { id: 2, title: "Product 2", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 3, title: "Product 3", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 4, title: "Product 4", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 5, title: "Product 5", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 6, title: "Product 6", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 7, title: "Product 7", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 8, title: "Product 8", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 9, title: "Product 9", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 10, title: "Product 10", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 11, title: "Product 11", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
  { id: 12, title: "Product 12", image: "/placeholder.svg?height=200&width=200", price: "50/=" },
]

function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false)

  // Fallback for broken or missing image URLs
  const handleError = () => setImageError(true)

  return (
    <div className="card border border-blu-300 rounded-lg p-4 hover:shadow-lg transition-shadow duration-500">
      <img
        src={imageError ? "/placeholder.svg?height=200&width=200" : product.image}
        alt={product.title}
        onError={handleError}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <div className="card-content p-4">
        <h3 className="card-title text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-sm font-semibold">{product.price}</p>
      </div>
    </div>
  )
}

function ProductSection() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate a loading state (e.g., fetching product data from API)
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full bg-blue-600 text-white text-center py-4 mb-6 rounded-t-lg">
          <h2 className="text-2xl font-bold">Other Products</h2>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full bg-blue-600 text-white text-center py-4 mb-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">Other Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductSection
