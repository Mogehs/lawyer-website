import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReportsCaseCharts = () => {
  const { t } = useTranslation("reportsCaseCharts");
  const isRTL = i18n.language === "ar";

  const caseStageData = [
    { name: t("mainCase"), value: 60 },
    { name: t("appeal"), value: 30 },
    { name: t("cassation"), value: 10 },
  ];

  const lawyerPerformance = [
    { lawyer: "Omar", cases: 15 },
    { lawyer: "Fatima", cases: 12 },
    { lawyer: "Ali", cases: 10 },
    { lawyer: "Sara", cases: 8 },
  ];

  const COLORS = ["#0B1F3B", "#494C52", "#A4A4A4"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Case Distribution by Stage */}
      <div
        className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#0B1F3B]">
          {t("caseDistribution")}
        </h2>

        <div className="h-56 sm:h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={caseStageData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                dataKey="value"
                labelLine={false}
              >
                {caseStageData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lawyer Performance */}
      <div
        className={`bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#0B1F3B]">
          {t("lawyerPerformance")}
        </h2>

        <div className="h-56 sm:h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={lawyerPerformance}
              margin={{
                top: 10,
                right: isRTL ? 0 : 10,
                left: isRTL ? 10 : 0,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="lawyer"
                tick={{ fontSize: 12 }}
                reversed={isRTL}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                orientation={isRTL ? "right" : "left"}
              />
              <Tooltip />
              <Bar
                dataKey="cases"
                name={t("cases")}
                fill="#0B1F3B"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsCaseCharts;
