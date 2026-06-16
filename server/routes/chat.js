import { Router } from "express";
import { matchProducts } from "../utils/matcher.js";

const router = Router();

// POST /api/chat — receive user message, return assistant reply + matched products
router.post("/", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  const products = matchProducts(message);

  const replyText =
    products.length > 0
      ? `Here are some products I found matching "${message}":`
      : `Sorry, I couldn't find any products matching "${message}". Try a different search!`;

  res.json({
    reply: replyText,
    products,
  });
});

export default router;
