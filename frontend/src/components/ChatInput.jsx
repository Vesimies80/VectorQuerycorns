// src/components/ChatInput.js
"use client";

export default function ChatInput({ value, onChange, onSubmit, disabled }) {
  return (
    <div className="flex items-center space-x-2">
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