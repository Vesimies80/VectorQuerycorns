// src/components/ResponseBubble.jsx
"use client";

import { useState } from "react";
import ChartVisualization from "./ChartVisualization";

export default function ResponseBubble({ response }) {
  const [collapsed, setCollapsed] = useState(false);

  // If somehow `response` or `response.chart` is missing, bail out early:
  if (!response.title || !response.text) {
    return (
      <div className="flex justify-start mb-2">
        <div className="bg-white px-4 py-3 rounded-xl shadow inline-block w-fit break-words">
          <p className="text-red-500">Invalid response data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white px-4 py-3 rounded-xl shadow inline-block w-fit break-words">
        {/* Header: title + collapse/expand toggle */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            {response.title}
          </h3>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 ml-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>

        {/* Only show body (text + chart) when not collapsed */}
        {!collapsed && (
          <div className="mt-2">
            {/* Response text */}
            <p className="text-gray-700 dark:text-gray-200">
              {response.text}
            </p>

            {/* ChartVisualization (only if chart object is non-null) */}
            {response.chart && (
              <div className="mt-4">
                <ChartVisualization chart={response.chart} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}