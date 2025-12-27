import React from "react";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";

const ReportsActivityLogs = () => {
  const { t } = useTranslation("reportsActivityLogs");
  const isRTL = i18n.language === "ar";

  const activityLogs = [
    {
      id: 1,
      action: t("submitted", { case: "C-2025-001", name: "Omar" }),
      time: "2025-11-01 09:45 AM",
    },
    {
      id: 2,
      action: t("appealAdded", { case: "C-2025-002" }),
      time: "2025-11-03 01:20 PM",
    },
    {
      id: 3,
      action: t("reminderUpdated", { name: "Fatima" }),
      time: "2025-11-05 02:15 PM",
    },
    {
      id: 4,
      action: t("hearingScheduled", { case: "C-2025-003" }),
      time: "2025-11-06 10:00 AM",
    },
  ];

  return (
    <div
      className={`bg-white p-6 rounded-2xl shadow-lg border border-[#0B1F3B]/20 mt-8
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-3 mb-6 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="bg-[#0B1F3B] p-2 rounded-lg">
          <Activity className="text-white w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#0B1F3B]">
          {t("title")}
        </h2>
      </div>

      {/* Desktop & Tablet */}
      <ul className="hidden sm:block space-y-4">
        {activityLogs.map((log) => (
          <li
            key={log.id}
            className={`flex items-center justify-between bg-[#0B1F3B] p-4 rounded-xl
              border border-white/10 transition-all duration-300
              ${isRTL ? "flex-row-reverse" : ""}
            `}
          >
            <span className="text-white font-medium">{log.action}</span>
            <span className="text-white text-sm font-semibold bg-black/20 px-3 py-1 rounded-full">
              {log.time}
            </span>
          </li>
        ))}
      </ul>

      {/* Mobile */}
      <div className="block sm:hidden space-y-4">
        {activityLogs.map((log) => (
          <div
            key={log.id}
            className={`bg-[#0B1F3B] p-4 rounded-xl border border-white/10
              transition-all duration-300
              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            <p className="text-white font-medium mb-2 text-sm">
              {log.action}
            </p>
            <p className="text-white text-xs font-semibold bg-black/20 px-3 py-1 rounded-full inline-block">
              {log.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsActivityLogs;
