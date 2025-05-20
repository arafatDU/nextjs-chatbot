"use client";
import { useState, useRef, useEffect } from "react";
import { getChatResponse } from "./utils/api";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const data = await getChatResponse(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "No response." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full h-16 flex items-center px-8 bg-white/80 shadow z-20">
        <div className="text-2xl sm:text-3xl font-bold text-blue-600 tracking-tight">ChatGPT</div>
      </nav>
      {/* Main chat area */}
      <main className="flex flex-col items-center sm:items-start w-full max-w-xl mx-auto pt-24 pb-32 px-2">
        <div className="w-full flex flex-col gap-4 bg-white/80 rounded-xl shadow-lg p-6 min-h-[400px] max-h-[60vh] overflow-y-auto border border-blue-100">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-line text-base shadow-sm ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none border border-blue-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </main>
      {/* Fixed input at bottom */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 w-full flex justify-center items-center bg-white/90 py-4 px-2 border-t border-blue-100 z-30"
        style={{backdropFilter: 'blur(6px)'}}
      >
        <div className="w-full max-w-xl flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-full border border-blue-200 px-4 py-3 text-base shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-blue-400 rounded-full align-middle" />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
      <footer className="absolute bottom-0 left-0 w-full pb-2 flex gap-[24px] flex-wrap items-center justify-center text-gray-400 text-sm z-10 pointer-events-none select-none">
        <div className="text-muted">@arafat</div>
      </footer>
    </div>
  );
}