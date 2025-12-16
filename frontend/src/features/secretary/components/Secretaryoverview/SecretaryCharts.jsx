// src/components/dashboard/Charts.jsx
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

export default function SecretaryCharts({ caseTypeData, pendingDocsData }) {
  const pieColors = ["#A48C65", "#475569", "#94a3b8"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
      {/* Pie Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">
          Cases by Type
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
          Pending Documents
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={pendingDocsData}
            margin={{ top: 10, right: 10, left: 5, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#BCB083"
              vertical={false}
            />
            <XAxis
              dataKey="status"
              fontSize={10}
              angle={-30}
              textAnchor="end"
              height={10}
              stroke="#A48C65"
            />
            <YAxis fontSize={10} width={30} stroke="#A48C65"/>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #BCB083",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            />
            <Bar
              dataKey="count"
              fill="#A48C65"
              radius={[3, 3, 0, 0]}
              barSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
