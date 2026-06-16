import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    setIsOpen,
    updateItem,
    removeItem,
    totalItems,
    totalPrice,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 z-50 flex flex-col shadow-2xl border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">
            Cart{" "}
            {totalItems > 0 && (
              <span className="text-indigo-400">({totalItems})</span>
            )}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-3 bg-gray-800 rounded-xl p-3"
              >
                {/* Image */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg shrink-0"
                />

                {/* Info */}
                <div className="flex flex-col flex-1 gap-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {item.product.name}
                  </p>
                  {item.color && (
                    <p className="text-xs text-gray-400">{item.color}</p>
                  )}
                  {item.size && (
                    <p className="text-xs text-gray-400">{item.size}</p>
                  )}
                  <p className="text-indigo-400 text-sm font-semibold">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() =>
                        updateItem(item.product.id, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm flex items-center justify-center transition"
                    >
                      −
                    </button>
                    <span className="text-sm text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateItem(item.product.id, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm flex items-center justify-center transition"
                    >
                      ＋
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-800 space-y-3">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span>
              <span className="text-white font-semibold">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() =>
                alert(
                  "🎉 Order placed successfully! (This is a demo — no real payment processed.)",
                )
              }
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl transition text-sm"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
