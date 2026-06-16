import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext.jsx";
import ChatInput from "./ChatInput.jsx";
import ProductCard from "./ProductCard.jsx";
import ProductDetailModal from "./ProductDetailModal.jsx";

export default function ChatWindow() {
  const { activeSession, loading } = useChat();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, loading]);

  const isEmpty = activeSession?.messages.length === 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Greeting */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center text-center gap-4 mt-16 md:mt-24">
              <div className="text-6xl">🛍️</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                How can I help you today?
              </h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Try asking: "Show me sneakers under ₹4000" or "wireless
                headphones"
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {[
                  "Sneakers under ₹5000",
                  "Wireless headphones",
                  "Budget smartwatch",
                  "Premium audio",
                ].map((s) => (
                  <SuggestionChip key={s} label={s} />
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {activeSession?.messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-xs md:max-w-xl ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                {msg.text}
              </div>

              {msg.products?.length > 0 && (
                <div
                  className="mt-3 flex gap-3 overflow-x-auto pb-3 w-full"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {msg.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={setSelectedProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loader */}
          {loading && (
            <div className="flex items-start">
              <div className="bg-gray-800 px-4 py-3 rounded-2xl flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 glass-light py-3 md:py-4">
        <div className="max-w-3xl mx-auto px-4">
          <ChatInput />
        </div>
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function SuggestionChip({ label }) {
  const { sendChat } = useChat();
  return (
    <button
      onClick={() => sendChat(label)}
      className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-full border border-gray-700 transition"
    >
      {label}
    </button>
  );
}
