import React from "react";
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
  const caseStageData = [
    { name: "Main Case", value: 60 },
    { name: "Appeal", value: 30 },
    { name: "Cassation", value: 10 },
  ];

  const lawyerPerformance = [
    { lawyer: "Omar", cases: 15 },
    { lawyer: "Fatima", cases: 12 },
    { lawyer: "Ali", cases: 10 },
    { lawyer: "Sara", cases: 8 },
  ];

  const COLORS = ["#A48C65", "#494C52", "#BCB083"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Case Distribution by Stage */}
      <div className="bg-white shadow-[#BCB083] p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#494C52]">
          Case Distribution by Stage
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
                {caseStageData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lawyer Performance */}
      <div className="bg-white shadow-[#BCB083] p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-[#494C52]">
          Lawyer Performance
        </h2>
        <div className="h-56 sm:h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lawyerPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="lawyer" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cases" fill="#A48C65" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsCaseCharts;
