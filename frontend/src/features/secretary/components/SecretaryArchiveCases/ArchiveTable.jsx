import React, { useEffect, useState } from "react";
import { Eye, Trash2, ChevronRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

const ArchiveTable = ({ cases, onView, onDelete }) => {
  const { t, i18n } = useTranslation("ArchiveTable");
  const isRTL = i18n.language === "ar";

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        const isOpen = sidebar.classList.contains("w-64");
        setSidebarOpen(isOpen);
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  if (!cases.length) {
    return (
      <div className="bg-white rounded shadow-sm border border-slate-200 p-8 text-center mt-4">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          {t("archiveTable.noCasesTitle")}
        </h3>
        <p className="text-[10px] text-slate-500">
          {t("archiveTable.noCasesDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded shadow-sm border border-slate-200 overflow-hidden mt-4 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 text-white hidden md:table-header-group">
            <tr>
              {[
                "id",
                "caseNumber",
                "client",
                "phone",
                "email",
                "type",
                "lawyer",
                "date",
                "stages",
                "actions",
              ].map((key) => (
                <th
                  key={key}
                  className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide"
                >
                  {t(`archiveTable.${key}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cases.map((c) => (
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
                    {c.assignedLawyer?.name || t("archiveTable.unassigned")}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-600 hidden lg:table-cell">
                    {c.archivedAt ? new Date(c.archivedAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-3 py-2 hidden xl:table-cell">
                    <div className="space-y-0.5">
                      {c.stages && c.stages.length > 0 ? (
                        c.stages.slice(0, 2).map((s, i) => (
                          <div key={i} className="flex items-center gap-1 text-[10px] text-slate-700">
                            <ChevronRight size={10} className="text-slate-500" />
                            <span className="truncate max-w-[100px]">{s.stage}</span>
                            <span className="text-slate-500">({s.documents?.length || 0})</span>
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
                        title={t("archiveTable.viewButton")}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        onClick={() => onDelete(c)}
                        title={t("archiveTable.deleteButton")}
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
                          <span className="text-slate-500">{t("archiveTable.type")}:</span>
                          <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded font-medium">
                            {c.caseType || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t("archiveTable.phone")}:</span>
                          <span className="text-slate-700 font-medium">
                            {c.clientId?.contactNumber || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t("archiveTable.lawyer")}:</span>
                          <span className="text-slate-700">
                            {c.assignedLawyer?.name || t("archiveTable.unassigned")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t("archiveTable.archived")}:</span>
                          <span className="text-slate-700">
                            {c.archivedAt ? new Date(c.archivedAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        {c.stages && c.stages.length > 0 && (
                          <div className="pt-1 border-t border-slate-200 mt-1">
                            <span className="text-slate-500">
                              {t("archiveTable.stages")}: {c.stages.length}
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
