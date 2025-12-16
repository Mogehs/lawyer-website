import { FileText, CheckCircle, Clock, Calendar } from "lucide-react";
import { useLawyerDashboardStatsQuery } from "../../api/lawyerApi";

const StatCard = ({ icon, title, value, bgColor, borderColor }) => (
  <div
    className={`${bgColor} border ${borderColor} relative p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-white hover:border-[#A48D66] hover:-translate-y-2 group`}
  >
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-md group-hover:bg-[#A48D66] transition-all duration-500  absolute top-0 right-0">{icon}</div>
      <div className="flex flex-col gap-4">
        <span className="text-slate-500 text-[18px] font-medium block group-hover:text-[#A48D66]">
          {title}
        </span>
        <div className="text-lg font-bold text-slate-800 shadow-md bg-gray-200 w-fit py-0.5 px-5 rounded-full border-2 border-gray-400 group-hover:border-[#A48D66] group-hover:text-[#A48D66] transition-all duration-500">{value}</div>
      </div>
    </div>
  </div>
);

const StatCards = () => {
  const { data, isLoading, isError } = useLawyerDashboardStatsQuery();
  const statsData = data?.data; // API returns { success: true, data: {...} }

  if (isLoading)
    return <p className="text-center text-slate-700">Loading stats...</p>;
  if (isError || !statsData)
    return <p className="text-center text-red-500">Failed to load stats.</p>;

  const stats = [
    {
      title: "Total Cases",
      value: statsData.totalAssigned ?? 0,
      icon: <FileText className="w-5 h-5 text-[#A48D66] group-hover:text-white transition-all duration-500" />,
      bgColor: "bg-white",
      borderColor: "border-slate-200",
    },
    {
      title: "Pending Memorandums",
      value: statsData.pendingMyApproval ?? 0,
      icon: <Clock className="w-5 h-5 text-[#A48D66] group-hover:text-white transition-all duration-500" />,
      bgColor: "bg-white",
      borderColor: "border-slate-200",
    },
    {
      title: "Awaiting Ragab Approval",
      value: statsData.pendingApproval ?? 0,
      icon: <CheckCircle className="w-5 h-5 text-[#A48D66] group-hover:text-white transition-all duration-500" />,
      bgColor: "bg-white",
      borderColor: "border-slate-200",
    },
    {
      title: "Upcoming Hearings",
      value: statsData.upcomingHearings?.length ?? 0,
      icon: <Calendar className="w-5 h-5 text-[#A48D66] group-hover:text-white transition-all duration-500" />,
      bgColor: "bg-white",
      borderColor: "border-slate-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 mt-8">
      {stats.map((item, index) => (
        <StatCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StatCards;
