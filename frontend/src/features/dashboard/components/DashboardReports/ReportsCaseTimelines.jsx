import React from "react";
import { CalendarDays } from "lucide-react";

const ReportsCaseTimelines = () => {
  const caseTimelines = [
    {
      caseNo: "C-2025-001",
      stage: "Main Case",
      start: "2025-10-10",
      end: "2025-11-05",
      duration: "26 days",
    },
    {
      caseNo: "C-2025-002",
      stage: "Appeal",
      start: "2025-09-25",
      end: "2025-10-20",
      duration: "25 days",
    },
    {
      caseNo: "C-2025-003",
      stage: "Cassation",
      start: "2025-10-15",
      end: "2025-11-01",
      duration: "17 days",
    },
  ];

  return (
    <div className="bg-white  p-6 rounded-xl shadow-lg shadow-[#BCB083] border border-[#f4f6f8] mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-[#A48C65]" />
        <h2 className="text-lg font-semibold text-[#494C52]">
          Case Timelines & Durations
        </h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left text-[#494C52]">
          <thead className="bg-[#A48C65] text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Case No</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
              <th className="px-4 py-3">Duration</th>
            </tr>
          </thead>
          <tbody>
            {caseTimelines.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#f4f6f8] hover:bg-[#f4f6f8] transition"
              >
                <td className="px-4 py-3 font-medium">{item.caseNo}</td>
                <td className="px-4 py-3">{item.stage}</td>
                <td className="px-4 py-3">{item.start}</td>
                <td className="px-4 py-3">{item.end}</td>
                <td className="px-4 py-3 text-[#A48C65] font-semibold">
                  {item.duration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 lg:hidden">
        {caseTimelines.map((item, index) => (
          <div
            key={index}
            className="relative bg-white p-4 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
          >
            {/* Duration Badge at Top */}
            <div className="absolute top-3 right-3">
              <span className="text-[#A48C65] font-semibold text-xs sm:text-sm bg-[#fff7e6] px-3 py-1 rounded-full border border-[#fe9a00]/30">
                {item.duration}
              </span>
            </div>

            {/* Case Header */}
            <h3 className="font-semibold text-[#494C52] text-lg mb-2 truncate">
              {item.caseNo}
            </h3>

            {/* Case Details */}
            <div className="flex flex-col gap-1 text-sm text-gray-700">
              <p>
                <span className="font-medium text-[#494C52]">Stage:</span> {item.stage}
              </p>
              <p>
                <span className="font-medium text-[#494C52]">Start:</span> {item.start}
              </p>
              <p>
                <span className="font-medium text-[#494C52]">End:</span> {item.end}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ReportsCaseTimelines;
