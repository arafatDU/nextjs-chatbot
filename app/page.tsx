"use client";
import { useState, useRef, useEffect } from "react";
import { getChatResponse } from "./utils/api";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return "dark";
    }
    return "dark";
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

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
    <div className={`relative min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#343541]" : "bg-gradient-to-br from-blue-50 to-white"} font-[family-name:var(--font-geist-sans)]`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-8 ${theme === "dark" ? "bg-[#202123]/90" : "bg-white/80"} shadow z-20 transition-colors duration-300`}>
        <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-blue-600"}`}>ChadGPT</div>
        <button
          aria-label="Toggle dark mode"
          className="rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 dark:bg-[#444654] hover:bg-gray-200 dark:hover:bg-[#353740]"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
      </nav>
      {/* Main chat area */}
      <main className="flex flex-col items-center sm:items-start w-full max-w-4xl mx-auto pt-24 pb-44 px-2">
        <div className={`w-full flex flex-col gap-4 ${theme === "dark" ? "bg-[#343541] border-[#353740]" : "bg-blue-50/80 border-blue-100"} rounded-xl shadow-lg p-8 min-h-[60vh] max-h-[70vh] overflow-y-auto border transition-colors duration-300`}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-line text-base shadow-sm transition-colors duration-300 ${
                  msg.role === "user"
                    ? theme === "dark"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-blue-500 text-white rounded-br-none"
                    : theme === "dark"
                      ? "bg-[#444654] text-gray-100 rounded-bl-none border border-[#353740]"
                      : "bg-white text-gray-900 rounded-bl-none border border-blue-200"
                }`}
              >
                <ReactMarkdown
                  components={{
                    a: (props: any) => <a {...props} className="underline text-blue-500 hover:text-blue-700" target="_blank" rel="noopener noreferrer"/>,
                    code: (props: any) => <code {...props} className="bg-gray-200 dark:bg-[#22242c] px-1 py-0.5 rounded text-sm font-mono"/>,
                    strong: (props: any) => <strong {...props} className="font-semibold"/>,
                    em: (props: any) => <em {...props} className="italic"/>,
                    ul: (props: any) => <ul {...props} className="list-disc ml-6"/>,
                    ol: (props: any) => <ol {...props} className="list-decimal ml-6"/>,
                    blockquote: (props: any) => <blockquote {...props} className="border-l-4 border-blue-300 pl-4 italic text-gray-500"/>,
                    pre: (props: any) => <pre {...props} className="bg-gray-100 dark:bg-[#22242c] p-2 rounded mb-2 overflow-x-auto"/>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
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
        className="fixed left-0 w-full flex justify-center items-center z-30 transition-colors duration-300"
        style={{ bottom: '40px', pointerEvents: 'none' }}
      >
        <div
          className={`w-full max-w-4xl flex gap-2 rounded-full shadow-lg border ${theme === "dark" ? "bg-[#40414f]/95 border-[#353740]" : "bg-white/90 border-blue-100"} py-3 px-4 items-center pointer-events-auto`}
          style={{ backdropFilter: 'blur(6px)' }}
        >
          <div className="flex-1 flex items-center bg-transparent">
            <input
              type="text"
              className={`w-full rounded-full border px-4 py-3 text-base shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-300 ${theme === "dark" ? "bg-[#353740] border-[#353740] text-white placeholder-gray-400" : "bg-white/90 border-blue-200"}`}
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className={`font-semibold px-6 py-3 rounded-full shadow transition disabled:opacity-60 disabled:cursor-not-allowed ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
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