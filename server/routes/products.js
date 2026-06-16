import { Router } from "express";
import products from "../data/products.json" with { type: "json" };

const router = Router();

// GET /api/products — return full catalog
router.get("/", (req, res) => {
  res.json(products);
});

// GET /api/products/:id — return single product
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export default router;
