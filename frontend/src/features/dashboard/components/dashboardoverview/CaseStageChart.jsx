import { useGetAllCasesQuery } from "../../api/directorApi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";

const CaseStageChart = () => {
  const { data, isLoading, isError } = useGetAllCasesQuery();
  const cases = data?.data || [];

  // Compute case distribution by status
  const statusColors = {
    Draft: "#A48C65",
    "In Progress": "#fe9a00",
    Completed: "#22c55e",
    Closed: "#6b7280",
  };

  const caseDistributionMap = cases.reduce((acc, c) => {
    const status = c.status || "Other";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const caseDistribution = Object.entries(caseDistributionMap).map(
    ([name, value]) => ({
      name,
      value,
      color: statusColors[name] || "#A48C65",
    })
  );

  // Compute lawyer performance
  const lawyerMap = cases.reduce((acc, c) => {
    const lawyer = c.assignedLawyer?.name || "Unassigned";
    acc[lawyer] = (acc[lawyer] || 0) + 1;
    return acc;
  }, {});

  const lawyerPerformance = Object.entries(lawyerMap).map(
    ([name, cases]) => ({ name, cases })
  );

  if (isLoading) return <p>Loading charts...</p>;
  if (isError) return <p>Error loading charts</p>;

  return (
    <div className="bg-white mt-10 p-5 sm:p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-[#494C52]">
          Managing Director Overview
        </h2>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6">
        {/* Left - Donut Chart */}
        <div className="bg-[#f9fafb] p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-base sm:text-lg font-semibold text-[#494C52] mb-4">
            Case Distribution
          </h3>
          <div className="w-full h-[250px] sm:h-[280px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={caseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {caseDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#A48C65",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-y-2 sm:gap-y-3 w-full">
            {caseDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs sm:text-sm text-[#1c283c] truncate">
                  {item.name} – <b>{item.value}</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Lawyer Performance */}
        <div className="bg-[#f9fafb] p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-[#494C52] mb-6">
            Lawyers Performance
          </h3>
          <div className="space-y-4 sm:space-y-5">
            {lawyerPerformance.map((lawyer, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs sm:text-sm mb-1">
                  <span className="font-medium text-[#1c283c]">{lawyer.name}</span>
                  <span className="text-gray-600">
                    <CountUp end={lawyer.cases} duration={1.5} /> Cases
                  </span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#decf9c] to-[#A48C65] rounded-full transition-all duration-1000"
                    style={{
                      width: `${(lawyer.cases / Math.max(...lawyerPerformance.map(l => l.cases))) * 100}%`,
                     
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStageChart;
