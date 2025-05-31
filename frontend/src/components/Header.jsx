// src/components/Header.js
"use client";

export default function Header({ darkMode, onToggle }) {
  return (
    <header className="relative flex items-center px-6 py-3 bg-white dark:bg-gray-800">
      {/* Centered Team Name */}
      <h1 className="flex-1 text-center text-xl font-bold text-gray-900 dark:text-gray-100">
        Vector&nbsp;<span className="inline-block">🦄</span>&nbsp;Querycorns
      </h1>

      {/* Bright/Dark toggle (absolutely positioned on the right) */}
      <button
        onClick={onToggle}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl focus:outline-none select-none text-gray-700 dark:text-gray-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}