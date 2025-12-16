import React, { useEffect, useState, useMemo } from "react";
import { FiClock, FiChevronRight, FiTrash2, FiSearch } from "react-icons/fi";
import StatusPill from "./StatusPill"; // assuming you have this component

export default function CasesTable({ cases, onOpen, onDelete }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ▌ Map backend data to table-friendly format
  const mappedCases = cases.map((c) => ({
    ...c, // Keep all original data
    id: c._id || c.id,
    _id: c._id || c.id,
    caseNumber: c.caseNumber,
    clientName: c.clientId?.name || "—",
    clientEmail: c.clientId?.email || "—",
    clientPhone: c.clientId?.contactNumber || "—",
    caseType: c.caseType,
    assignedStage: c.currentStage,
    currentStage: c.currentStage,
    status: c.status,
    hearing: c.stages?.[c.currentStage]?.hearingDate
      ? { nextHearing: c.stages[c.currentStage].hearingDate }
      : null,
    stages: c.stages || [],
    notes: c.notes || [],
  }));

  // ▌ Get dynamic statuses
  const statuses = useMemo(
    () => ["all", ...Array.from(new Set(mappedCases.map((c) => c.status)))],
    [mappedCases]
  );

  // ▌ FILTERED DATA LOGIC
  const filteredCases = useMemo(
    () =>
      mappedCases.filter((c) => {
        const matchSearch =
          c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
          c.clientName.toLowerCase().includes(search.toLowerCase()) ||
          c.clientEmail.toLowerCase().includes(search.toLowerCase()) ||
          c.clientPhone.toLowerCase().includes(search.toLowerCase());

        const matchStatus = filterStatus === "all" || c.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [mappedCases, search, filterStatus]
  );

  // ✅ Sync with sidebar state
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setSidebarOpen(desktop);
    };

    const handleSidebarToggle = () => {
      // Listen for sidebar state changes from the sidebar component
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        const isOpen = sidebar.classList.contains("w-64");
        setSidebarOpen(isOpen);
      }
    };

    window.addEventListener("resize", handleResize);

    // Check sidebar state periodically (you can use a better state management approach)
    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  // ▌ DATE FORMATTER
  const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

  const threeDaysBefore = (iso) => {
    if (!iso) return false;
    const diff = new Date(iso) - new Date();
    return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  };

  if (!cases.length)
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FiChevronRight className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          No Cases Assigned
        </h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Your assigned cases will appear here once available.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden transition-all duration-500 mt-8">
      {/* Filter */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
        <span className="text-[22px] text-[#A48D66] font-medium">
          {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""}
        </span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-2 py-1 border border-slate-300 rounded text-[18px] focus:ring-1 focus:ring-slate-600"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border border-[#A48D66] rounded-lg md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-[#A48D66] text-white hidden md:table-header-group">
            <tr>
              {[
                { label: "Case #", class: "" },
                { label: "Client", class: "" },
                { label: "Email", class: "hidden lg:table-cell" },
                { label: "Phone", class: "hidden xl:table-cell" },
                { label: "Type", class: "" },
                { label: "Stage", class: "hidden lg:table-cell" },
                { label: "Hearing", class: "hidden xl:table-cell" },
                { label: "Status", class: "" },
                { label: "Actions", class: "text-right" },
              ].map((h) => (
                <th
                  key={h.label}
                  className={`px-4 py-3 text-[16px] font-semibold uppercase ${h.class}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredCases.map((c, idx) => (
              <React.Fragment key={c.id}>
                {/* Desktop Row */}
                <tr className="hidden md:table-row transition-all duration-300">
                  <td className="px-4 py-3 text-[16px] font-semibold text-slate-800 transition-all duration-300  ">
                    {c.caseNumber}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-slate-800 transition-all duration-300 ">
                    {c.clientName}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-slate-700 transition-all duration-300 hidden lg:table-cell truncate max-w-[150px] ">
                    {c.clientEmail}
                  </td>
                  <td className="px-4 py-3 text-[16px] text-slate-700 transition-all duration-300 hidden xl:table-cell ">
                    {c.clientPhone}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-4 py-1.5 bg-blue-50 text-[#A48C65] transition-all duration-300 border border-blue-200 rounded-full text-[14px] font-medium ">
                      {c.caseType}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <StatusPill status={c.assignedStage} />
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    {c.hearing?.nextHearing ? (
                      <div className="flex flex-col text-[10px]">
                        <span className="text-[#A48D66]">
                          {formatDate(c.hearing.nextHearing)}
                        </span>
                        {threeDaysBefore(c.hearing.nextHearing) && (
                          <span className="text-orange-600 flex items-center gap-0.5">
                            <FiClock size={10} /> Alert
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500  transition-all duration-300">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 ">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onOpen(c)}
                        className="p-1 text-slate-600 group-hover:text-white transition duration-300 hover:text-[#A48C65] hover:bg-blue-50 rounded"
                        title="Open"
                      >
                        <FiChevronRight size={20} />
                      </button>
                      <button
                        onClick={() => onDelete(c)}
                        className="p-1 text-slate-600 group-hover:text-white transition duration-300 hover:text-[#A48C65] hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Mobile Card */}
                <tr className="md:hidden">
                  <td colSpan="9" className="p-0">
                    <div className="p-3 border-b border-slate-200 hover:bg-[#A48D66] transition-all duration-400 group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-md font-semibold text-slate-800 group-hover:text-white transition-all duration-400">
                            {c.caseNumber}
                          </h3>
                          <p className="text-[14px] text-slate-500 mt-0.5 group-hover:text-white transition-all duration-400">
                            {c.clientName}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onOpen(c)}
                            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded group-hover:text-white transition"
                          >
                            <FiChevronRight size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(c)}
                            className="p-1 text-slate-600 group-hover:text-[#A48C65]  hover:bg-[#A48C65] rounded transition"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-[14px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500 transition-all duration-400 group-hover:text-white ">Type:</span>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
                            {c.caseType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 transition-all duration-400 group-hover:text-white">Stage:</span>
                          <StatusPill status={c.assignedStage} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 transition-all duration-400 group-hover:text-white">Status:</span>
                          <StatusPill status={c.status} />
                        </div>
                        {c.hearing?.nextHearing && (
                          <div className="flex justify-between pt-1 border-t border-slate-200 mt-1">
                            <span className="text-slate-500 transition-all duration-400 group-hover:text-white">Hearing:</span>
                            <span className="text-slate-700">
                              {formatDate(c.hearing.nextHearing)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
     
  );
}
