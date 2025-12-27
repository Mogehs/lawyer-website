import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";

const CasesTable = ({ cases, onView, onDelete, sidebarOpen }) => {
  const { t } = useTranslation("casesTable");
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`bg-white max-w-4xl text-[#24344f] shadow-2xl rounded-t-xl
        border border-[#0B1F3B]/20 overflow-hidden
        transition-all duration-300
        ${sidebarOpen ? "lg:w-[980px] md:w-[440px]" : "lg:w-full md:w-[640px]"}
      `}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Desktop Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm min-w-[700px] border-collapse">
          {/* Header */}
          <thead className="bg-[#0B1F3B] text-white uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">{t("caseNumber")}</th>
              <th className="px-6 py-4 text-left">{t("client")}</th>
              <th className="px-6 py-4 text-left">{t("lawyer")}</th>
              <th className="px-6 py-4 text-left">{t("stage")}</th>
              <th className="px-6 py-4 text-left">{t("status")}</th>
              <th className="px-6 py-4 text-left">{t("lastUpdated")}</th>
              <th className="px-6 py-4 text-center">{t("actions")}</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {cases.map((c) => (
              <tr
                key={c._id}
                className="group border-t border-[#0B1F3B]/30 whitespace-nowrap
                  transition-all duration-300
                  hover:bg-[#0B1F3B]/5 hover:shadow-sm"
              >
                <td className="px-6 py-4 font-mono font-medium">{c.caseNumber}</td>
                <td className="px-6 py-4 font-medium">{c.clientName}</td>
                <td className="px-6 py-4">{c.lawyer}</td>
                <td className="px-6 py-4 text-[#24344f]/80">{c.stage}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full
                      text-xs font-medium border transition-all duration-300
                      ${
                        c.status === "Submitted"
                          ? "bg-green-500/20 text-green-800 border-green-600/40"
                          : c.status === "Awaiting Approval"
                          ? "bg-yellow-500/20 text-yellow-800 border-yellow-600/40"
                          : "bg-gray-100 text-gray-700 border-gray-400/40"
                      }
                      group-hover:scale-105
                    `}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#24344f]/70">{c.lastUpdated}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(c)}
                      className="group flex items-center gap-2
                        text-[#0B1F3B] border border-[#0B1F3B]/40
                        px-3 py-1.5 rounded-full text-xs font-medium
                        transition-all duration-300
                        hover:bg-[#0B1F3B] hover:text-white hover:shadow-md"
                    >
                      <Eye className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      {t("view")}
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className="group flex items-center gap-2
                        text-[#0B1F3B] border border-[#0B1F3B]/40
                        px-3 py-1.5 rounded-full text-xs font-medium
                        transition-all duration-300
                        hover:bg-[#0B1F3B] hover:text-white hover:shadow-md"
                    >
                      <Trash2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-6" />
                      {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Accent */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#0B1F3B] to-[#0B1F3B]" />
    </div>
  );
};

export default CasesTable;
