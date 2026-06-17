import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useCompare } from "../context/CompareContext.jsx";

export default function ProductCard({ product, onViewDetails }) {
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const { addToCompare, isInCompare } = useCompare();

  const inCompare = isInCompare(product.id);

  function handleQuickAdd() {
    addItem(
      product,
      product.sizes?.[0] || null,
      product.colors?.[0] || null,
      1,
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl overflow-hidden shrink-0 w-56 flex flex-col shadow-lg hover:shadow-indigo-900/30 transition-shadow">
      {/* Image */}
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        {/* Discount badge */}
        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {product.discountPercent}% off
        </span>
        {/* Wishlist */}
        <button
          onClick={() => setWishlisted((w) => !w)}
          className="absolute top-2 right-2 text-xl transition"
          title="Wishlist"
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        <p className="text-xs text-gray-400">{product.brand}</p>
        <h3 className="text-sm font-semibold text-white leading-tight">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-indigo-400 font-bold text-sm">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-gray-500 text-xs line-through">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="text-yellow-400">★</span>
          {product.rating}{" "}
          <span className="text-gray-600">({product.reviewCount})</span>
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-2 flex flex-col gap-1.5">
          <button
            onClick={() => onViewDetails(product)}
            className="w-full text-xs bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg transition"
          >
            View Details
          </button>
          <button
            onClick={handleQuickAdd}
            className="w-full text-xs bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded-lg transition"
          >
            Add to Cart
          </button>
          <button
            onClick={() => addToCompare(product)}
            disabled={inCompare}
            className={`w-full text-xs py-1.5 rounded-lg transition ${
              inCompare
                ? "bg-green-700 text-white cursor-default"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {inCompare ? "✓ In Compare" : "Add to Compare"}
          </button>

          {product.productUrl && (
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-1.5 rounded-lg transition text-center"
            >
              Buy on Amazon ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
