// src/components/dashboardoverview/StatsCard.jsx
import {
  Users,
  FileText,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useUserStatsQuery } from "../../api/directorApi";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";

const StatsCard = () => {
  const { t } = useTranslation("statsCard");
  const isRTL = i18n.language === "ar";

  const { data, isLoading, error } = useUserStatsQuery();
  const userstats = data?.data;

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 px-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[160px] rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );

  if (error)
    return <p className="text-red-500">{t("errorFetchingStats")}</p>;

  const statsData = [
    {
      title: t("totalUsers"),
      value: userstats?.totalUsers || 0,
      change: "+12%",
      trend: "up",
      icon: <Users size={26} />,
      description: t("allRegisteredUsers"),
    },
    {
      title: t("lawyers"),
      value: userstats?.lawyers || 0,
      change: "+5%",
      trend: "up",
      icon: <FileText size={26} />,
      description: t("registeredLawyers"),
    },
    {
      title: t("approvingLawyers"),
      value: userstats?.approvingLawyers || 0,
      change: "-2%",
      trend: "down",
      icon: <Clock size={26} />,
      description: t("awaitingApproval"),
    },
    {
      title: t("activeUsers"),
      value: userstats?.activeUsers || 0,
      change: "+8%",
      trend: "up",
      icon: <Calendar size={26} />,
      description: t("currentlyActive"),
    },
  ];

  return (
    <div
      className={`mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-2 mb-6 ${
        isRTL ? "text-right" : "text-left"
      }`}
    >
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="relative rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-[#1E1E1E] bg-[#F5F7FA]"
        >
          <div className="px-5 py-2 h-[160px] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold">
                  {stat.title}
                </h3>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  stat.trend === "up"
                    ? "bg-green-600/80"
                    : "bg-[#F59E0B]"
                }`}
              >
                {stat.trend === "up" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {stat.change}
              </div>
            </div>

            {/* Value */}
            <div>
              <p className="text-2xl text-[#0B1F3B] sm:text-3xl font-bold">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-[#6B7280]">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
