import { Router } from "express";

const router = Router();

// In-memory cart (resets on server restart — fine for a take-home)
let cart = [];

// GET /api/cart — return current cart
router.get("/", (req, res) => {
  res.json(cart);
});

// POST /api/cart — add item to cart
router.post("/", (req, res) => {
  const { product, size, color, quantity = 1 } = req.body;

  if (!product || !product.id) {
    return res.status(400).json({ error: "product with id is required" });
  }

  const existing = cart.find(
    (item) =>
      item.product.id === product.id &&
      item.size === size &&
      item.color === color,
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ product, size, color, quantity });
  }

  res.json(cart);
});

// PATCH /api/cart/:id — update quantity
router.patch("/:id", (req, res) => {
  const { quantity } = req.body;
  const item = cart.find((i) => i.product.id === req.params.id);

  if (!item) return res.status(404).json({ error: "Item not found in cart" });

  if (quantity <= 0) {
    cart = cart.filter((i) => i.product.id !== req.params.id);
  } else {
    item.quantity = quantity;
  }

  res.json(cart);
});

// DELETE /api/cart/:id — remove item
router.delete("/:id", (req, res) => {
  cart = cart.filter((i) => i.product.id !== req.params.id);
  res.json(cart);
});

export default router;
