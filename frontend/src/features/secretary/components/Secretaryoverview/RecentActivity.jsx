// src/components/dashboard/RecentActivity.jsx
import React from "react";

export default function RecentActivity({ recentActivities }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-2xl font-semibold text-slate-600">
          Recent Activity
        </h3>
        <span className="text-md text-[#A48C65] bg-slate-50 px-2 py-0.5 rounded">
          Last 24 hours
        </span>
      </div>

      {recentActivities && recentActivities.length > 0 ? (
        <ul className="space-y-2">
          {recentActivities.map((a) => (
            <li
              key={a._id || a.id}
              className="flex items-start space-x-2 pb-2 border-b border-slate-100 last:border-b-0 last:pb-0"
            >
              <div className="w-1.5 h-1.5 bg-[#A48C65] rounded-full mt-2.5 shrink-0"></div>
              <div className="flex-1">
                <p className="text-slate-600 text-md">{a.activity}</p>
                <p className="text-[#A48C65] text-[10px] mt-0.5">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-600 text-xs">No recent activity</p>
        </div>
      )}
    </div>
  );
}
