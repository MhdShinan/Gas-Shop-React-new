import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa"; // React Icons
import Small from "../assets/images/download.jpeg";
import Medium from "../assets/images/download (4).jpeg";
import Large from "../assets/images/images.jpeg";
import xLarge from "../assets/images/download (3).jpeg";

function ProductCard({ id, title, text, image, isFlipped, setFlippedCard }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setFlippedCard(isFlipped ? null : id);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      setFlippedCard(id);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setFlippedCard(null);
    }
  };

  // Shared card styles
  const cardStyle = {
    maxWidth: isMobile ? "90%" : "100%",
    margin: isMobile ? "0 auto" : "initial",
    height: "100%", // Ensures both sides have the same height
    width: "100%", // Consistent width
    display: "flex", // Align content consistently
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <ReactCardFlip
      isFlipped={isFlipped}
      flipDirection="horizontal"
      containerStyle={{ height: "100%" }}
    >
      {/* Front Side */}
      <div
        className="relative bg-white p-4 border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-transform transform cursor-pointer"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
      >
        <div className="aspect-square w-full bg-gray-100 rounded-md overflow-hidden mb-3">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-blue-600 truncate">{title}</h2>
          <p className="text-sm font-medium text-red-500 truncate">{text}</p>
        </div>
      </div>

      {/* Back Side */}
      <div
        className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-transform transform cursor-pointer"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
      >
        <div className="flex items-center justify-around h-full">
          <a
            href="tel:+1234567890"
            className="flex flex-col items-center text-white hover:text-gray-300 transition"
          >
            <FaPhoneAlt className="text-3xl mb-2" />
            <span className="text-sm">Call</span>
          </a>
          <a
            href="https://maps.google.com/?q=location"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-white hover:text-gray-300 transition"
          >
            <FaMapMarkerAlt className="text-3xl mb-2" />
            <span className="text-sm">Visit</span>
          </a>
        </div>
      </div>
    </ReactCardFlip>
  );
}

function ProductGrid() {
  const [flippedCard, setFlippedCard] = useState(null);
  const products = [
    { id: 1, title: "Regulators", text: "Click for more details", image: Small },
    { id: 2, title: "Burners", text: "Click for more details", image: Medium },
    { id: 3, title: "Hose", text: "Click for more details", image: Large },
    { id: 4, title: "Pan Support", text: "Click for more details", image: xLarge },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="w-full bg-blue-600 text-white text-center py-4 mb-6 rounded-t-lg">
        <h2 className="text-2xl font-bold">Other Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            text={product.text}
            image={product.image}
            isFlipped={flippedCard === product.id}
            setFlippedCard={setFlippedCard}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
