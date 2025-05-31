// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import ChatInput from "../components/ChatInput";
import PromptBubble from "../components/PromptBubble";
import ResponseBubble from "../components/ResponseBubble";
import { queryBackend } from "../lib/api";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const bottomRef = useRef(null);

  // Toggle the `dark` class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Scroll to bottom whenever conversations change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const idx = conversations.length;
    // 1. Add the user prompt locally
    setConversations((prev) => [
      ...prev,
      { index: idx, prompt: query, response: null },
    ]);
    setQuery("");

    // 2. Call mock/backend
    const data = await queryBackend({ index: idx, prompt: query });

    // 3. Update the conversation with the returned response
    setConversations((prev) =>
      prev.map((conv) =>
        conv.index === data.index ? { ...conv, response: data } : conv
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* ─────── Header ─────── */}
      <Header darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

      {/* ─── Messages scrollable area ─── */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {conversations.map((conv) => (
          <div key={conv.index}>
            <PromptBubble prompt={conv.prompt} />
            {conv.response && <ResponseBubble response={conv.response} />}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ─── Chat input fixed at bottom ─── */}
      <div className="border-t bg-white dark:bg-gray-800 p-4">
        <ChatInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSend}
        />
      </div>
    </div>
  );
}