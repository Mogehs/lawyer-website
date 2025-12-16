import React, { useEffect, useState, Fragment } from "react";
import { Eye, Trash2, ChevronRight, FileText } from "lucide-react";

const ArchiveTable = ({ cases, onView, onDelete }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
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

  const TableRow = ({ c, idx }) => (
    <tr
      className={`transition-all duration-200 hover:bg-slate-50 ${
        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
      }`}
    >
      <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
        {c.id}
      </td>
      <td className="p-4 text-slate-800 whitespace-nowrap">{c.client}</td>
      <td className="p-4 text-slate-800 whitespace-nowrap">{c.clientNumber}</td>
      <td className="p-4 font-medium text-slate-800 whitespace-nowrap">
        {c.caseNumber}
      </td>
      <td className="p-4 whitespace-nowrap">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold whitespace-nowrap">
          {c.caseType}
        </span>
      </td>
      <td className="p-4 text-slate-800 whitespace-nowrap">{c.lawyer}</td>
      <td className="p-4 text-slate-600 whitespace-nowrap">{c.date}</td>
      <td className="p-4">
        <div className="space-y-1">
          {c.stages.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-slate-700 whitespace-nowrap"
            >
              <ChevronRight size={14} className="text-slate-500" />
              <span>{s.stage}</span>
              <span className="text-slate-500 text-xs">
                ({s.documents.length} doc{s.documents.length > 1 ? "s" : ""})
              </span>
            </div>
          ))}
        </div>
      </td>
      <td className="p-4 text-right flex justify-end mt-4 gap-2">
        <button
          className="inline-flex items-center justify-center w-8 h-8 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors duration-200 shadow-sm"
          onClick={() => onView(c)}
        >
          <Eye size={14} />
        </button>
        <button
          className="inline-flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 shadow-sm"
          onClick={() => onDelete(c)}
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );

  if (!cases.length)
    return (
      <div className="bg-white rounded shadow-sm border border-slate-200 p-8 text-center mt-4">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          No Archived Cases
        </h3>
        <p className="text-[10px] text-slate-500">
          Completed cases will appear here once archived.
        </p>
      </div>
    );

  return (
    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 text-white hidden md:table-header-group">
            <tr>
              {[
                { label: "ID", class: "" },
                { label: "Case #", class: "" },
                { label: "Client", class: "" },
                { label: "Phone", class: "hidden lg:table-cell" },
                { label: "Email", class: "hidden xl:table-cell" },
                { label: "Type", class: "" },
                { label: "Lawyer", class: "hidden lg:table-cell" },
                { label: "Date", class: "hidden lg:table-cell" },
                { label: "Stages", class: "hidden xl:table-cell" },
                { label: "Actions", class: "text-right" },
              ].map((h) => (
                <th
                  key={h.label}
                  className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wide ${h.class}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cases.map((c, idx) => (
              <React.Fragment key={c._id || c.id}>
                {/* Desktop Row */}
                <tr className="hidden md:table-row hover:bg-slate-50 transition">
                  <td className="px-3 py-2 text-[10px] font-medium text-slate-600">
                    {c._id?.slice(-6) || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-xs font-semibold text-slate-800">
                    {c.caseNumber || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-800">
                    {c.clientId?.name || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-700 hidden lg:table-cell">
                    {c.clientId?.contactNumber || "N/A"}
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-700 hidden xl:table-cell truncate max-w-[150px]">
                    {c.clientId?.email || "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-medium">
                      {c.caseType || "N/A"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-700 hidden lg:table-cell">
                    {c.assignedLawyer?.name || "Unassigned"}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-600 hidden lg:table-cell">
                    {c.archivedAt
                      ? new Date(c.archivedAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2 hidden xl:table-cell">
                    <div className="space-y-0.5">
                      {c.stages && c.stages.length > 0 ? (
                        c.stages.slice(0, 2).map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1 text-[10px] text-slate-700"
                          >
                            <ChevronRight
                              size={10}
                              className="text-slate-500"
                            />
                            <span className="truncate max-w-[100px]">
                              {s.stage}
                            </span>
                            <span className="text-slate-500">
                              ({s.documents?.length || 0})
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 text-[10px]">-</span>
                      )}
                      {c.stages?.length > 2 && (
                        <span className="text-[10px] text-slate-500">
                          +{c.stages.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        onClick={() => onView(c)}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={() => onDelete(c)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Mobile Card */}
                <tr className="md:hidden">
                  <td colSpan="10" className="p-0">
                    <div className="p-3 border-b border-slate-200 hover:bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-xs font-semibold text-slate-800">
                            {c.caseNumber || "N/A"}
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {c.clientId?.name || "N/A"}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            onClick={() => onView(c)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            onClick={() => onDelete(c)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Type:</span>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
                            {c.caseType || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phone:</span>
                          <span className="text-slate-700 font-medium">
                            {c.clientId?.contactNumber || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Lawyer:</span>
                          <span className="text-slate-700">
                            {c.assignedLawyer?.name || "Unassigned"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Archived:</span>
                          <span className="text-slate-700">
                            {c.archivedAt
                              ? new Date(c.archivedAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        {c.stages && c.stages.length > 0 && (
                          <div className="pt-1 border-t border-slate-200 mt-1">
                            <span className="text-slate-500">
                              Stages: {c.stages.length}
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
};

export default ArchiveTable;
