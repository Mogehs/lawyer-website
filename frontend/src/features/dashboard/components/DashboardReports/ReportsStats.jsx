import { Users, Scale, CheckCircle, Clock } from "lucide-react";

const ReportsStats = () => {
  
  const stats = [
    { title: "Active Lawyers", value: "8", icon: <Users className="w-6 h-6" /> },
    { title: "Completed Cases", value: "36", icon: <CheckCircle className="w-6 h-6" /> },
    { title: "Pending Submissions", value: "7", icon: <Clock className="w-6 h-6" /> },
    { title: "Upcoming Hearings", value: "5", icon: <Scale className="w-6 h-6" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((item, index) => (
        <div
          key={index}
          className="flex shadow-[#bcb083ce] items-center justify-between bg-white p-5 rounded-2xl shadow-lg 
                     border border-[#BCB083] hover:border-[#BCB083]/40 transition-all duration-200 
                     hover:shadow-xl"
        >
          <div>
            <h3 className="text-sm text-[#494C52] font-medium">{item.title}</h3>
            <p className="text-2xl font-bold text-[#494C52] mt-1">{item.value}</p>
          </div>
          <div className="text-white bg-[#A48C65] p-3 rounded-xl shadow-sm">
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsStats;
