// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import PromptBubble from "../components/PromptBubble";
import ResponseBubble from "../components/ResponseBubble";
import ChatInput from "../components/ChatInput";
import { getOrCreateUserId } from "../lib/auth";
import { queryBackend } from "../lib/api";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const bottomRef = useRef(null);

  // Fetch or create userId once on mount
  useEffect(() => {
    (async () => {
      const id = await getOrCreateUserId();
      setUserId(id);
    })();
  }, []);

  // Apply Tailwind’s dark class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSend = async () => {
    if (!query.trim() || !userId) return;

    const idx = conversations.length;
    setConversations((prev) => [
      ...prev,
      { index: idx, prompt: query, response: null },
    ]);
    setQuery("");

    const data = await queryBackend({ index: idx, prompt: query, userId });
    setConversations((prev) =>
      prev.map((conv) =>
        conv.index === data.index ? { ...conv, response: data } : conv
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
        onLoginSuccess={(id) => setUserId(id)}
      />

      <div className="flex-grow overflow-y-auto px-4 py-2">
        {conversations.map((conv) => (
          <div key={conv.index}>
            <PromptBubble prompt={conv.prompt} />
            {conv.response && <ResponseBubble response={conv.response} />}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t bg-white dark:bg-gray-800 p-4">
        <ChatInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSend}
          disabled={!userId}
        />
      </div>
    </div>
  );
}