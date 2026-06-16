import { useState } from "react";
import { useChat } from "../context/ChatContext.jsx";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { sendChat, loading } = useChat();

  function handleSend() {
    if (!text.trim() || loading) return;
    sendChat(text.trim());
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-2xl px-4 py-3">
      <button
        className="text-gray-500 hover:text-gray-300 transition text-xl shrink-0"
        title="Attach (not functional)"
      >
        ＋
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything… e.g. sneakers under ₹4000"
        className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
      />
      <button
        className="text-gray-500 hover:text-gray-300 transition text-xl shrink-0"
        title="Voice (not functional)"
      >
        🎤
      </button>
      <button
        onClick={handleSend}
        disabled={!text.trim() || loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-1.5 rounded-xl transition shrink-0"
      >
        {loading ? "..." : "Send"}
      </button>
    </div>
  );
}
