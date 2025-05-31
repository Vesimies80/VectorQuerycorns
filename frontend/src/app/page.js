"use client"
import { useState } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";

import { fetchMock } from "../api/testQuery";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);

  const handleSend = async () => {
    const data = await fetchMock("bar");
    setResponse(data);
  };

  return (
    <main className="...">
      {response && <MessageBubble data={response} />}
      <ChatInput value={query} onChange={setQuery} onSubmit={handleSend} />
    </main>
  );
}