import "dotenv/config";
import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import chatRouter from "./routes/chat.js";
import cartRouter from "./routes/cart.js";
import compareRouter from "./routes/compare.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://opura-ai.vercel.app", // replace with your actual Vercel URL
    ],
  }),
); // Vite default port
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/cart", cartRouter);
app.use("/api/compare", compareRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Opura AI server running" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
