import { Activity } from "lucide-react";

const ReportsActivityLogs = () => {
  const activityLogs = [
    { id: 1, action: "Case C-2025-001 submitted by Omar", time: "2025-11-01 09:45 AM" },
    { id: 2, action: "Appeal added for Case C-2025-002", time: "2025-11-03 01:20 PM" },
    { id: 3, action: "Reminder updated by Fatima", time: "2025-11-05 02:15 PM" },
    { id: 4, action: "Hearing scheduled for Case C-2025-003", time: "2025-11-06 10:00 AM" },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-[#BCB083] border border-[#fe9a00]/20 mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#A48C65] p-2 rounded-lg">
          <Activity className="text-white w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[#494C52]">
          Recent Activity Logs
        </h2>
      </div>

      {/* Desktop & Tablet View */}
      <ul className="hidden sm:block space-y-4">
        {activityLogs.map((log) => (
          <li
            key={log.id}
            className="flex justify-between  items-center bg-[#A48C65] p-4 rounded-xl border border-white/10 transition-all duration-300 hover:text-white"
          >
            <span className="text-white font-medium ">{log.action}</span>
            <span className="text-white text-sm font-semibold bg-[#BCB083] px-3 py-1 rounded-full">
              {log.time}
            </span>
          </li>
        ))}
      </ul>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {activityLogs.map((log) => (
          <div
            key={log.id}
            className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition-all duration-300"
          >
            <p className="text-white font-medium mb-2 text-sm">
              {log.action}
            </p>
            <p className="text-[#BCB083] text-xs font-semibold bg-white/5 px-3 py-1 rounded-full inline-block">
              {log.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsActivityLogs;