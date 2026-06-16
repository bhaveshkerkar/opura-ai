import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatProvider>
      <CartProvider>
        <CompareProvider>
          <App />
        </CompareProvider>
      </CartProvider>
    </ChatProvider>
  </StrictMode>,
);
