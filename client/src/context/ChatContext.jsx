import { createContext, useContext, useState } from "react";
import { sendMessage } from "../api/client";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([
    {
      id: "s1",
      title: "Welcome",
      messages: [],
      pinned: false,
      archived: false,
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("s1");
  const [loading, setLoading] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  function newSession() {
    const id = `s${Date.now()}`;
    const session = {
      id,
      title: "New Chat",
      messages: [],
      pinned: false,
      archived: false,
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
  }

  function deleteSession(id) {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      if (id === activeSessionId && updated.length > 0) {
        setActiveSessionId(updated[0].id);
      }
      return updated;
    });
  }

  function pinSession(id) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s)),
    );
  }

  function archiveSession(id) {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, archived: !s.archived } : s)),
    );
  }

  function updateSessionTitle(id, title) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }

  async function sendChat(text) {
    if (!text.trim()) return;

    const userMessage = { role: "user", text, products: [] };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s,
      ),
    );

    if (activeSession.messages.length === 0) {
      updateSessionTitle(activeSessionId, text.slice(0, 30));
    }

    setLoading(true);
    try {
      const [{ reply, products }] = await Promise.all([
        sendMessage(text),
        new Promise((r) => setTimeout(r, 1500)),
      ]);

      const assistantMessage = { role: "assistant", text: reply, products };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, assistantMessage] }
            : s,
        ),
      );
    } catch (err) {
      console.error("Chat error:", err);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: [
                  ...s.messages,
                  {
                    role: "assistant",
                    text: "Sorry, something went wrong.",
                    products: [],
                  },
                ],
              }
            : s,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  // Sorted: pinned first, then by insertion order, archived last
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (a.archived && !b.archived) return 1;
    if (!a.archived && b.archived) return -1;
    return 0;
  });

  return (
    <ChatContext.Provider
      value={{
        sessions: sortedSessions,
        activeSessionId,
        setActiveSessionId,
        activeSession,
        loading,
        sendChat,
        newSession,
        deleteSession,
        pinSession,
        archiveSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
