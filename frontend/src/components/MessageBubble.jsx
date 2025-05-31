"use client";

import ChartVisualization from "./ChartVisualization";

export default function MessageBubble({ data }) {
  if (!data) {
    return (
      <div className="bg-white p-4 rounded-xl shadow mb-4 w-fit break-words">
        <p className="text-red-500">Invalid message data</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4 w-fit break-words">
      {/* Show text if present, otherwise placeholder */}
      <p className="mb-3 text-gray-800 dark:text-gray-200">
        {data.text != null ? data.text : "(No text provided)"}
      </p>

      {/* Only render chart if `data.chart` exists and is an object */}
      {data.chart && typeof data.chart === "object" && (
        <ChartVisualization chart={data.chart} />
      )}
    </div>
  );
}