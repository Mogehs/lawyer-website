import { FileText, CheckCircle, Clock, Calendar } from "lucide-react";
import { useLawyerDashboardStatsQuery } from "../../api/lawyerApi";
import { useTranslation } from "react-i18next";

const StatCard = ({ icon, title, value, isRTL }) => (
  <div
    className={`relative py-3 px-2 rounded-lg shadow-lg bg-white border-2 border-transparent 
               hover:shadow-xl transition-all duration-500 ${
                 isRTL ? "text-right" : "text-left"
               }`}
  >
    {/* Icon */}
    <div
      className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} p-2 rounded-md  
                  group-hover:bg-[#0B1F3B] transition-all duration-500`}
    >
      {icon}
    </div>

    {/* Content */}
    <div className="flex flex-col gap-3">
      <span className="text-[#0B1F3B] text-sm font-medium transition-all duration-500">
        {title}
      </span>
      <div className="text-2xl font-bold text-[#0B1F3B] w-fit py-1 px-5 rounded-full">
        {value}
      </div>
    </div>
  </div>
);

const StatCards = () => {
  const { data, isLoading, isError } = useLawyerDashboardStatsQuery();
  const { t, i18n } = useTranslation("lawyeroverview");
  const isRTL = i18n.dir() === "rtl";

  const statsData = data?.data;

  if (isLoading)
    return <p className="text-center text-white mt-6">{t("recentActivities.loading")}</p>;
  if (isError || !statsData)
    return <p className="text-center text-red-500 mt-6">{t("recentActivities.error")}</p>;

  const stats = [
    {
      title: t("statCards.cases"),
      value: statsData.totalAssigned ?? 0,
      icon: <FileText className="w-5 h-5 text-[#0B1F3B] transition-all duration-500" />,
    },
    {
      title: t("statCards.memorandums"),
      value: statsData.pendingMyApproval ?? 0,
      icon: <Clock className="w-5 h-5 text-[#0B1F3B] transition-all duration-500" />,
    },
    {
      title: t("statCards.approvals"),
      value: statsData.pendingApproval ?? 0,
      icon: <CheckCircle className="w-5 h-5 text-[#0B1F3B] transition-all duration-500" />,
    },
    {
      title: t("statCards.hearings"),
      value: statsData.upcomingHearings?.length ?? 0,
      icon: <Calendar className="w-5 h-5 text-[#0B1F3B] transition-all duration-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 mt-8">
      {stats.map((item, index) => (
        <StatCard key={index} {...item} isRTL={isRTL} />
      ))}
    </div>
  );
};

export default StatCards;
