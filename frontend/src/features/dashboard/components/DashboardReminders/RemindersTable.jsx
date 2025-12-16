import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const RemindersTable = ({ reminders, onAction, page, totalPages, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) setSidebarOpen(sidebar.classList.contains("w-64"));
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  if (!reminders || reminders.length === 0)
    return <p className="text-center mt-6">No reminders found.</p>;

  const renderStatus = (reminder) => (reminder.isCompleted ? "Completed" : "Pending");
  const renderStatusClass = (reminder) =>
    reminder.isCompleted
      ? "bg-[#A48C65] text-white border border-[#A48C65]/30"
      : "bg-yellow-500/20 text-yellow-800 border border-yellow-500/30";

  return (
    <div
      className={`bg-white w-[320px] text-[#24344f] shadow-2xl rounded-2xl border border-[#fe9a00]/20 overflow-hidden transition-all duration-300 ${sidebarOpen ? "lg:w-[980px] md:w-[420px]" : "lg:w-full md:w-[640px]"
        }`}
    >
      {/* ===== Desktop View ===== */}
      <div className="block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm min-w-[700px] border-collapse">
            <thead className="bg-[#A48C65] text-white  uppercase tracking-wide text-xs font-semibold">
              <tr className="whitespace-nowrap">
                {["Case Name", "Stage", "Type", "Lawyer", "Date", "Status", "Actions"].map(
                  (h, i) => (
                    <th key={i} className="py-2 px-4 text-left whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {reminders.map((r, idx) => (
                <tr
                  key={r._id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                    } hover:bg-[#E1E1E2] transition-all border-t border-[#fe9a00]/10 whitespace-nowrap`}
                >
                  <td className="px-4 py-1">{r.caseName}</td>
                  <td className="px-4 py-1">{r.stage}</td>
                  <td className="px-4 py-1">{r.type}</td>
                  <td className="px-4 py-1">{r.lawyer || "-"}</td>
                  <td className="px-4 py-1">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-1 text-left">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${renderStatusClass(
                        r
                      )}`}
                    >
                      {renderStatus(r)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    <div className="flex justify-left gap-2 flex-nowrap">
                      <button
                        onClick={() => onAction("View", r)}
                        className="flex  items-center gap-1 bg-white border border-[#A48C65] text-gray-800 hover:bg-[#A48C65] hover:text-white duration-200 px-3 py-1 rounded-full text-xs font-medium transition-all"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => onAction("Resend", r)}
                        className="bg-white border border-[#A48C65] text-gray-800 hover:bg-[#A48C65] hover:text-white transition-all duration-200 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        Resend
                      </button>
                      {!r.isCompleted && (
                        <button
                          onClick={() => onAction("Mark Complete", r)}
                          className="text-white bg-[#A48C65] px-3 py-1 rounded-full text-xs font-medium transition-all"
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-3 px-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`px-3 py-1 rounded-lg border ${page === p ? "bg-[#fe9a00] text-white" : "bg-white text-[#24344f]"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersTable;
