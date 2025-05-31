// src/components/ChatInput.js
"use client";

import { useState, useEffect, useRef } from "react";

/**
 * ChatInput with a mic button that uses the Web Speech API
 * to perform speech recognition entirely on the client side.
 */
export default function ChatInput({ value, onChange, onSubmit, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition once on mount
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser.");
      return;
    } else {
      console.log("Web Speech API is supported.");
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false; // Stop automatically after a pause
    recognition.interimResults = false; // Only final results
    recognition.lang = "en-US"; // Adjust language as needed

    // When speech is recognized, append it to the input value
    recognition.addEventListener("result", (event) => {
      const transcript = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join("");
      // Append recognized text (with a preceding space if needed)
      onChange((prev) => (prev ? prev + " " : "") + transcript);
    });

    // When recognition ends (either on stop() or silence), update state
    recognition.addEventListener("end", () => {
      setIsRecording(false);
    });

    // Cleanup on unmount
    return () => {
      recognition.abort();
    };
  }, [onChange]);

  // Handler: start or stop recognition
  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Mic Button */}
      <button
        onClick={handleMicClick}
        disabled={disabled}
        className={`
          p-2 rounded-full
          ${isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"}
          focus:outline-none
        `}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          // “Stop” icon (square)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
          >
            <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
          </svg>
        ) : (
          // “Mic” icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-800 dark:text-gray-200"
            viewBox="0 0 24 24"
          >
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2z" />
            <path d="M19 11v1a7 7 0 0 1-14 0v-1H3v1a9 9 0 0 0 18 0v-1z" />
            <path
              d="M12 18v3m0 0h-3m3 0h3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Text Input Field */}
      <input
        type="text"
        placeholder="Type your question..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="
          flex-grow px-3 py-2 border rounded-l-md focus:outline-none
          bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
          disabled:opacity-50
        "
      />

      {/* Send Button */}
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="
          px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700
          disabled:opacity-50
        "
      >
        Send
      </button>
    </div>
  );
}