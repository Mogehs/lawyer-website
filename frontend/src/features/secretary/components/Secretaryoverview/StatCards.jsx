// src/components/dashboard/StatCards.jsx
import React from "react";

export default function StatCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[14px] font-medium text-[#0B1F3B]">
                {metric.title}
              </p>
              <p className="text-lg font-bold mt-1 text-slate-800">
                {metric.value}
              </p>
            </div>
            <div className="text-white bg-[#0B1F3B] p-1.5 rounded-md flex items-center justify-center">
              {React.cloneElement(metric.icon, { size: 16 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
