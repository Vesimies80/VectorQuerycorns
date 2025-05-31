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
  // 1) Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // 2) userId (from localStorage or obtained via Header)
  const [userId, setUserId] = useState(null);

  // 3) Chat input value
  const [query, setQuery] = useState("");

  // 4) Array of conversations: { index, prompt, response }
  const [conversations, setConversations] = useState([]);

  // 5) ref to force scroll to bottom when new messages arrive
  const bottomRef = useRef(null);
  //
  // On mount: get or create a userId
  //
  useEffect(() => {
    (async () => {
      const id = await getOrCreateUserId();
      console.log("[Home] Using existing userId from localStorage:", id);
      setUserId(id);
    })();
  }, []);

  //
  // Whenever darkMode toggles, add/remove "dark" class on <html>
  //
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  //
  // Auto-scroll whenever conversations change
  //
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  //
  // Handle sending a new prompt to the backend
  //
  const handleSend = async () => {
    if (!query.trim() || !userId) return;

    // Compute the "local" index for this prompt (just the current length)
    const localIndex = conversations.length;

    // 1) Immediately append the user prompt with a null response
    setConversations((prev) => [
      ...prev,
      { index: localIndex, prompt: query, response: null },
    ]);
    setQuery("");

    console.log("[handleSend] calling queryBackend with:", {
      index: localIndex,
      prompt: query,
      userId,
    });

    try {
      // 2) Call the real backend endpoint
      const resp = await queryBackend({
        index: localIndex,
        prompt: query,
        userId,
      });
      console.log("[handleSend] got backend response:", resp);

      // 3) Instead of matching by resp.index (which might not equal localIndex),
      //    attach this resp object to the LAST conversation in the array.
      setConversations((prev) => {
        // Make a shallow copy
        const updated = [...prev];
        // Overwrite the last element's `response` field with our `resp` object
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0) {
          updated[lastIdx] = {
            ...updated[lastIdx],
            response: resp,
          };
        }
        console.log("[handleSend] updated conversations:", updated);
        return updated;
      });
    } catch (err) {
      console.error("[handleSend] queryBackend threw error:", err);

      // 4) If the request fails, set an “error” response on the last conversation
      setConversations((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0) {
          updated[lastIdx] = {
            ...updated[lastIdx],
            response: {
              index: localIndex,
              title: "Error",
              text: "Failed to fetch response from server.",
              chart: null,
            },
          };
        }
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* ───────── Header ───────── */}
      <Header
        darkMode={darkMode}
        onToggle={() => setDarkMode(!darkMode)}
        onLoginSuccess={(id) => {
          console.log("[Home] Received new userId from Header:", id);
          setUserId(id);
        }}
      />

      {/* ── Scrollable Chat Area ── */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        {conversations.map((conv) => {
          console.log("Rendering conversation:", conv);
          return (
            <div key={conv.index}>
              {/* Right-aligned user prompt */}
              <PromptBubble prompt={conv.prompt} />

              {/* Left-aligned server response (only appears if `conv.response` is non-null) */}
              {conv.response && <ResponseBubble response={conv.response} />}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Chat Input (fixed at bottom) ── */}
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