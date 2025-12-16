import { useState, useEffect } from "react";
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
   Legend,
} from "recharts";
import { useGetDashboardStatsQuery } from "../../api/lawyerApi";

const COLORS = ["#1e293b", "#475569", "#64748b", "#94a3b8"];

const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
      return (
         <div className="bg-slate-800 border border-slate-700 p-2 rounded-md shadow-md">
            <p className="text-white font-medium text-xs">
               {label || payload[0].name}
            </p>
            <p className="text-slate-200 text-xs">
               {payload[0].dataKey === "count" ? "Count: " : "Value: "}
               <span className="text-white font-semibold ml-1">
                  {payload[0].value}
               </span>
            </p>
         </div>
      );
   }
   return null;
};

export const PieChartCard = ({ title, data, loading }) => {
   const [animate, setAnimate] = useState(false);

   useEffect(() => {
      setAnimate(true);
   }, []);

   if (loading) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800"></div>
         </div>
      );
   }

   if (!data || data.length === 0) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
               {title}
            </h2>
            <p className="text-slate-500 text-xs">No data available</p>
         </div>
      );
   }
   // ===============
   // Cases by Status
   // ===============

   return (
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-white hover:border-[#A48D66] hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
         <h2 className="text-2xl font-semibold text-slate-700 group-hover:text-[#A48D66] transition-all duration-500 mb-6">
            {title}
         </h2>
         <ResponsiveContainer width="100%" height={200}>
            <PieChart>
               <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                     `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
               >
                  {data.map((entry, index) => (
                     <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                     />
                  ))}
               </Pie>
               <Tooltip content={<CustomTooltip />} />
            </PieChart>
         </ResponsiveContainer>
      </div>
   );
};

export const BarChartCard = ({ title, data, loading }) => {
   if (loading) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800"></div>
         </div>
      );
   }

   if (!data || data.length === 0) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex flex-col items-center justify-center">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
               {title}
            </h2>
            <p className="text-slate-500 text-xs">No data available</p>
         </div>
      );
   }

   // ==================
   // Cases Distribution
   // ==================
   return (
      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all group duration-500 border-2 border-white hover:border-[#A48D66] hover:-translate-y-2">
         <h2 className="text-2xl font-semibold text-slate-700 transition-all duration-500 group-hover:text-[#A48D66] mb-3">
            {title}
         </h2>
         <ResponsiveContainer width="100%" height={200}>
            <BarChart
               data={data}
               margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
            >
               <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
               />
               <XAxis
                  dataKey="status"
                  stroke="#64748b"
                  fontSize={10}
                  angle={-20}
                  textAnchor="end"
                  height={40}
                  interval={0}
               />
               <YAxis stroke="#64748b" fontSize={10} width={30} />
               <Tooltip content={<CustomTooltip />} />
               <Bar
                  dataKey="count"
                  fill="#1e293b"
                  radius={[3, 3, 0, 0]}
                  barSize={35}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
               />
            </BarChart>
         </ResponsiveContainer>
      </div>
   );
};

const OverviewCharts = () => {
   const { data, isLoading, isError } = useGetDashboardStatsQuery();

   // Prepare chart data from API response
   const prepareChartData = () => {
      if (!data?.data) return { pieData: [], barData: [] };

      const stats = data.data;

      // Pie chart data - Cases by stage (we'll use case status for now)
      const pieData = [
         { name: "Under Review", value: stats.underReview || 0 },
         { name: "Pending Approval", value: stats.pendingApproval || 0 },
         { name: "Approved", value: stats.approved || 0 },
      ].filter((item) => item.value > 0); // Only show non-zero values

      // Bar chart data - Cases by status
      const barData = [
         { status: "Under Review", count: stats.underReview || 0 },
         { status: "Pending Approval", count: stats.pendingApproval || 0 },
         {
            status: "Awaiting My Approval",
            count: stats.pendingMyApproval || 0,
         },
         { status: "Approved", count: stats.approved || 0 },
      ];

      return { pieData, barData };
   };

   const { pieData, barData } = prepareChartData();

   if (isError) {
      return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-center h-60">
               <div className="text-center">
                  <p className="text-red-600 font-medium text-xs mb-1">
                     Failed to load chart data
                  </p>
                  <p className="text-red-500 text-xs">
                     Please try refreshing the page
                  </p>
               </div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-center h-60">
               <div className="text-center">
                  <p className="text-red-600 font-medium text-xs mb-1">
                     Failed to load chart data
                  </p>
                  <p className="text-red-500 text-xs">
                     Please try refreshing the page
                  </p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-10">
         <PieChartCard
            title="Cases by Status"
            data={pieData}
            loading={isLoading}
         />
         <BarChartCard
            title="Cases Distribution"
            data={barData}
            loading={isLoading}
         />
      </div>
   );
};

export default OverviewCharts;
