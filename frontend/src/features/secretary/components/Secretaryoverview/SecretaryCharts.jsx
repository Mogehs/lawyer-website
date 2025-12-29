import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";

export default function SecretaryCharts({ caseTypeData, pendingDocsData }) {
  const { t, i18n } = useTranslation("secretaryDashboard");
  const isRTL = i18n.dir() === "rtl";

  const pieColors = ["#0B1F3B", "#0B1F3B", "#A48C65"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <h3 className="text-lg font-semibold text-[#0B1F3B] mb-3">
          {t("casesByType", "Cases by Type")}
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={caseTypeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              innerRadius={30}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
              isAnimationActive={false}
              startAngle={isRTL ? 180 : 0}
              endAngle={isRTL ? -180 : 360}
            >
              {caseTypeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          {t("pendingDocuments", "Pending Documents")}
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={pendingDocsData}
            margin={{ top: 10, right: 10, left: 5, bottom: 40 }}
            layout="vertical"
            reverseStackOrder={isRTL}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#0B1F3B"
              vertical={false}
            />
            <XAxis
              type="number"
              fontSize={10}
              stroke="#0B1F3B"
              reversed={isRTL}
            />
            <YAxis
              dataKey="status"
              type="category"
              fontSize={10}
              width={80}
              stroke="#0B1F3B"
              mirror={isRTL}
              textAnchor={isRTL ? "start" : "end"}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #0B1F3B",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            />
            <Bar
              dataKey="count"
              fill="#0B1F3B"
              radius={[3, 3, 0, 0]}
              barSize={25}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
