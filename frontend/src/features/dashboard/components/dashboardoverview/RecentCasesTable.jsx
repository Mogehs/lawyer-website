import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { useGetAllCasesQuery } from "../../api/directorApi";

const RecentCasesTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetAllCasesQuery();

  const recentCases = data?.data || [];
console.log(recentCases)
  // Sort by createdAt descending (most recent first) and limit to 6
  const sortedCases = [...recentCases]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-[#fe9a00]/10 text-[#fe9a00]";
      case "Pending Approval":
        return "bg-[#1c283c]/10 text-[#1c283c]";
      case "Document Review":
        return "bg-gray-100 text-gray-800";
      case "Completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCases = sortedCases.filter(
    (caseItem) =>
      caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.clientId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:mt-20 mt-10 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1c283c]">
          Recent Cases
        </h2>

        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BCB083] opacity-80"
            size={18}
          />
          <input
            type="text"
            placeholder="Search cases..."
            className="w-full bg-[#fff] text-black placeholder-black border border-[#BCB083] rounded-lg py-2 pl-10 pr-4 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#BCB083] transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden border border-gray-100 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[#A48C65] text-white">
            <tr>
              <th className="text-left py-3 px-5 font-semibold">Case Number</th>
              <th className="text-left py-3 px-5 font-semibold">Client</th>
              <th className="text-left py-3 px-5 font-semibold">Assigned Lawyer</th>
              <th className="text-left py-3 px-5 font-semibold">Type</th>
              <th className="text-left py-3 px-5 font-semibold">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredCases.map((caseItem, index) => (
              <tr
                key={index}
                className="hover:bg-[#fe9a00]/5 transition-all duration-200"
              >
                <td className="py-4 px-5 text-[#1c283c]/80 font-medium font-mono">
                  {caseItem.caseNumber}
                </td>
                <td className="py-4 px-5">
                  <div>
                    <p className="font-semibold text-[#1c283c]">
                      {caseItem.clientId?.name}
                    </p>
                    <p className="text-xs text-gray-500">{caseItem.clientId?.email}</p>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <div>
                    <p className="font-semibold text-[#1c283c]">
                      {caseItem.assignedLawyer?.name}
                    </p>
                    <p className="text-xs text-gray-500">{caseItem.clientId?.email}</p>
                  </div>
                </td>
                <td className="py-4 px-5 text-[#1c283c]/70">
                  {caseItem.caseType}
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      caseItem.status
                    )}`}
                  >
                    {caseItem.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCases.map((caseItem, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-semibold text-[#1c283c]/80">
                {caseItem.caseNumber}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                  caseItem.status
                )}`}
              >
                {caseItem.status}
              </span>
            </div>
            <p className="font-semibold text-[#1c283c]">
              {caseItem.clientId?.name}
            </p>
            <p className="text-xs text-gray-500 mb-2">{caseItem.clientId?.email}</p>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-[#1c283c]/70">{caseItem.caseType}</span>
              <button className="text-[#A48C65] hover:text-[#1c283c] text-xs font-medium flex items-center gap-1">
                View <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-5 border-t border-gray-100 gap-2">
        <p className="text-sm text-gray-500">
          Showing <b>{filteredCases.length}</b> of <b>{recentCases.length}</b> cases
        </p>
        <Link to="all-cases" className="flex items-center gap-2 text-sm font-medium text-[#A48C65] hover:text-[#BCB083] transition-all">
          View All Cases
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RecentCasesTable;
