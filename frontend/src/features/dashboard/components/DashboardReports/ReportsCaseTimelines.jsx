import React from "react";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";

const ReportsCaseTimelines = () => {
  const { t } = useTranslation("reportsCaseTimelines");
  const isRTL = i18n.language === "ar";

  const caseTimelines = [
    {
      caseNo: "C-2025-001",
      stage: t("mainCase"),
      start: "2025-10-10",
      end: "2025-11-05",
      duration: "26",
    },
    {
      caseNo: "C-2025-002",
      stage: t("appeal"),
      start: "2025-09-25",
      end: "2025-10-20",
      duration: "25",
    },
    {
      caseNo: "C-2025-003",
      stage: t("cassation"),
      start: "2025-10-15",
      end: "2025-11-01",
      duration: "17",
    },
  ];

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-lg border border-[#f4f6f8] mt-8
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      {/* Header */}
      <div className={`flex items-center gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <CalendarDays className="text-[#0B1F3B]" />
        <h2 className="text-lg font-semibold text-[#0B1F3B]">
          {t("title")}
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-[#494C52]">
          <thead className="bg-[#0B1F3B] text-white uppercase text-xs">
            <tr className={isRTL ? "text-right" : "text-left"}>
              <th className="px-4 py-3">{t("caseNo")}</th>
              <th className="px-4 py-3">{t("stage")}</th>
              <th className="px-4 py-3">{t("startDate")}</th>
              <th className="px-4 py-3">{t("endDate")}</th>
              <th className="px-4 py-3">{t("duration")}</th>
            </tr>
          </thead>
          <tbody>
            {caseTimelines.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#f4f6f8] hover:bg-[#f4f6f8] transition"
              >
                <td className="px-4 py-3 font-medium">{item.caseNo}</td>
                <td className="px-4 py-3">{item.stage}</td>
                <td className="px-4 py-3">{item.start}</td>
                <td className="px-4 py-3">{item.end}</td>
                <td className="px-4 py-3 text-[#0B1F3B] font-semibold">
                  {item.duration} {isRTL ? "يوم" : "days"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 lg:hidden">
        {caseTimelines.map((item, index) => (
          <div
            key={index}
            className={`relative bg-white p-4 rounded-2xl border border-gray-200
              shadow-md hover:shadow-lg transition-all duration-300
              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            {/* Duration badge */}
            <div className={`absolute top-3 ${isRTL ? "left-3" : "right-3"}`}>
              <span className="text-[#A48C65] font-semibold text-xs sm:text-sm bg-[#fff7e6] px-3 py-1 rounded-full border border-[#fe9a00]/30">
                {item.duration} {isRTL ? "يوم" : "days"}
              </span>
            </div>

            <h3 className="font-semibold text-[#494C52] text-lg mb-2 truncate">
              {item.caseNo}
            </h3>

            <div className="flex flex-col gap-1 text-sm text-gray-700">
              <p>
                <span className="font-medium text-[#494C52]">{t("stage")}:</span>{" "}
                {item.stage}
              </p>
              <p>
                <span className="font-medium text-[#494C52]">{t("start")}:</span>{" "}
                {item.start}
              </p>
              <p>
                <span className="font-medium text-[#494C52]">{t("end")}:</span>{" "}
                {item.end}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsCaseTimelines;
