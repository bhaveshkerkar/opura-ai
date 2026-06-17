import { Router } from "express";
import { matchProducts } from "../utils/matcher.js";

const router = Router();

async function searchAmazonProducts(query) {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // read at call time, not module load

  if (!RAPIDAPI_KEY) {
    console.log("No API key found — using local products");
    return null; // signal to use fallback
  }

  try {
    const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=IN&sort_by=RELEVANCE&product_condition=ALL`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
      },
    });

    const data = await response.json();
    console.log("Amazon API status:", response.status);
    console.log("Amazon API response keys:", Object.keys(data));

    if (!data.data?.products || data.data.products.length === 0) {
      console.log("No Amazon products found, using local fallback");
      return null;
    }

    return data.data.products.slice(0, 8).map((p) => ({
      id: p.asin,
      name: p.product_title,
      brand: p.product_brand || "Amazon",
      category: "Product",
      description: p.product_title,
      price: Math.round(
        parseFloat(p.product_price?.replace(/[^0-9.]/g, "")) || 0,
      ),
      originalPrice: Math.round(
        parseFloat(p.product_original_price?.replace(/[^0-9.]/g, "")) || 0,
      ),
      discountPercent: parseInt(p.discount_percentage?.replace("%", "") || "0"),
      rating: parseFloat(p.product_star_rating) || 0,
      reviewCount: parseInt(p.product_num_ratings) || 0,
      colors: [],
      sizes: [],
      images: [p.product_photo || "/products/placeholder.jpg"],
      tags: [],
      inStock: p.product_availability !== "Currently unavailable",
      productUrl: p.product_url,
    }));
  } catch (err) {
    console.error("Amazon API error:", err.message);
    return null; // fallback on error
  }
}

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  // Try Amazon API first
  let products = await searchAmazonProducts(message);
  let source = "amazon";

  // Fallback to local mock products
  if (!products) {
    products = matchProducts(message);
    source = "local";
  }

  console.log(`Using ${source} products — found ${products.length}`);

  const replyText =
    products.length > 0
      ? source === "amazon"
        ? `Here are some products I found for "${message}" on Amazon:`
        : `Here are some matching products for "${message}":`
      : `Sorry, I couldn't find products for "${message}". Try a different search!`;

  res.json({ reply: replyText, products });
});

export default router;
