import React from "react";
import { useTranslation } from "react-i18next";

export default function RecentActivity({ recentActivities }) {
  const { t } = useTranslation("secretaryDashboard");

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-[#0B1F3B]">
          {t("recentActivityTitle")}
        </h3>
        <span className="text-sm text-[#0B1F3B] bg-slate-50 px-3 py-1 rounded-full font-medium">
          {t("last24Hours")}
        </span>
      </div>

      {/* Activity List */}
      {recentActivities && recentActivities.length > 0 ? (
        <ul className="space-y-3">
          {recentActivities.map((activity) => (
            <li
              key={activity._id || activity.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#F5F7FA] transition-colors duration-200"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-3 h-3 bg-[#0B1F3B] rounded-full border-2 border-white shadow-md"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700 font-medium">{activity.activity}</p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm">{t("noRecentActivity")}</p>
        </div>
      )}
    </div>
  );
}
