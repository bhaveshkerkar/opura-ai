import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useCompare } from "../context/CompareContext.jsx";

export default function ProductDetailModal({ product, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || null,
  );
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [wishlisted, setWishlisted] = useState(false);

  const { addItem } = useCart();
  const { addToCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(product.id);

  function handleAddToCart() {
    addItem(product, selectedSize, selectedColor, 1);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Left — image carousel */}
          <div className="flex flex-col items-center gap-3 md:w-1/2">
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-800">
              <img
                src={product.images[currentImage]}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              {/* Wishlist */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="absolute top-3 right-3 text-2xl"
              >
                {wishlisted ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    i === currentImage ? "bg-indigo-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right — details */}
          <div className="flex flex-col gap-4 md:w-1/2">
            <p className="text-xs text-gray-400">
              {product.brand} · {product.category}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-indigo-400">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-gray-500 line-through text-sm">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {product.discountPercent}% off
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span className="text-yellow-400">★</span>
              {product.rating}
              <span className="text-gray-600 ml-1">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                  Color
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        selectedColor === color
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-gray-600 text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-full text-xs border transition ${
                        selectedSize === size
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-gray-600 text-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2 mt-auto pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-xl transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => addToCompare(product)}
                disabled={inCompare}
                className={`w-full text-sm font-medium py-2.5 rounded-xl transition ${
                  inCompare
                    ? "bg-green-700 text-white cursor-default"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {inCompare ? "✓ Added to Compare" : "Add to Compare List"}
              </button>

              {product.productUrl && (
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold py-2.5 rounded-xl transition"
                >
                  Buy on Amazon ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
