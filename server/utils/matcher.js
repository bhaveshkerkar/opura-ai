import products from "../data/products.json" with { type: "json" };

/**
 * Parse a natural-language shopping query and return matching products.
 * Logic is intentionally simple keyword + price filtering — no real LLM.
 */
export function matchProducts(query) {
  const q = query.toLowerCase();

  // --- Extract price ceiling ---
  // Matches "under $5000", "below 3000", "less than ₹2000", etc.
  let maxPrice = Infinity;
  const priceMatch = q.match(
    /(?:under|below|less\s+than|max|upto|up\s+to)\s*[₹$]?\s*(\d[\d,]*)/,
  );
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1].replace(/,/g, ""), 10);
  }

  // --- Extract color hint ---
  const colorKeywords = [
    "black",
    "white",
    "red",
    "blue",
    "grey",
    "gray",
    "navy",
    "silver",
    "yellow",
    "rose gold",
    "green",
  ];
  const wantedColor = colorKeywords.find((c) => q.includes(c)) || null;

  // --- Extract category/tag keywords ---
  // Map common synonyms → canonical tags in products.json
  const categoryMap = {
    sneaker: "sneakers",
    sneakers: "sneakers",
    shoe: "sneakers",
    shoes: "sneakers",
    footwear: "sneakers",
    trainer: "sneakers",
    trainers: "sneakers",
    runner: "sneakers",
    headphone: "headphones",
    headphones: "headphones",
    earphone: "headphones",
    earphones: "headphones",
    audio: "headphones",
    earbud: "headphones",
    watch: "smartwatch",
    watches: "smartwatch",
    smartwatch: "smartwatch",
    smartwatches: "smartwatch",
    wearable: "smartwatch",
    fitness: "smartwatch",
    running: "running",
    casual: "casual",
    wireless: "wireless",
    studio: "studio",
    budget: "budget",
    premium: "premium",
  };

  const words = q.split(/\s+/);
  const matchedTags = new Set();
  for (const word of words) {
    const clean = word.replace(/[^a-z]/g, "");
    if (categoryMap[clean]) matchedTags.add(categoryMap[clean]);
  }

  // --- Score & filter ---
  const scored = products
    .filter((p) => p.price <= maxPrice)
    .map((p) => {
      let score = 0;

      // Tag overlap
      for (const tag of p.tags) {
        if (matchedTags.has(tag)) score += 2;
      }
      // Category match (case-insensitive)
      if (matchedTags.has(p.category.toLowerCase())) score += 3;

      // Color match
      if (wantedColor) {
        const colorMatch = p.colors.some((c) =>
          c.toLowerCase().includes(wantedColor),
        );
        if (colorMatch) score += 1;
      }

      // Slight boost for higher-rated products so ties break well
      score += p.rating * 0.1;

      return { product: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ product }) => product);

  // If no keyword matched but price was specified, return all within budget
  if (scored.length === 0 && maxPrice < Infinity) {
    return products.filter((p) => p.price <= maxPrice);
  }

  // Fallback: return top products by rating
  if (scored.length === 0) {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }

  return scored;
}
