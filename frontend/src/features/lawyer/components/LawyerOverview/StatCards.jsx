import { FileText, CheckCircle, Clock, Calendar } from "lucide-react";
import { useLawyerDashboardStatsQuery } from "../../api/lawyerApi";

const StatCard = ({ icon, title, value }) => (
  <div
    className="relative py-3 ps-2 rounded-lg shadow-lg bg-[white] border-2 border-transparent 
               hover:shadow-xl  transition-all duration-500 group"
  >
    {/* Icon */}
    <div className="absolute top-4 right-4 p-2 rounded-md  group-hover:bg-[#0B1F3B] transition-all duration-500">
      {icon}
    </div>

    {/* Content */}
    <div className="flex flex-col gap-3">
      <span className="text-[#0B1F3B] text-sm font-medium group-hover:text-[#0B1F3B] transition-all duration-500">
        {title}
      </span>
      <div
        className="text-2xl font-bold text-[#0B1F3B] w-fit py-1 px-5 rounded-full"
      >
        {value}
      </div>
    </div>
  </div>
);

const StatCards = () => {
  const { data, isLoading, isError } = useLawyerDashboardStatsQuery();
  const statsData = data?.data;

  if (isLoading)
    return <p className="text-center text-white mt-6">Loading stats...</p>;
  if (isError || !statsData)
    return (
      <p className="text-center text-red-500 mt-6">Failed to load stats.</p>
    );

  const stats = [
    {
      title: "Total Cases",
      value: statsData.totalAssigned ?? 0,
      icon: (
        <FileText className="w-5 h-5 text-[#0B1F3B] group-hover:text-white transition-all duration-500" />
      ),
    },
    {
      title: "Pending Memorandums",
      value: statsData.pendingMyApproval ?? 0,
      icon: (
        <Clock className="w-5 h-5 text-[#0B1F3B] group-hover:text-white transition-all duration-500" />
      ),
    },
    {
      title: "Awaiting Ragab Approval",
      value: statsData.pendingApproval ?? 0,
      icon: (
        <CheckCircle className="w-5 h-5 text-[#0B1F3B] group-hover:text-white transition-all duration-500" />
      ),
    },
    {
      title: "Upcoming Hearings",
      value: statsData.upcomingHearings?.length ?? 0,
      icon: (
        <Calendar className="w-5 h-5 text-[#0B1F3B] group-hover:text-white transition-all duration-500" />
      ),
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
