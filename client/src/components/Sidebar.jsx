import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Sidebar({ onCompareClick, onChatClick, onClose }) {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    newSession,
    deleteSession,
    pinSession,
    archiveSession,
  } = useChat();
  const { totalItems, setIsOpen } = useCart();
  const [menu, setMenu] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSessionClick(id) {
    setActiveSessionId(id);
    onChatClick();
    setMenu(null);
  }

  function handleDotsClick(e, id) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenu({ id, x: rect.right + 4, y: rect.top });
  }

  const pinned = sessions.filter((s) => s.pinned && !s.archived);
  const regular = sessions.filter((s) => !s.pinned && !s.archived);
  const archived = sessions.filter((s) => s.archived);

  return (
    <>
      <aside className="w-64 h-full flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-800 flex items-center justify-between">
          <button
            onClick={() => {
              onChatClick();
            }}
            className="text-left hover:opacity-80 transition"
          >
            <h1 className="text-xl font-bold tracking-tight text-white">
              Opura <span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Shopping Assistant</p>
          </button>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:text-white text-2xl leading-none transition"
          >
            ✕
          </button>
        </div>

        {/* New Chat */}
        <div className="px-3 pt-4 pb-2">
          <button
            onClick={() => {
              newSession();
              onChatClick();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            <span className="text-base">＋</span> New Chat
          </button>
        </div>

        {/* Nav links */}
        <div className="px-3 pb-3 space-y-1">
          <button
            onClick={onCompareClick}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <span>⇄</span> Compare Products
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <span>🛒</span> Cart
            {totalItems > 0 && (
              <span className="ml-auto bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="border-t border-gray-800 mx-3" />

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <SessionGroup
            label="📌 Pinned"
            sessions={pinned}
            activeSessionId={activeSessionId}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onSelect={handleSessionClick}
            onDots={handleDotsClick}
            menuOpenId={menu?.id}
          />
          <SessionGroup
            label="Recent Chats"
            sessions={regular}
            activeSessionId={activeSessionId}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onSelect={handleSessionClick}
            onDots={handleDotsClick}
            menuOpenId={menu?.id}
          />
          <SessionGroup
            label="🗄 Archived"
            sessions={archived}
            activeSessionId={activeSessionId}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onSelect={handleSessionClick}
            onDots={handleDotsClick}
            menuOpenId={menu?.id}
          />
        </div>

        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">
          AI responses are simulated
        </div>
      </aside>

      {/* Dropdown menu */}
      {menu && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-1 w-44 text-sm"
          style={{ top: menu.y, left: menu.x }}
        >
          <button
            onClick={() => {
              pinSession(menu.id);
              setMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
          >
            📌{" "}
            {sessions.find((s) => s.id === menu.id)?.pinned ? "Unpin" : "Pin"}
          </button>
          <button
            onClick={() => {
              archiveSession(menu.id);
              setMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition flex items-center gap-2"
          >
            🗄{" "}
            {sessions.find((s) => s.id === menu.id)?.archived
              ? "Unarchive"
              : "Archive"}
          </button>
          <div className="border-t border-gray-700 my-1" />
          <button
            onClick={() => {
              deleteSession(menu.id);
              setMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition flex items-center gap-2"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </>
  );
}

function SessionGroup({
  label,
  sessions,
  activeSessionId,
  hoveredId,
  setHoveredId,
  onSelect,
  onDots,
  menuOpenId,
}) {
  if (sessions.length === 0) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider px-2 mb-1.5">
        {label}
      </p>
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;
        const isHovered = hoveredId === session.id;
        const isMenuOpen = menuOpenId === session.id;
        const showDots = isHovered || isActive || isMenuOpen;

        return (
          <div
            key={session.id}
            className={`relative flex items-center rounded-xl mb-0.5 transition ${
              isActive ? "bg-indigo-600" : "hover:bg-gray-800"
            }`}
            onMouseEnter={() => setHoveredId(session.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <button
              onClick={() => onSelect(session.id)}
              className={`flex-1 text-left px-3 py-2 text-sm truncate ${
                isActive ? "text-white" : "text-gray-400"
              }`}
            >
              {session.pinned && <span className="mr-1">📌</span>}
              {session.title || "New Chat"}
            </button>
            {showDots && (
              <button
                onClick={(e) => onDots(e, session.id)}
                className={`shrink-0 px-2 py-2 text-lg leading-none transition ${
                  isActive
                    ? "text-indigo-200 hover:text-white"
                    : "text-gray-500 hover:text-gray-200"
                }`}
              >
                ⋮
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
