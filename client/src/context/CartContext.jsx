import { createContext, useContext, useState } from "react";
import { addToCart, updateCartItem, removeFromCart } from "../api/client";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  async function addItem(product, size, color, quantity = 1) {
    try {
      const updated = await addToCart(product, size, color, quantity);
      setCart(updated);
      setIsOpen(true); // open drawer on add
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  }

  async function updateItem(id, quantity) {
    try {
      const updated = await updateCartItem(id, quantity);
      setCart(updated);
    } catch (err) {
      console.error("Update cart failed:", err);
    }
  }

  async function removeItem(id) {
    try {
      const updated = await removeFromCart(id);
      setCart(updated);
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addItem,
        updateItem,
        removeItem,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
