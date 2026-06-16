import { Router } from "express";
import products from "../data/products.json" with { type: "json" };

const router = Router();

// POST /api/compare — receive array of product IDs, return full product details
router.post("/", (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids must be a non-empty array" });
  }

  const result = ids
    .map((id) => {
      const product = products.find((p) => p.id === id);
      return product || null;
    })
    .filter(Boolean);

  if (result.length === 0) {
    return res.status(404).json({ error: "No matching products found" });
  }

  res.json(result);
});

export default router;
