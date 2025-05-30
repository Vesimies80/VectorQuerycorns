"use client";

import { useState } from "react";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleSend = async () => {
    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <main className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex-grow">
        {response && <MessageBubble data={response} />}
      </div>
      <div className="mt-4">
        <ChatInput
          value={query}
          onChange={setQuery}
          onSubmit={handleSend}
        />
      </div>
    </main>
  );
}