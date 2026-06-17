# Opura AI — Shopping Assistant

A chat-based AI shopping assistant

🔗 **Live Demo:** https://opura-ai.vercel.app/
📦 **GitHub:** https://github.com/bhaveshkerkar/opura-ai.git

---

## Features

- 🛍️ **Chat interface** — ChatGPT-style centered layout with session history sidebar
- 🔍 **AI product search** — type a query and get matching product cards inline in chat
- 🛒 **Cart** — add items, adjust quantity, running total (slide-out drawer)
- 📊 **Compare Products** — select up to 3 products, side-by-side feature table
- 🖼️ **Product detail modal** — image carousel, color/size selector, wishlist toggle
- 🌐 **Amazon API integration** — real product results via RapidAPI with local fallback
- 🌌 **Live animated background** — canvas particle network with mouse interaction
- 📱 **Fully responsive** — mobile drawer sidebar, optimized for all screen sizes
- 📌 **Chat session management** — pin, archive, delete chats via ⋮ menu
- 🔗 **Buy on Amazon** — direct links to real Amazon product pages

---

## Tech Stack

| Layer      | Choice                                  |
| ---------- | --------------------------------------- |
| Frontend   | React 18 + Vite + Tailwind CSS v4       |
| Backend    | Node.js + Express                       |
| State      | React Context (Cart, Chat, Compare)     |
| Database   | JSON file (`server/data/products.json`) |
| AI/Search  | RapidAPI Amazon + local keyword matcher |
| Deployment | Vercel (frontend) + Render (backend)    |

---

## AI Disclaimer

The assistant uses a **hybrid approach**:

- **Primary:** RapidAPI Real-Time Amazon Data — live product search with real images, prices, and buy links
- **Fallback:** Local keyword + price filter on a JSON catalog of 10 products (used when API is unavailable)

No LLM is used — this is intentional and transparent per the assignment brief.

---

## Project Structure

opura-ai/

├── client/ # React + Vite frontend

│ ├── public/products/ # Local product images

│ └── src/

│ ├── components/ # Sidebar, ChatWindow, ProductCard,

│ │ # ProductDetailModal, CartDrawer, CompareProducts

│ │ # ChatInput, LiveBackground

│ ├── context/ # ChatContext, CartContext, CompareContext

│ └── api/ # client.js fetch wrapper

├── server/ # Express backend

│ ├── data/products.json # Local product catalog (fallback)

│ ├── routes/ # chat, products, cart, compare

│ └── utils/matcher.js # Local keyword matching logic

├── .gitignore

└── README.md

---

## Getting Started

### Prerequisites

- Node.js v22+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/bhaveshkerkar/opura-ai.git
cd opura-ai
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `server/.env`:

RAPIDAPI_KEY=your_rapidapi_key_here

```bash
npm run dev
# Runs on http://localhost:4000
```

### 3. Frontend setup

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

Then open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

| Variable       | Where            | Description                            |
| -------------- | ---------------- | -------------------------------------- |
| `RAPIDAPI_KEY` | `server/.env`    | RapidAPI key for Amazon product search |
| `VITE_API_URL` | Vercel dashboard | Backend URL for production             |

---

## Example Queries

- `sneakers under ₹5000`
- `wireless headphones`
- `budget smartwatch`
- `black running shoes`
- `premium audio`
- `studio headphones`
- `fitness watch under ₹3000`

---

---

## Author

**Bhavesh Kerkar**  
📧 bhaveshkerkar11@gmail.com  
🔗 [GitHub](https://github.com/bhaveshkerkar)
