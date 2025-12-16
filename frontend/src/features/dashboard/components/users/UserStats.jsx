import React from "react";

const UserStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 mt-6">
      {stats.map((s, idx) => (
        <div key={idx} className="p-5 rounded-xl bg-[#ffff] shadow-xl flex flex-col gap-3 hover:shadow-xl transition">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white flex items-center justify-center`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">{s.title}</p>
              <p className="text-2xl font-bold text-[#494C52]">{s.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
