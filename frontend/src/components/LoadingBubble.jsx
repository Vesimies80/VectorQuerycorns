// src/components/LoadingBubble.jsx
"use client";

import Image from "next/image";
import loadingGif from "../../public/loading.gif"; // Path to public folder

export default function LoadingBubble() {
  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white px-4 py-3 rounded-xl shadow inline-block w-fit break-words">
        <div className="flex items-center">
          <Image
            src={loadingGif}
            alt="Loading..."
            width={300}
            height={300}
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}