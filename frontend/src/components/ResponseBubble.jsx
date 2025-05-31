"use client";

import { useState } from "react";
import ChartVisualization from "./ChartVisualization";

export default function ResponseBubble({ response }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex justify-start mb-2">
      <div className="bg-white px-4 py-3 rounded-xl shadow inline-block w-fit break-words">
        {/* Header: title + toggle */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">{response.title}</h3>
          <button
            className="text-sm text-gray-500 hover:text-gray-700 ml-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>

        {/* Only show text+chart when expanded */}
        {!collapsed && (
          <div className="mt-2">
            <p className="text-gray-700">{response.text}</p>
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