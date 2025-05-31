// src/components/LoadingBubble.jsx
"use client";

export default function LoadingBubble() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white px-4 py-3 rounded-xl shadow inline-block w-fit break-words">
        <div className="flex items-center">
          {/* 300×300px GIF */}
          <img
            src="/loading.gif"
            alt="Loading..."
            className="w-[300px] h-[300px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}