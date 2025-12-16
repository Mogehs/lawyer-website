import { Users, FileText, Calendar, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { useUserStatsQuery } from "../../api/directorApi";

const StatsCard = () => {
  const { data, isLoading, error } = useUserStatsQuery();
  const userstats = data?.data;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching stats</p>;

  const statsData = [
    {
      title: "Total Users",
      value: userstats?.totalUsers || 0,
      change: "+12%",
      trend: "up",
      icon: <Users className="text-[#A48C65]" size={22} />,
      description: "All registered users",
    },
    {
      title: "Lawyers",
      value: userstats?.lawyers || 0,
      change: "+5%",
      trend: "up",
      icon: <FileText className="text-[#A48C65]" size={22} />,
      description: "Registered lawyers",
    },
    {
      title: "Approving Lawyers",
      value: userstats?.approvingLawyers || 0,
      change: "-2%",
      trend: "down",
      icon: <Clock className="text-[#A48C65]" size={22} />,
      description: "Awaiting approval",
    },
    {
      title: "Active Users",
      value: userstats?.activeUsers || 0,
      change: "+8%",
      trend: "up",
      icon: <Calendar className="text-[#A48C65]" size={22} />,
      description: "Currently active",
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4 px-2">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-[150px]"
          style={{ borderLeft: `4px solid #BCB083` }}
        >
          <div className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#BCB083]/50">{stat.icon}</div>
                <h3 className="text-sm sm:text-base font-medium text-slate-600">{stat.title}</h3>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-2 rounded-full text-[10px] sm:text-xs font-semibold ${
                  stat.trend === "up" ? "bg-[#BCB083] text-white" : "bg-[#A48C65] text-black"
                }`}
              >
                {stat.trend === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {stat.change}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xl sm:text-2xl font-bold text-[#1c283c]">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
