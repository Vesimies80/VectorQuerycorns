// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import PromptBubble from "../components/PromptBubble";
import ResponseBubble from "../components/ResponseBubble";
import LoadingBubble from "../components/LoadingBubble";
import ChatInput from "../components/ChatInput";
import { getOrCreateUserId } from "../lib/auth";
import { queryBackend, fetchPreviousPrompts } from "../lib/api";

export default function Home() {
  // 1) Dark mode state (default false, will adjust in useEffect)
  const [darkMode, setDarkMode] = useState(false);

  // 2) userId (from localStorage or obtained via Header)
  const [userId, setUserId] = useState(null);

  // 3) Chat input value
  const [query, setQuery] = useState("");

  // 4) Array of conversations: { index, prompt, response?, loading? }
  const [conversations, setConversations] = useState([]);

  // 5) ref to force scroll to bottom when new messages arrive
  const bottomRef = useRef(null);

  // On mount: get darkMode preference and userId
  useEffect(() => {
    // Retrieve darkMode from localStorage if available
    const storedDark = localStorage.getItem("darkMode");
    if (storedDark !== null) {
      setDarkMode(storedDark === "true");
      if (storedDark === "true") {
        document.documentElement.classList.add("dark");
      }
    }

    // Fetch or create userId
    (async () => {
      const id = await getOrCreateUserId();
      setUserId(id);
    })();
  }, []);

  // Whenever darkMode toggles, add/remove "dark" class and store preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // Auto-scroll whenever conversations change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  // ── New: Fetch previous conversations once userId is available ──
  useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        // 1) Call fetchPreviousPrompts and get an array
        const prevArray = await fetchPreviousPrompts(userId);
        // 2) Map each item into our conversation shape, including its prompt
        const mapped = prevArray.map((item) => ({
          index: item.index,
          prompt: item.prompt ?? null,
          response: {
            index: item.index,
            title: item.title,
            text: item.text,
            chart: item.chart ?? null,
          },
          loading: false,
        }));
        // 3) Populate the state
        setConversations(mapped);
      } catch (err) {
        console.error("Error loading previous conversations:", err);
      }
    })();
  }, [userId]);

  // Handle sending a new prompt to the backend
  const handleSend = async () => {
    if (!query.trim() || !userId) return;

    // Compute the "local" index for this prompt
    const localIndex = conversations.length;

    // 1) Append the user prompt, mark loading
    setConversations((prev) => [
      ...prev,
      {
        index: localIndex,
        prompt: query,
        response: null,
        loading: true,
      },
    ]);

    setQuery("");

    try {
      // 2) Call the backend
      const resp = await queryBackend({ index: localIndex, prompt: query, userId });

      // Ensure resp is valid
      if (!resp || typeof resp !== "object") {
        throw new Error("Invalid response format");
      }

      // 3) Replace loading placeholder with the real response
      setConversations((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          index: resp.index ?? localIndex,
          prompt: query,
          response: resp,
          loading: false,
        };
        return updated;
      });
    } catch (err) {
      console.error("[handleSend] queryBackend threw error:", err);

      // 4) Replace loading placeholder with an error
      setConversations((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = {
          index: localIndex,
          prompt: query,
          response: {
            index: localIndex,
            title: "Error",
            text: "Failed to fetch response from server.",
            chart: null,
          },
          loading: false,
        };
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
        onLoginSuccess={(id) => setUserId(id)}
      />

      {/* Scrollable Chat Area */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {conversations.map((conv) => (
          <div key={conv.index}>
            {/* Right-aligned user prompt (if present) */}
            {conv.prompt != null && <PromptBubble prompt={conv.prompt} />}

            {/* If loading flag is true, show loading GIF */}
            {conv.loading === true && <LoadingBubble />}

            {/* If not loading and response exists, show ResponseBubble */}
            {conv.loading !== true && conv.response && (
              <ResponseBubble response={conv.response} />
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Chat Input (fixed at bottom) */}
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