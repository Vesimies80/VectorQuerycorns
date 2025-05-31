// src/components/Header.js
"use client";

export default function Header({ darkMode, onToggle }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800">
      {/* Team name with unicorn emoji in the middle */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Vector&nbsp;<span className="inline-block">🦄</span>&nbsp;Querycorns
      </h1>

      {/* Bright/Dark toggle button */}
      <button
        onClick={onToggle}
        className="text-2xl focus:outline-none select-none text-gray-700 dark:text-gray-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}