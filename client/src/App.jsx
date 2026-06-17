import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import CompareProducts from "./components/CompareProducts.jsx";
import LiveBackground from "./components/LiveBackground.jsx";

export default function App() {
  const [view, setView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen text-white overflow-hidden">
      {/* Live canvas background */}
      <LiveBackground />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 h-full transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass h-full border-r border-white/5">
          <Sidebar
            onCompareClick={() => {
              setView("compare");
              setSidebarOpen(false);
            }}
            onChatClick={() => {
              setView("chat");
              setSidebarOpen(false);
            }}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 glass shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition text-2xl leading-none"
          >
            ☰
          </button>
          <button
            onClick={() => setView("chat")}
            className="text-white font-bold text-lg hover:opacity-80 transition"
          >
            Opura <span className="text-indigo-400">AI</span>
          </button>
        </div>

        {view === "chat" ? (
          <ChatWindow />
        ) : (
          <CompareProducts onBack={() => setView("chat")} />
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
