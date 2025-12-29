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
} from "recharts";
import { useGetDashboardStatsQuery } from "../../api/lawyerApi";
import { useTranslation } from "react-i18next";

const COLORS = ["#1e293b", "#475569", "#64748b", "#94a3b8"];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  const { t } = useTranslation("lawyeroverview");
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded-md shadow-md">
        <p className="text-white font-medium text-xs">{label || payload[0].name}</p>
        <p className="text-slate-200 text-xs">
          {t("overviewCharts.count")}:
          <span className="text-white font-semibold ml-1">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Pie Chart Card
export const PieChartCard = ({ title, data, loading, isRTL }) => {
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation("lawyeroverview");

  useEffect(() => setAnimate(true), []);

  if (loading)
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800"></div>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex flex-col items-center justify-center">
        <h2 className="text-sm font-semibold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 text-xs">{t("overviewCharts.noData")}</p>
      </div>
    );

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg border-2 border-white hover:border-[#A48D66] hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group ${isRTL ? "text-right" : "text-left"}`}>
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
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar Chart Card
export const BarChartCard = ({ title, data, loading, isRTL }) => {
  const { t } = useTranslation("lawyeroverview");

  if (loading)
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800"></div>
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-60 flex flex-col items-center justify-center">
        <h2 className="text-sm font-semibold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500 text-xs">{t("overviewCharts.noData")}</p>
      </div>
    );

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all group duration-500 border-2 border-white hover:border-[#A48D66] hover:-translate-y-2 ${isRTL ? "text-right" : "text-left"}`}>
      <h2 className="text-2xl font-semibold text-slate-700 transition-all duration-500 group-hover:text-[#A48D66] mb-3">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="status"
            stroke="#64748b"
            fontSize={10}
            angle={isRTL ? 20 : -20}
            textAnchor={isRTL ? "start" : "end"}
            height={40}
            interval={0}
          />
          <YAxis stroke="#64748b" fontSize={10} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#1e293b" radius={[3, 3, 0, 0]} barSize={35} animationDuration={1000} animationEasing="ease-in-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main OverviewCharts
const OverviewCharts = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();
  const { t, i18n } = useTranslation("lawyeroverview");
  const isRTL = i18n.dir() === "rtl";

  const prepareChartData = () => {
    if (!data?.data) return { pieData: [], barData: [] };
    const stats = data.data;

    const pieData = [
      { name: t("overviewCharts.underReview"), value: stats.underReview || 0 },
      { name: t("overviewCharts.pendingApproval"), value: stats.pendingApproval || 0 },
      { name: t("overviewCharts.approved"), value: stats.approved || 0 },
    ].filter((item) => item.value > 0);

    const barData = [
      { status: t("overviewCharts.underReview"), count: stats.underReview || 0 },
      { status: t("overviewCharts.pendingApproval"), count: stats.pendingApproval || 0 },
      { status: t("overviewCharts.pendingMyApproval"), count: stats.pendingMyApproval || 0 },
      { status: t("overviewCharts.approved"), count: stats.approved || 0 },
    ];

    return { pieData, barData };
  };

  const { pieData, barData } = prepareChartData();

  if (isError)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        {[1, 2].map((_, idx) => (
          <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-center h-60">
            <div className="text-center">
              <p className="text-red-600 font-medium text-xs mb-1">{t("overviewCharts.error")}</p>
              <p className="text-red-500 text-xs">{t("overviewCharts.tryRefresh")}</p>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-10">
      <PieChartCard title={t("overviewCharts.casesByStatus")} data={pieData} loading={isLoading} isRTL={isRTL} />
      <BarChartCard title={t("overviewCharts.casesDistribution")} data={barData} loading={isLoading} isRTL={isRTL} />
    </div>
  );
};

export default OverviewCharts;
