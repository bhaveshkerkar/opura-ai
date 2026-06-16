# Opura AI — Shopping Assistant

A chat-based AI shopping assistant built as a Full Stack Developer Intern take-home assignment.

## Features

- **Chat interface** with session history sidebar
- **AI product search** — type a query like "sneakers under ₹4000" and get matching product cards inline in the chat
- **Product detail modal** — image carousel, color/size selector, wishlist toggle
- **Cart** — add items, adjust quantity, running total (slide-out drawer)
- **Compare Products** — select up to 3 products and view a side-by-side feature table

## Tech Stack

| Layer    | Choice                                   |
| -------- | ---------------------------------------- |
| Frontend | React 18 + Vite + Tailwind CSS           |
| Backend  | Node.js + Express                        |
| State    | React Context (no Redux)                 |
| Database | JSON file (`server/data/products.json`)  |
| AI       | Mocked — keyword + price filter (no LLM) |

## AI Disclaimer

The assistant does **not** use a real language model. It parses the user's message for keywords (product type, price ceiling, color) and filters a local JSON catalog of 10 products. This is intentional and stated transparently per the assignment brief.

## Project Structure

opura-ai/

├── client/ # React + Vite frontend

│ └── src/

│ ├── components/ # UI components

│ ├── context/ # Cart, Chat, Compare context

│ └── api/ # Fetch wrapper

├── server/ # Express backend

│ ├── data/ # products.json catalog

│ ├── routes/ # products, chat, cart, compare

│ └── utils/ # matcher.js (AI logic)

└── README.md

## Getting Started

### 1. Backend

```bash
cd server
npm install
npm run dev
# Runs on http://localhost:4000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Example Queries

- `sneakers under ₹5000`
- `wireless headphones`
- `budget smartwatch`
- `black running shoes`
- `premium audio`
