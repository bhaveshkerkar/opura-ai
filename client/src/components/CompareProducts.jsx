import { useState } from "react";
import { useCompare } from "../context/CompareContext.jsx";
import { getProducts } from "../api/client.js";
import { useEffect } from "react";

const FIELDS = [
  { label: "Brand", key: "brand" },
  { label: "Category", key: "category" },
  { label: "Price", key: "price", format: (v) => `₹${v.toLocaleString()}` },
  {
    label: "Original Price",
    key: "originalPrice",
    format: (v) => `₹${v.toLocaleString()}`,
  },
  { label: "Discount", key: "discountPercent", format: (v) => `${v}%` },
  { label: "Rating", key: "rating", format: (v) => `★ ${v}` },
  { label: "Reviews", key: "reviewCount", format: (v) => v.toLocaleString() },
  { label: "Colors", key: "colors", format: (v) => v.join(", ") },
  {
    label: "Sizes",
    key: "sizes",
    format: (v) => (v.length ? v.join(", ") : "—"),
  },
  { label: "In Stock", key: "inStock", format: (v) => (v ? "✓ Yes" : "✗ No") },
];

export default function CompareProducts({ onBack }) {
  const { compareList, addToCompare, removeFromCompare, clearCompare } =
    useCompare();
  const [allProducts, setAllProducts] = useState([]);
  const [slots, setSlots] = useState([null, null, null]);

  useEffect(() => {
    getProducts().then(setAllProducts).catch(console.error);
  }, []);

  // Sync compareList into slots on mount
  useEffect(() => {
    setSlots((prev) => {
      const updated = [...prev];
      compareList.forEach((p, i) => {
        if (i < 3) updated[i] = p;
      });
      return updated;
    });
  }, []);

  function handleSlotChange(index, productId) {
    const product = allProducts.find((p) => p.id === productId) || null;
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = product;
      return updated;
    });
    if (product) addToCompare(product);
  }

  function handleRemoveSlot(index) {
    const product = slots[index];
    if (product) removeFromCompare(product.id);
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  }

  const activeSlots = slots.filter(Boolean);
  const showTable = activeSlots.length >= 2;

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800 bg-gray-900">
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white mb-3 flex items-center gap-1 transition"
        >
          ← Back to Chat
        </button>
        <h1 className="text-xl font-bold text-white">Compare Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Easily compare features, prices, and ratings
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Slot selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {slots.map((slot, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-2xl p-4 flex flex-col gap-3"
            >
              {slot ? (
                <>
                  <img
                    src={slot.images[0]}
                    alt={slot.name}
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <p className="text-sm font-semibold text-white">
                    {slot.name}
                  </p>
                  <p className="text-indigo-400 text-sm font-bold">
                    ₹{slot.price.toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleRemoveSlot(i)}
                    className="text-xs text-red-400 hover:text-red-300 transition"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <div className="w-full h-36 bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                    + Add Product
                  </div>
                  <select
                    onChange={(e) => handleSlotChange(i, e.target.value)}
                    className="bg-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none border border-gray-600 focus:border-indigo-500 transition"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a product…
                    </option>
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Clear button */}
        {activeSlots.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                clearCompare();
                setSlots([null, null, null]);
              }}
              className="text-xs text-gray-400 hover:text-red-400 transition"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Comparison table */}
        {showTable ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium w-36">
                    Feature
                  </th>
                  {activeSlots.map((p) => (
                    <th
                      key={p.id}
                      className="text-left px-4 py-3 text-white font-semibold"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((field, fi) => (
                  <tr
                    key={field.key}
                    className={fi % 2 === 0 ? "bg-gray-900" : "bg-gray-950"}
                  >
                    <td className="px-4 py-3 text-gray-400 font-medium">
                      {field.label}
                    </td>
                    {activeSlots.map((p) => (
                      <td key={p.id} className="px-4 py-3 text-gray-200">
                        {field.format
                          ? field.format(p[field.key])
                          : p[field.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-sm">
            Select at least 2 products above to see a detailed comparison.
          </p>
        )}
      </div>
    </div>
  );
}
